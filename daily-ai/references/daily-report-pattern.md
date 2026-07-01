# Daily Report Automation Pattern

Use this pattern for AI daily reports, industry digests, GitHub trend reports, article roundups, or similar recurring content products.

## V1 Collection Rules

Prefer sources with public metrics and stable APIs:

- GitHub Search API: stars, pushed time, created time, topics, descriptions
- Hacker News Algolia API: points, comments, created time, story URL
- Official company blogs and changelogs: published time and canonical URL
- Known personal blogs/social feeds only when they have stable public access

Avoid paid APIs and fragile scraping in v1 unless the user approves them.

## Candidate Selection

Use a simple funnel:

1. Collect candidates from configured sources.
2. Deduplicate by canonical URL or repo full name.
3. Keep items with measurable recency or popularity.
4. Group by section, such as:
   - GitHub hot projects
   - HN hot discussions
   - Official AI company updates
   - AI builders/researchers
5. Let the AI synthesize Chinese summaries from candidate metadata and verified source pages.

## Report Template

Required sections for a Chinese report:

- Title with date
- One-paragraph executive summary
- Top 3 highlights
- GitHub hot projects with links and metrics
- HN or community hot discussions with translated titles, links, points, comments
- Official/company/personal source updates with links
- Today worth following
- Source notes and limitations

## Quality Bar

- Every listed item has a link.
- English titles are translated or paired with Chinese explanation.
- Metrics are visible when they drive selection.
- The report separates facts from interpretation.
- Claims about latest/hot content are verified for the target date.
- No private workflow names, private tokens, local paths, or user-only integration IDs appear in public output.

## Typical Commands

```bash
node scripts/v1/collect-v1.mjs --date YYYY-MM-DD
node scripts/v1/check-report.mjs reports/v1/YYYY-MM-DD.md
```

If scripts do not support flags yet, document the current exact command and add flag support to the roadmap.
