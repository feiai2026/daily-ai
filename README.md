# Daily AI

一个零成本、平台无关的中文 AI 日报工作流。

它使用公开 API 收集 GitHub 和 Hacker News 候选内容，再由具备联网与文件操作能力的 AI Agent 核验官方来源、筛选重点并生成固定格式的中文日报。

## 特点

- 不依赖付费 API
- 不依赖网站登录态
- 使用 GitHub stars、更新时间、HN points/comments 等客观指标
- 优先引用官方原文和作者原文
- 输出结构稳定的中文 Markdown 日报
- 可由任意支持 Node.js、联网和文件读写的 AI Agent 执行

## 快速开始

环境要求：Node.js 18 或更高版本。

```bash
git clone https://github.com/feiai2026/daily-ai.git
cd daily-ai
node scripts/v1/collect-v1.mjs
```

默认配置将 GitHub Search 请求控制在未认证免费限额内。频繁运行时，可以选择设置一个只读 GitHub token 提高 API 限额：

```bash
export GITHUB_TOKEN="your_read_only_token"
```

不要把 token 写入仓库。

候选数据会保存到：

```text
reports/v1/YYYY-MM-DD-candidates.json
```

然后让 AI Agent：

1. 读取 `WORKFLOW.md`
2. 按 `docs/v1/generation-method.md` 筛选候选
3. 使用 `templates/v1/daily-report-template.md` 生成日报
4. 保存为 `reports/v1/YYYY-MM-DD.md`
5. 运行质量检查：

```bash
node scripts/v1/check-report.mjs reports/v1/YYYY-MM-DD.md
```

## 项目结构

```text
daily-ai/
  README.md
  WORKFLOW.md
  CHANGELOG.md
  LICENSE
  config/
    v1/
      sources.json
  docs/
    roadmap.md
    versioning.md
    v1/
      generation-method.md
  reports/
    v1/
      sample.md
  scripts/
    v1/
      collect-v1.mjs
      check-report.mjs
  templates/
    v1/
      daily-report-template.md
```

## 当前边界

v1 只自动采集 GitHub 和 Hacker News。官方博客与独立作者内容需要 AI Agent 根据配置文件继续联网核验。

项目不包含定时器。你可以使用 cron、GitHub Actions、各类 Agent 自动化平台或系统任务调度器定时运行。

## License

[MIT](LICENSE)
