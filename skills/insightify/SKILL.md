---
name: insightify
description: Generate complete VitePress documentation from an unstructured code repository.
---

# Insightify Pipeline Orchestrator

When the user runs this skill, execute the 6-stage documentation pipeline sequentially. Do NOT skip any steps unless explicitly requested by the user.

## CLI Argument Parsing & Invocation
Support the following invocation patterns:
- `/insightify` -> Interactive: prompt for project name and sources
- `/insightify <url>` -> Use URL as first source, prompt for project name, then prompt for additional sources
- `/insightify --project <name> --source <path>` -> Non-interactive
- `/insightify --config <path>` -> Read from `insightify.config.json`
- `/insightify --dry-run` -> Show execution plan without running
- `/insightify --resume [--from-stage N]` -> Resume from last completed stage or specified stage

## Pipeline Execution

1. **Stage 1 (Ingest):** Run `insightify-ingest`.
   - *Progress Indicator:* Display `⏳ Ingesting: [===----] X/Y sources`
   - *Error Handling:* If partial failure, log in manifest as `failed` and continue.
2. **Stage 2 (Extract):** Run `insightify-extract`.
   - *Progress Indicator:* Display `⏳ Extracting: [======-] X/Y categories`
   - *Error Handling:* If category fails, write empty file and note in `unanswered.md`.
3. **Stage 3 (Plan):** Run `insightify-plan`.
   - *Progress Indicator:* Display `⏳ Planning: generating plan...`
   - *Error Handling:* Prompt user with the plan. If no response after 5 mins, present summary again; after 10 mins, exit saving plan as `draft`.
4. **Stage 4 (Write):** Run `insightify-write`. Generate pages in waves.
   - *Progress Indicator:* Display `⏳ Writing: Wave X/Y — [======--] A/B pages`
   - *Error Handling:* If single page fails, log error, continue other pages, report failed pages to user.
5. **Stage 5 (Review):** Run `insightify-review`.
   - *Progress Indicator:* Display `⏳ Reviewing: [========] X/Y dimensions (iteration 1/3)`
   - *Error Handling:* If review loop exceeds 3 iterations, stop and report to user.
6. **Stage 6 (Build):** Run `insightify-build`. Print success summary.
   - *Progress Indicator:* Display `⏳ Building: generating config, sidebar, index...`

## Workspace Constraints
- Determine the output directory based on the project name: `OUT_DIR = "insights/<project-name>/"`. All pipeline stages MUST operate within this `OUT_DIR`.
- All intermediate data MUST be stored in `[OUT_DIR]/.insightify/` relative to the current workspace.
- The final output is the `[OUT_DIR]/docs/` folder, `[OUT_DIR]/knowledge-base/` folder, `[OUT_DIR]/.vitepress/` config, and `[OUT_DIR]/package.json`.
- Detect missing `[OUT_DIR]/.insightify/` directory on resume and offer to restart or resume from last completed stage.
