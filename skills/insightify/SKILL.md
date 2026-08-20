---
name: insightify
description: Generate artifact-style documentation and knowledge base from an unstructured code repository.
---

# Insightify Pipeline Orchestrator

When the user runs this skill, execute the 4-stage documentation pipeline sequentially. Do NOT skip any steps unless explicitly requested by the user.

## CLI Argument Parsing & Invocation

Support the following invocation patterns:
- `/insightify` -> Interactive: prompt for project name and sources
- `/insightify <url>` -> Use URL as first source, prompt for project name, then prompt for additional sources
- `/insightify --project <name> --source <path>` -> Non-interactive
- `/insightify --config <path>` -> Read from `insightify.config.json`
- `/insightify --dry-run` -> Show execution plan without running
- `/insightify --resume [--from-step N]` -> Resume from last completed step or specified step (1=planner, 2=writer, 3=reviewer, 4=builder)

## Pipeline Execution

1. **Planner:** Run `planner`.
   - Progress: `⏳ Planner: ingesting sources, extracting knowledge, generating plan...`
   - Error: If partial failure, log in manifest as `failed` and continue.
2. **Writer:** Run `writer`. Generate pages in waves.
   - Progress: `⏳ Writer: Wave X/Y — [======--] A/B pages`
   - Error: If single page fails, log error, continue other pages, report failed pages.
3. **Reviewer:** Run `reviewer`.
   - Progress: `⏳ Reviewer: [========] X/Y dimensions (iteration 1/3)`
   - Error: If review loop exceeds 3 iterations, stop and report to user.
4. **Builder:** Run `builder`. Print success summary.
   - Progress: `⏳ Builder: rendering index.html and knowledge-base.md...`

## Workspace Constraints

- Output directory: `OUT_DIR = "insights/<project-name>/"`. All pipeline stages MUST operate within this `OUT_DIR`.
- All intermediate data in `[OUT_DIR]/.insightify/`.
- Final output: `[OUT_DIR]/index.html`, `[OUT_DIR]/knowledge-base.md`, `[OUT_DIR]/docs/` (archive), `[OUT_DIR]/.insightify/` (workspace).
- Detect missing `[OUT_DIR]/.insightify/` on resume and offer to restart or resume from last completed step.