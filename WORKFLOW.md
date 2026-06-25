# Daily AI 执行入口

当前稳定版本：v1

## 目标

每天生成一份中文 AI 日报：

```text
reports/v1/YYYY-MM-DD.md
```

原始候选列表保存为：

```text
reports/v1/YYYY-MM-DD-candidates.json
```

## 必读文件

请按顺序读取：

1. `docs/v1/generation-method.md`
2. `templates/v1/daily-report-template.md`
3. `config/v1/sources.json`

## 执行步骤

### 1. 收集量化候选

```bash
node scripts/v1/collect-v1.mjs
```

### 2. 补充核验公开来源

检查配置文件中的：

- 官方公司博客
- 独立作者与技术媒体

只使用公开可访问页面，不依赖登录态或付费 API。

### 3. 筛选和去重

按 `docs/v1/generation-method.md` 的量化阈值、来源优先级和去重规则选出：

- 今日必读：3-6 条
- GitHub / 开源观察：3-5 条
- 公司动态：1-5 条
- 社区讨论：1-5 条
- 个人 / 独立作者：0-3 条

### 4. 生成日报

按 `templates/v1/daily-report-template.md` 生成：

```text
reports/v1/YYYY-MM-DD.md
```

### 5. 质量检查

```bash
node scripts/v1/check-report.mjs reports/v1/YYYY-MM-DD.md
```

## v1 约束

- 默认输出中文。
- 不使用付费 X API。
- 不依赖登录态。
- 优先使用 GitHub stars、forks、创建时间、最近更新时间、HN points/comments 等客观指标。
- 每条入选内容必须有可点击链接。
- GitHub 条目必须有仓库链接。
- 英文标题必须翻译成中文，可以保留英文原题。
- 同一事件只保留一个主条目。
- 优先引用官方原文或作者原文。
- 不使用复杂的模型主观评分作为主要筛选依据。

## 完成标准

- 日报符合固定模板。
- 不包含空链接或模板占位符。
- 没有重复三级标题。
- 每条重点内容都解释了“为什么值得看”。
- 量化指标能够回溯到公开页面或 API。

