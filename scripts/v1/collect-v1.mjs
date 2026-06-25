import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "../..");
const config = JSON.parse(
  await fs.readFile(path.join(root, "config/v1/sources.json"), "utf8")
);

const today = new Date().toISOString().slice(0, 10);
const outputPath = path.join(root, `reports/v1/${today}-candidates.json`);

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function toUnixSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}

async function getJson(url) {
  const headers = { "user-agent": "daily-ai-public-v1" };
  if (process.env.GITHUB_TOKEN && url.startsWith("https://api.github.com/")) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(url, {
    headers
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

function githubItem(repo, query, candidateKind, trustedOrg) {
  return {
    type: "github",
    candidate_kind: candidateKind,
    query,
    repo: repo.full_name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    created_at: repo.created_at,
    pushed_at: repo.pushed_at,
    owner: repo.owner?.login ?? "",
    trusted_org: trustedOrg,
    metrics_text: `${repo.stargazers_count} stars, ${repo.forks_count} forks`
  };
}

async function searchGithub(query, qualifiers) {
  const q = encodeURIComponent(`${query} ${qualifiers}`);
  return getJson(
    `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=10`
  );
}

async function collectGithub() {
  const items = [];
  const errors = [];
  const activeSince = toDateString(
    daysAgo(config.github.thresholds.activeWithinDays)
  );
  const newSince = toDateString(
    daysAgo(config.github.thresholds.newRepoWithinDays)
  );

  for (const query of config.github.queries) {
    try {
      const [active, newlyCreated] = await Promise.all([
        searchGithub(query, `pushed:>=${activeSince}`),
        searchGithub(query, `created:>=${newSince}`)
      ]);

      for (const repo of active.items ?? []) {
        const owner = repo.owner?.login ?? "";
        const trusted = config.github.trustedOrgs.some(
          (org) => org.toLowerCase() === owner.toLowerCase()
        );
        const pass =
          repo.stargazers_count >= config.github.thresholds.minStarsRecent ||
          (trusted &&
            repo.stargazers_count >=
              config.github.thresholds.minStarsTrustedOrg);
        if (pass) items.push(githubItem(repo, query, "active", trusted));
      }

      for (const repo of newlyCreated.items ?? []) {
        if (
          repo.stargazers_count >= config.github.thresholds.minStarsNewRepo
        ) {
          const owner = repo.owner?.login ?? "";
          const trusted = config.github.trustedOrgs.some(
            (org) => org.toLowerCase() === owner.toLowerCase()
          );
          items.push(githubItem(repo, query, "new", trusted));
        }
      }
    } catch (error) {
      errors.push({ source: "github", query, error: error.message });
    }
  }

  return {
    items: dedupeBy(items, (item) => item.url).slice(0, 50),
    errors
  };
}

async function collectHackerNews() {
  const items = [];
  const errors = [];
  const since = toUnixSeconds(daysAgo(config.hackerNews.lookbackDays));

  for (const query of config.hackerNews.queries) {
    const url =
      "https://hn.algolia.com/api/v1/search_by_date?tags=story" +
      `&query=${encodeURIComponent(query)}` +
      `&numericFilters=created_at_i>${since}`;
    try {
      const data = await getJson(url);
      for (const story of data.hits ?? []) {
        const points = story.points ?? 0;
        const comments = story.num_comments ?? 0;
        if (
          points < config.hackerNews.thresholds.minPoints &&
          comments < config.hackerNews.thresholds.minComments
        ) {
          continue;
        }
        items.push({
          type: "hacker_news",
          query,
          title: story.title,
          original_url: story.url,
          discussion_url: `https://news.ycombinator.com/item?id=${story.objectID}`,
          points,
          comments,
          created_at: story.created_at,
          metrics_text: `${points} points, ${comments} comments`
        });
      }
    } catch (error) {
      errors.push({ source: "hacker_news", query, error: error.message });
    }
  }

  return {
    items: dedupeBy(
      items,
      (item) => item.original_url || item.discussion_url
    ).slice(0, 30),
    errors
  };
}

function dedupeBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const [github, hackerNews] = await Promise.all([
  collectGithub(),
  collectHackerNews()
]);

const output = {
  generated_at: new Date().toISOString(),
  version: config.version,
  github: github.items,
  hacker_news: hackerNews.items,
  official_sources_to_check: config.officialSources,
  personal_sources_to_check: config.personalSources,
  errors: [...github.errors, ...hackerNews.errors]
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${outputPath}`);
