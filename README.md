# Daily AI

一个零成本、平台无关的中文 AI 日报工作流。

它使用公开 API 收集 GitHub 和 Hacker News 候选内容，再由具备联网与文件操作能力的 AI Agent 核验官方来源、筛选重点并生成固定格式的中文日报。

## Agent Skill

本仓库同时提供一个跨 Agent 的 AI 日报与自动化项目工作流 skill：

```text
daily-ai/
```

它遵循 `SKILL.md` 结构，适合 Codex、Claude Code、OpenCode、OpenClaw 等支持 Agent Skills / SKILL.md 的 Agent 使用。用途是把周期报告、定时收集、监控任务、交接给其他执行器的自动化需求，整理成可执行、可版本化、可交接的小项目。

支持 skill 安装的 Agent 可以直接安装：

```text
帮我安装这个 skill：
https://github.com/feiai2026/daily-ai/tree/main/daily-ai
```

也可以用脚本安装到本机常见 Agent skill 目录：

```bash
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash
```

指定安装目标：

```bash
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- codex
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- claude
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- openclaw
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- opencode
curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- all
```

安装后重启对应 Agent，然后使用：

```text
$daily-ai
```

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
  daily-ai/
    SKILL.md
    references/
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
