# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Commands

- **Run tests**: `npm test` (runs `node --test`, discovers `tests/**/*.test.js`)
- **Install dependencies**: `npm install`
- No lint, typecheck, or format commands exist. No CI workflows.

## What This Is

Insightify is a **Claude Code plugin** (v6.2.0) that generates technical documentation from codebases. It produces two artifacts: a self-contained HTML spec page and a knowledge-base markdown file.

The "pipeline" is not runtime code — it's **AI agent instructions** (SKILL.md files) that an LLM executes step-by-step. The only executable JS code is parsers and the builder template engine.

## Architecture

4-stage sequential pipeline orchestrated by `skills/insightify/SKILL.md`:

1. **Planner** (`skills/planner/SKILL.md`) — Ingests sources, extracts knowledge, generates plan
2. **Writer** (`skills/writer/SKILL.md`) — Generates 14 markdown doc pages from templates
3. **Reviewer** (`skills/reviewer/SKILL.md`) — Reviews across 9 quality dimensions, max 3 iterations
4. **Builder** (`skills/builder/SKILL.md`) — Renders final HTML artifact + knowledge base

Each stage has a standalone invocation (e.g., `/insightify-planner`) and an orchestrated mode.

## Key Structural Facts

- **Skill definitions** (`skills/*/SKILL.md`) are the primary source of truth. Tests validate their content structure extensively.
- **14 knowledge categories** (product, directory-structure, data-models, component-architecture, state-management, routing-structure, ui-component-library, api-patterns, features, cross-cutting, terminology, constraints, workflows, unanswered).
- **Parsers** (`skills/planner/parsers/*.js`) are CommonJS — `code-parser.js`, `html-parser.js`, `json-parser.js`, `pdf-parser.js`, `directory-scanner.js`.
- **Builder** (`skills/builder/templates/build-html.mjs`) is ESM. Tests import it via dynamic `import()`.
- **Writer templates** (`skills/writer/templates/*.md`) — 14 markdown templates with YAML frontmatter.
- **Output** goes to `insights/<project-name>/` relative to the target project.
- **Workspace** for intermediate data: `[OUT_DIR]/.insightify/`.

## Testing

- Tests validate SKILL.md content (required sections, keywords, structure) — not just behavior.
- `tests/build-templates.test.js` is the largest suite (~27 tests). Uses `jsdom` for DOM/JS runtime testing of `scripts.js`.
- `tests/fixtures/sample-14-kb/` is a generated fixture (14 `.md` files with frontmatter) used by build tests.
- Some tests in `build-templates.test.js` are commented out (template placeholder assertions) — these are intentional skips, not failures.

## Conventions

- This is a **plugin repo**, not a library or app. Changes to SKILL.md files change agent behavior, not runtime code.
- `plugin.json` and `.claude-plugin/plugin.json` must stay version-synced with `package.json`.
- No TypeScript. No bundler. No dev server.
- Dependencies: `cheerio`, `pdf-parse`, `marked`, `jsdom`, `mermaid`.
