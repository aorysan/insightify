# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run unit tests**: `npm test` (Runs native Node.js test runner across all tests)
- **Install dependencies**: `npm install` (Dependencies include `cheerio`, `pdf-parse`, `marked`, `jsdom`, `mermaid`)

## Architecture Overview (v6.1.0)

Insightify is a multi-platform documentation generator plugin structured as a 4-stage pipeline orchestrated by a central skill. The architecture uses a "Multi-Skill Pipeline with Per-Stage Folders" approach producing two primary deliverables:
1. **Single Artifact HTML (`index.html`)**: Self-contained technical specification page with CSS sidebar, dark/light theme toggle, Mermaid diagram rendering, collapsible sections, and print styles.
2. **Comprehensive Knowledge Base (`knowledge-base.md`)**: Complete reference document concatenating Planner's structured knowledge categories (archetype-dependent set) with blockquote source citations.

### Pipeline Stages and Skills

The entry point is `skills/insightify/SKILL.md`, which orchestrates four independent stage skills:

1. **Stage 1 (Planner)**: `skills/planner/SKILL.md`
   - Ingests source code, markdown, HTML, and PDFs using parsers (`code-parser.js`, `json-parser.js`, `directory-scanner.js`, `html-parser.js`, `pdf-parser.js`).
   - Extracts structured knowledge into the category set for the detected archetype (`frontend-spa`, `backend-api`, `system-design`, `general`; see Planner Phase 0).
   - Generates a 14-page, 5-wave documentation plan (`.insightify/plan.md`) requiring user approval before writing.
2. **Stage 2 (Writer)**: `skills/writer/SKILL.md`
   - Generates markdown documentation pages under `docs/markdown/` in 5 dependency-aware waves using 14 specialized templates.
3. **Stage 3 (Reviewer)**: `skills/reviewer/SKILL.md`
   - Automatically evaluates generated docs across 9 quality dimensions (Accuracy, Completeness, Consistency, Structure, Usability, Type Safety, Architecture Alignment, Business Alignment, Scannability) on a 1-5 rubric.
   - If revisions are needed, sends targeted issues back to Stage 2 (max 3 iterations).
4. **Stage 4 (Builder)**: `skills/builder/SKILL.md`
   - Assembles the single-page HTML artifact (`docs/index.html`) and the consolidated knowledge base (`docs/knowledge-base.md`) via `build-html.mjs`.

### Data Flow & State Management

- All stages communicate through a temporary workspace directory (`.insightify/`) created relative to the target project.
- **Stage skills operate in two modes**:
  - **Orchestrated**: Called by `skills/insightify/SKILL.md` during a full run.
  - **Standalone**: Called directly via their own commands (e.g., `/insightify-planner`) for manual execution.
- **Knowledge Traceability**: Every extracted fact in the Knowledge Base includes a blockquote citation tracing it back to the original source ID.

### External Dependencies

- `pdf-parse`: For extracting text from PDF files.
- `cheerio`: For parsing and cleaning HTML content.
- `marked`: For Markdown to HTML rendering.
- `jsdom`: For DOM manipulation in builder scripts.
- `mermaid`: For diagram rendering.
- Node.js native features: Uses Node.js built-in `node:test` runner.
