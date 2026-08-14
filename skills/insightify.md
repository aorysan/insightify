---
name: insightify
description: Generate complete VitePress documentation from an unstructured code repository.
---

# Insightify Pipeline Orchestrator

When the user runs this skill, execute the 6-stage documentation pipeline sequentially. Do NOT skip any steps unless explicitly requested by the user.

## Pipeline

1. **Stage 1 (Ingest):** Run `insightify-ingest`. Wait for completion.
2. **Stage 2 (Extract):** Run `insightify-extract`. Wait for completion.
3. **Stage 3 (Plan):** Run `insightify-plan`. Prompt the user with the plan and wait for their approval.
4. **Stage 4 (Write):** Run `insightify-write`. Generate pages in waves.
5. **Stage 5 (Review):** Run `insightify-review`. If verdict is `changes_needed`, loop back to Stage 4. Max 3 iterations.
6. **Stage 6 (Build):** Run `insightify-build`. Print success summary.

## Workspace Constraints
- All intermediate data MUST be stored in `.insightify/` relative to the target directory.
- The final output is the `docs/` folder, `knowledge-base/` folder, `.vitepress` config, and `package.json`.
