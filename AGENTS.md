# AGENTS.md

This file provides guidance to AI coding agents (like Antigravity and others) when working with code in this repository.

## Commands

- **Run unit tests**: `npm test` (Runs native Node.js test runner)
- **Install dependencies**: `npm install` (Uses standard npm; dependencies include `cheerio`, `pdf-parse`, `marked`, `jsdom`, and `mermaid`)

## Architecture Overview

Insightify is a multi-platform documentation generator plugin structured as a 4-stage sequential pipeline orchestrated by a central skill. The architecture uses a "Multi-Skill Pipeline with Per-Stage Folders" approach.

### Pipeline Stages and Skills

The entry point is `skills/insightify/SKILL.md`, which orchestrates four independent stage skills:

1. **Stage 1 (Planner)**: `skills/planner/SKILL.md` - Ingests sources (files, URLs), extracts structured product knowledge (14 categories), and generates a documentation plan (`.insightify/plan.md`) requiring user approval.
2. **Stage 2 (Writer)**: `skills/writer/SKILL.md` - Generates markdown documentation pages under `docs/markdown/` in 5 dependency-aware waves based on the approved plan.
3. **Stage 3 (Reviewer)**: `skills/reviewer/SKILL.md` - Automatically reviews generated docs across 7 dimensions. If revisions are needed, sends targeted issues back to Writer (max 3 iterations).
4. **Stage 4 (Builder)**: `skills/builder/SKILL.md` - Renders documentation as single artifact-style HTML (`index.html`) and assembles knowledge base (`knowledge-base.md`).

### Data Flow & State Management

- All stages communicate through a temporary workspace directory (`.insightify/`) created relative to the target project.
- **Stage skills operate in two modes**:
  - **Orchestrated**: Called by `insightify.md` during a full run.
  - **Standalone**: Called directly via their own commands (e.g., `/insightify-planner`, `/writer`, `/reviewer`, `/builder`) for manual execution.
- **Knowledge Traceability**: Every extracted fact in the Knowledge Base includes a blockquote citation tracing it back to the original source ID.

### External Dependencies

- `pdf-parse`: For extracting text from PDF files in Stage 1 (Planner).
- `cheerio`: For parsing and cleaning HTML content in Stage 1 (Planner).
- `marked`: For converting Markdown to HTML in Stage 4 (Builder).
- `jsdom`: For DOM manipulation and script testing in Stage 4 (Builder).
- `mermaid`: For diagram support in the HTML documentation.
- Node.js native features: Uses Node.js built-in `node:test` runner.