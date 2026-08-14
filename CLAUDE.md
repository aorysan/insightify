# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run unit tests**: `npm test` (Runs native Node.js test runner against `tests/*.test.js`)
- **Install dependencies**: `npm install` (Uses standard npm; dependencies include `cheerio` and `pdf-parse`)

## Architecture Overview

Insightify is a multi-platform documentation generator plugin structured as a 6-stage sequential pipeline orchestrated by a central skill. The architecture uses a "Multi-Skill Pipeline with Per-Stage Folders" approach.

### Pipeline Stages and Skills

The entry point is `skills/insightify.md`, which orchestrates six independent stage skills:

1. **Stage 1 (Ingest)**: `skills/ingest/ingest.md` - Reads inputs (files, URLs) using parsers (`code-parser.js`, `html-parser.js`, `pdf-parser.js`) and outputs normalized markdown to `.insightify/sources/`.
2. **Stage 2 (Extract)**: `skills/extract/extract.md` - Extracts structured product knowledge from sources into specific categories using LLM extraction schemas. Outputs to `.insightify/knowledge/`.
3. **Stage 3 (Plan)**: `skills/plan/plan.md` - Analyzes knowledge and generates a documentation plan (`.insightify/plan.md`) requiring user approval.
4. **Stage 4 (Write)**: `skills/write/write.md` - Generates markdown documentation pages under `docs/` in dependency-aware waves based on the approved plan.
5. **Stage 5 (Review)**: `skills/review/review.md` - Automatically reviews generated docs across 5 dimensions. If revisions are needed, sends targeted issues back to Stage 4 (max 3 iterations).
6. **Stage 6 (Build)**: `skills/build/build.md` - Transforms markdown into a VitePress-ready site (frontmatter, config, sidebar), finalizes the knowledge base, and outputs the final `package.json` and `README.md`.

### Data Flow & State Management

- All stages communicate through a temporary workspace directory (`.insightify/`) created relative to the target project.
- **Stage skills operate in two modes**:
  - **Orchestrated**: Called by `insightify.md` during a full run.
  - **Standalone**: Called directly via their own commands (e.g., `/insightify-extract`) for manual execution.
- **Knowledge Traceability**: Every extracted fact in the Knowledge Base includes a blockquote citation tracing it back to the original source ID.

### External Dependencies

- `pdf-parse`: For extracting text from PDF files in Stage 1.
- `cheerio`: For parsing and cleaning HTML content in Stage 1.
- Node.js native features: Uses Node.js built-in `node:test` runner.
