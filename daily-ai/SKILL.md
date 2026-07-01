---
name: daily-ai
description: Build Daily AI reports and turn recurring automation, monitoring, scheduled collection, periodic reports, daily digests, or handoff-to-runner tasks into small versioned projects. Use when the user wants an agent to discuss requirements first, define deliverables and source rules, create docs/templates/config/scripts/sample outputs, publish or prepare a stable workflow, or hand off execution to another agent, scheduler, GitHub repo, or automation runner.
---

# Daily AI

Use this skill to create AI daily report workflows or convert any repeatable task into a durable, executable project. Default to Chinese output unless the user asks otherwise.

## Core Workflow

1. Clarify the outcome before writing code:
   - final artifact, audience, cadence, success criteria
   - data/source rules, freshness needs, exclusions
   - execution environment, cost constraints, auth constraints
   - what must be stable now versus deferred to roadmap

2. Create a small project, not a loose script:
   - `README.md` for human overview
   - `HANDOFF.md` when another runner or agent will execute it
   - `docs/v1/` for the stable method
   - `templates/v1/` for output templates
   - `config/v1/` for source/config rules
   - `scripts/v1/` for repeatable commands
   - `reports/v1/` or `outputs/v1/` for samples
   - `docs/roadmap.md` for future improvements

3. Keep v1 simple and measurable:
   - prefer platform metrics such as stars, update time, points, comments, published time, official source freshness
   - avoid subjective model scoring unless the user explicitly approves it
   - make scripts deterministic where possible, with AI used for synthesis and language polish

4. Validate before handoff:
   - run scripts once
   - generate or update a sample output
   - check for broken links, missing sections, secrets, personal paths, and hidden private details
   - document exact run commands and expected outputs

5. Version and hand off:
   - commit stable changes when the user asks for GitHub handoff
   - tag releases when useful
   - tell the runner to read `HANDOFF.md` as the execution entrypoint

## Public Sharing Rule

Before publishing a workflow to a public repository, strip runner-specific, private, or personal integrations unless the user explicitly wants a private/internal release. Never commit API keys, tokens, cookies, private folder IDs, private account IDs, or local absolute paths. Use environment variables, local config files, or platform secrets instead.

## References

- Read `references/project-structure.md` when creating or reviewing an automation project layout.
- Read `references/daily-report-pattern.md` when the task is a daily/weekly content digest, AI news report, or source collection workflow.
