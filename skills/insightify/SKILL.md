---
name: insightify
description: Generate comprehensive React/Frontend technical specification documentation (artifact-style HTML + knowledge-base.md) from an unstructured code repository.
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

The pipeline generates a **React/Frontend Technical Specification** matching the reference artifact structure:

| Output | Description |
|--------|-------------|
| `index.html` | Single artifact-style HTML with CSS-only sidebar, Mermaid diagrams, dark/light mode, print support |
| `knowledge-base.md` | 14 concatenated knowledge categories with source citations |

**Documentation Sections (14):**
1. Executive Summary
2. Directory Structure
3. Global Data Models
4. Component Architecture
5. State Management
6. Routing & Layout
7. UI Component Library
8. API Patterns
9. Features & Business Logic
10. Cross-Cutting Concerns
11. Terminology & Glossary
12. Constraints & Limitations
13. Workflows & Procedures
14. Appendix

**Architecture Patterns Enforced:**
- Feature-based modular React (components/ui, features/, hooks/, stores/, services/, types/, utils/)
- TypeScript interfaces with BaseEntity, ApiResponse, PaginatedResponse
- Zustand for global state with persist, immer, devtools middleware
- React Router v6 with layout-driven routing (PublicLayout, AuthLayout, ProtectedLayout) and guards
- TanStack Query v5 for data fetching (useFetchData, useInfiniteQuery, useMutation, useOptimisticUpdate)
- Tailwind CSS with design tokens, class-variance-authority for variants