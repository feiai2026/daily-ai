import fs from "node:fs/promises";

const reportPath = process.argv[2];
if (!reportPath) {
  console.error(
    "用法：node scripts/v1/check-report.mjs reports/v1/YYYY-MM-DD.md"
  );
  process.exit(1);
}

const markdown = await fs.readFile(reportPath, "utf8");
const errors = [];
const warnings = [];

const requiredSections = [
  "## 今日一句话",
  "## 今日必读",
  "## GitHub / 开源观察",
  "## 公司动态",
  "## 社区讨论",
  "## 个人 / 独立作者",
  "## 今日结论"
];

for (const section of requiredSections) {
  if (!markdown.includes(section)) errors.push(`缺少章节：${section}`);
}

if (/\{\{[^}]+\}\}/.test(markdown)) {
  errors.push("仍包含未替换的模板占位符");
}

const urls = [...markdown.matchAll(/https?:\/\/[^\s）)]+/g)].map(
  (match) => match[0]
);
if (urls.length === 0) errors.push("日报中没有任何链接");

const headings = [...markdown.matchAll(/^### (.+)$/gm)].map(
  (match) => match[1].trim()
);
const duplicateHeadings = headings.filter(
  (heading, index) => headings.indexOf(heading) !== index
);
if (duplicateHeadings.length > 0) {
  errors.push(`存在重复三级标题：${[...new Set(duplicateHeadings)].join("、")}`);
}

if (!markdown.includes("为什么值得看：")) {
  errors.push("缺少“为什么值得看”字段");
}

if (!/日期：\d{4}-\d{2}-\d{2}/.test(markdown)) {
  errors.push("缺少 YYYY-MM-DD 格式的日期");
}

if (!markdown.includes("量化信号：")) {
  warnings.push("没有发现“量化信号”字段");
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`OK: ${reportPath} 通过基础质量检查`);

