---
name: planner
description: Stage 1 - Ingest sources, extract knowledge into categories based on detected archetype, and generate documentation plan with user approval.
---

# Planner Skill (Ingest → Extract → Plan)

## Instructions

### Phase 1: Ingest

1. Accept input files or URLs from parameters or prompt. Ensure ingest scripts and parsers strictly use relative paths or config variables instead of absolute paths.
2. For each source, execute the appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `[OUT_DIR]/.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `[OUT_DIR]/.insightify/sources/manifest.md`.

**Supported Input Types:**

| Extension | Parser | Notes |
|-----------|--------|-------|
| `.html`, `.htm` | `parsers/html-parser.js` | Strips nav/footer/scripts, preserves content structure |
| `.js`, `.ts`, `.py`, `.java`, `.go`, `.rs`, `.rb`, `.php`, `.c`, `.cpp`, `.cs` | `parsers/code-parser.js` | Extracts JSDoc/docstrings; falls back to raw code |
| `.pdf` | `parsers/pdf-parser.js` | Binary buffer input via `pdf-parse` |
| `.md`, `.txt`, `.rst` | Direct copy | Copy content as-is with frontmatter added |
| URLs (`http://`, `https://`) | Fetch → HTML parser | Fetch page, then process as HTML |
| Other extensions | Skip | Log warning, mark as `skipped` in manifest |

**URL Fetching:** Timeout 30s, 1 retry on 5xx, User-Agent `Insightify/1.0`.
**File Size Limits:** >5MB warning, >20MB skip as `file_too_large`.

**Normalized Output Frontmatter:**
```yaml
---
source_id: "source-001"
original_path: "path/to/file.js"
type: "code"
parser: "code-parser"
status: "success"
ingested_at: "YYYY-MM-DDTHH:mm:ssZ"
word_count: 1234
---
```

Content headings normalized to start at H2 (`##`). Manifest format: table with Source ID, Path, Type, Status, Words.

### Phase 0: Project Type Detection

1. Analyze the ingested sources to detect the project archetype.
2. Supported archetypes: `frontend-spa`, `backend-api`, `system-design`, `general`.
3. Map the detected archetype to its corresponding knowledge categories:
   - `frontend-spa`: 14 default categories (product, directory-structure, data-models, component-architecture, state-management, routing-structure, ui-component-library, api-patterns, features, cross-cutting, terminology, constraints, workflows, unanswered).
   - `backend-api`: product, directory-structure, data-models, api-patterns, features, cross-cutting, terminology, constraints, workflows, unanswered.
   - `system-design`: product, architecture, constraints, terminology, unanswered.
   - `general`: product, directory-structure, features, terminology, unanswered.

### Phase 2: Extract

1. Read all `[OUT_DIR]/.insightify/sources/*.md` files.
2. For each of the required categories in `references/extraction-schema.md` (based on archetype), analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md § Section Name`) for every fact.
4. Write output to `[OUT_DIR]/.insightify/knowledge/`.

**Knowledge Categories:**
*(Note: The following 14 categories are defaults for `frontend-spa`. Other archetypes use different categories depending on Phase 0).*
1. `product.md` — Product identity, version, audience, tagline
2. `directory-structure.md` — Folder tree, module boundaries, import conventions
3. `data-models.md` — TypeScript interfaces, enums, Mermaid class diagrams
4. `component-architecture.md` — Layout components, shell, feature components, composition tree
5. `state-management.md` — Stores, selectors, middleware, persistence, testing patterns
6. `routing-structure.md` — Route tree, guards, lazy loading, breadcrumbs, metadata
7. `ui-component-library.md` — Component registry, design tokens, accessibility
8. `api-patterns.md` — Client config, hooks, endpoints, error flow, mapping
9. `features.md` — Feature catalog, Gherkin acceptance criteria, edge cases
10. `cross-cutting.md` — Providers (Auth, Theme, i18n), ErrorBoundary, Logger, Analytics, FeatureFlags
11. `terminology.md` — Glossary, acronyms, naming conventions
12. `constraints.md` — Technical limits, performance budgets, security, known issues
13. `workflows.md` — Dev workflows, CI/CD, deployment, release, incident response
14. `unanswered.md` — Conflicts, ambiguities, missing info

**Conflict Handling:** Keep both facts, flag in `unanswered.md`.
**Confidence:** `high` (explicit), `medium` (inferred), `low` (ambiguous).
**Edge Cases:** Uncategorized → `unanswered.md`; thin sources → min `product.md` + `unanswered.md`; empty → skip, log.

**Citation Format:**
```markdown
The API supports up to 1000 concurrent connections.

> **Source:** source-003.md § API Limits
```

### Phase 3: Plan

1. Read `[OUT_DIR]/.insightify/knowledge/*.md` (all extracted categories).
2. Generate plan using `templates/plan-template.md`.
3. Display summary:
   ```
   📝 Documentation Plan: [Project Name]
   🎯 Audience: [Primary & Secondary]
   📄 Pages: [Total count, breakdown by priority]
   🔄 Dependencies: [Number of waves]
   📊 Est. words: [Estimation]
   ```
4. Ask approval: "Approve plan? [Y/n/revise]"
   - Y/Enter → save as `approved`, proceed (plan frontmatter: `status: approved`)
   - n → exit, save as `rejected`
   - revise → prompt "What changes?", regenerate, loop (max 3 cycles). Max 3 revision cycles.

**Page Sizing:** 500–2000 words ideal; >3000 split; <300 merge.
**Merge when:** same audience, one topic <300 words.
**Split when:** distinct audiences, >3000 words, mixed conceptual/reference.
**Priority:** high (getting started, core), medium (features), low (API, FAQ).
**Dependency Graph:** No cycles; max 5 waves; wave 1 = standalone; dependencies strictly reference prior waves.

**Plan Template Output Example (`frontend-spa`, 14 Pages Across 5 Waves):**
| Wave | Pages | Dependencies |
|------|-------|--------------|
| 1 | Executive Summary, Directory Structure, Global Data Models, Terminology & Glossary, Constraints & Limitations | None |
| 2 | Component Architecture, State Management, UI Component Library | Wave 1 (Pages 2, 3) |
| 3 | Routing & Layout Structure, API Interaction Patterns | Waves 1, 2 (Pages 3, 4) |
| 4 | Features & Business Logic, Cross-Cutting Concerns, Workflows & Procedures | Waves 1, 2, 3 (Pages 3, 4, 5, 6, 8) |
| 5 | Appendix | All prior pages |

### Progress & Error Handling

- Ingest: `⏳ Ingesting: [===----] X/Y sources`; partial failure → log `failed`, continue.
- Extract: `⏳ Extracting: [======-] X/Y categories`; category failure → empty file, note in `unanswered.md`.
- Plan: `⏳ Planning: generating plan...`; no response 5min → re-prompt; 10min → save as `draft`, exit.
