---
name: insightify
description: Generate comprehensive technical specification documentation (artifact-style HTML + knowledge-base.md) from an unstructured code repository.
---

# Insightify v4 Pipeline Orchestrator

When the user runs this skill, execute the 4-stage documentation pipeline sequentially. Do NOT skip any steps unless explicitly requested by the user.

## CLI Argument Parsing & Invocation

Support the following invocation patterns:
- `/insightify` -> Interactive: prompt for project name and sources
- `/insightify <url>` -> Use URL as first source, prompt for project name, then prompt for additional sources
- `/insightify --project <name> --source <path>` -> Non-interactive
- `/insightify --config <path>` -> Read from `insightify.config.json`
- `/insightify --dry-run` -> Show execution plan without running
- `/insightify --resume [--from-step N]` -> Resume from last completed step or specified step (1=planner, 2=writer, 3=reviewer, 4=builder)

## Pipeline Execution (4 Stages)

1. **Planner:** Run `planner`.
   - Progress: `⏳ Planner: ingesting sources, extracting 14 knowledge categories, generating plan...`
   - Error: If partial failure, log in manifest as `failed` and continue.
2. **Writer:** Run `writer`. Generate 14 pages in 5 dependency-aware waves.
   - Progress: `⏳ Writer: Wave X/5 — [======--] A/B pages`
   - Error: If single page fails, log error, continue other pages, report failed pages.
3. **Reviewer:** Run `reviewer`.
   - Progress: `⏳ Reviewer: [========] X/7 dimensions (iteration 1/3)`
   - Error: If review loop exceeds 3 iterations, stop and report to user.
4. **Builder:** Run `builder`. Print success summary.
   - Progress: `⏳ Builder: rendering artifact-style index.html and knowledge-base.md...`

## Workspace Constraints

- Output directory: `OUT_DIR = "insights/<project-name>/"`. All pipeline stages MUST operate within this `OUT_DIR`.
- All intermediate data in `[OUT_DIR]/.insightify/`.
- Final output: `[OUT_DIR]/index.html`, `[OUT_DIR]/knowledge-base.md`, `[OUT_DIR]/docs/` (archive), `[OUT_DIR]/.insightify/` (workspace).
- Detect missing `[OUT_DIR]/.insightify/` on resume and offer to restart or resume from last completed step.

## Output Specification (v4)

The pipeline generates a **Technical Specification** matching the reference artifact structure:

| Output | Description |
|--------|-------------|
| `index.html` | Single artifact-style HTML with CSS-only sidebar, Mermaid diagrams, dark/light mode, print support |
| `knowledge-base.md` | 14 concatenated knowledge categories with source citations |

**Documentation Sections (14 Categories):**
1. `product`
2. `directory-structure`
3. `data-models`
4. `component-architecture`
5. `state-management`
6. `routing-structure`
7. `ui-component-library`
8. `api-patterns`
9. `features`
10. `cross-cutting`
11. `terminology`
12. `constraints`
13. `workflows`
14. `appendix`

