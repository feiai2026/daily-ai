# Automation Project Structure

Use this structure for recurring automations that need to be maintained, handed off, or scheduled.

```text
project-name/
├── README.md
├── HANDOFF.md
├── WORKFLOW.md
├── config/
│   └── v1/
│       └── sources.json
├── docs/
│   ├── roadmap.md
│   ├── versioning.md
│   └── v1/
│       └── generation-method.md
├── scripts/
│   └── v1/
│       ├── collect-v1.mjs
│       └── check-output.mjs
├── templates/
│   └── v1/
│       └── output-template.md
└── reports/
    └── v1/
        └── sample.md
```

## File Roles

- `README.md`: Explain what the project does, who it is for, and how to run it.
- `HANDOFF.md`: Single entrypoint for a runner/agent. Include only stable instructions and exact commands.
- `WORKFLOW.md`: Explain the end-to-end workflow and quality gate.
- `config/v1/`: Keep source lists, thresholds, categories, and non-secret options here.
- `docs/v1/`: Store the accepted stable method. Keep it executable and concise.
- `templates/v1/`: Store final output shape with required sections.
- `scripts/v1/`: Store deterministic collection, validation, and formatting scripts.
- `reports/v1/sample.md`: Show the expected final result.
- `docs/roadmap.md`: Store future ideas without changing v1 behavior.

## Handoff Checklist

- The runner can start from `HANDOFF.md` without reading chat history.
- Every command can be copied and run from the repo root.
- Required environment variables are named, but secret values are not included.
- The stable version is explicit, such as `v1.0.0`.
- Known limits and failure handling are documented.
- Sample output passes the checker, if a checker exists.

## Public Repository Checklist

Run a secret/personality scan before pushing public projects:

```bash
rg -n "token|api[_-]?key|secret|cookie|github_pat_|/Users/|ima|trae|folder_|note_|private|个人|授权" .
```

Review all hits manually. False positives are fine; committed secrets are not.
