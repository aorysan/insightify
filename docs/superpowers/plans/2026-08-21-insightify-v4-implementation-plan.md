# Insightify v4 Implementation & Verification Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement and verify the Insightify v4 documentation generator plugin to produce comprehensive, artifact-style React/Frontend technical specifications (single-page HTML with sidebar, Mermaid diagrams, dark/light theme, print support, and concatenated knowledge base) across 14 knowledge categories.

**Architecture:** 4-stage pipeline (Planner [Ingest + Extract + Plan] → Writer [14 Templates in 5 Waves] → Reviewer [7 Dimensions] → Builder [Single Artifact HTML + Knowledge Base]) with shared intermediate workspace in `[OUT_DIR]/.insightify/`.

**Tech Stack:** Node.js native test runner (`node:test`), CommonJS parsers, ES module builder (`build-html.mjs`), `marked`, `jsdom`, `cheerio`, `pdf-parse`, vanilla CSS tokens, vanilla JS client scripts.

**Spec:** `.claude/plugins/insightify/docs/superpowers/specs/2026-08-21-insightify-v4-frontend-docs.md`

## Global Constraints

- Runtime: Node.js >= 18.17.0
- Test Runner: Native Node.js test runner (`node --test`)
- Output artifact format: Single static HTML file with embedded CSS/JS + markdown knowledge base
- Pipeline stages: Exactly 4 stages (Planner, Writer, Reviewer, Builder)
- Knowledge categories: Exactly 14 categories (`product`, `directory-structure`, `data-models`, `component-architecture`, `state-management`, `routing-structure`, `ui-component-library`, `api-patterns`, `features`, `cross-cutting`, `terminology`, `constraints`, `workflows`, `unanswered`)
- Writer pages: Exactly 14 documentation pages generated across 5 dependency-aware waves
- Review dimensions: Exactly 7 dimensions (Accuracy, Completeness, Consistency, Structure, Usability, Type Safety, Architecture Alignment)

---

## File Structure & Responsibilities

```
.claude/plugins/insightify/
├── package.json                                       # Dependencies and scripts (v4.0.0)
├── .claude-plugin/plugin.json                         # Claude plugin manifest (v4.0.0)
├── .gemini-plugin/plugin.json                         # Gemini plugin manifest (v4.0.0)
├── .opencode/plugin.json                              # Opencode plugin manifest (v4.0.0)
├── skills/
│   ├── insightify/
│   │   └── SKILL.md                                  # Orchestrator skill (4-stage pipeline)
│   ├── planner/
│   │   ├── SKILL.md                                  # Stage 1: Ingest, 14-cat extraction, plan approval
│   │   ├── parsers/
│   │   │   ├── code-parser.js                        # TS/JS/Py code AST/regex extraction
│   │   │   ├── json-parser.js                        # package.json/tsconfig.json extractor
│   │   │   ├── html-parser.js                        # HTML cleaner & markdown converter
│   │   │   ├── pdf-parser.js                         # PDF text extractor
│   │   │   └── directory-scanner.js                  # Recursive directory tree & boundary analyzer
│   │   ├── references/
│   │   │   └── extraction-schema.md                  # 14 category extraction schema
│   │   └── templates/
│   │       └── plan-template.md                      # 14-page plan template with 5-wave graph
│   ├── writer/
│   │   ├── SKILL.md                                  # Stage 2: 14 markdown pages generator in 5 waves
│   │   └── templates/                                # 14 writer templates
│   │       ├── executive-summary-template.md
│   │       ├── directory-structure-template.md
│   │       ├── data-models-template.md
│   │       ├── component-architecture-template.md
│   │       ├── state-management-template.md
│   │       ├── routing-structure-template.md
│   │       ├── ui-component-library-template.md
│   │       ├── api-patterns-template.md
│   │       ├── features-template.md
│   │       ├── cross-cutting-template.md
│   │       ├── terminology-template.md
│   │       ├── constraints-template.md
│   │       ├── workflows-template.md
│   │       └── appendix-template.md
│   ├── reviewer/
│   │   ├── SKILL.md                                  # Stage 3: 7-dimension automated review & report
│   │   └── references/
│   │       └── review-criteria.md                    # 7-dimension scoring criteria & thresholds
│   └── builder/
│       ├── SKILL.md                                  # Stage 4: Artifact HTML & Knowledge Base assembler
│       └── templates/
│           ├── index-html-template.html              # Single HTML template with CSS sidebar
│           ├── build-html.mjs                        # Markdown to HTML renderer & assembler
│           ├── styles.css                            # CSS tokens, layout, Mermaid, print styles
│           └── scripts.js                            # Theme toggle, Mermaid init, navigation
└── tests/
    ├── ingest-parsers.test.js                        # Unit tests for code, json, html, pdf parsers
    ├── directory-scanner.test.js                     # Unit tests for directory tree & boundary scanner
    ├── extract-schema.test.js                        # Unit tests for 14 knowledge categories
    ├── plan-template.test.js                         # Unit tests for 14-page plan & 5 waves
    ├── write-templates.test.js                       # Unit tests for 14 writer templates
    ├── review-criteria.test.js                       # Unit tests for 7 review dimensions
    ├── build-templates.test.js                       # Unit tests for HTML builder, styles, scripts
    ├── orchestrator.test.js                          # Unit tests for 4-stage orchestrator
    ├── scaffold.test.js                              # Unit tests for plugin manifests
    └── integration/
        └── pipeline.test.js                          # Full integration test of pipeline stages
```

---

## Tasks

### Task 1: Update Test Suite for Ingest Parsers (Code, JSON, Directory Scanner)

**Files:**
- Modify: `skills/planner/parsers/code-parser.js`
- Create: `skills/planner/parsers/json-parser.js`
- Create: `skills/planner/parsers/directory-scanner.js`
- Modify: `tests/ingest-parsers.test.js`
- Create: `tests/directory-scanner.test.js`

**Interfaces:**
- `parseCode(codeString, lang)` -> returns markdown string with extracted interfaces, types, enums, components, hooks, imports
- `parseJson(jsonString, lang)` -> returns markdown string with dependencies, scripts, compiler options
- `scanDirectory(dirPath, options)` -> returns tree object `{ name, path, type, children, stats }`
- `generateTreeMarkdown(tree)` -> returns formatted ASCII tree markdown string
- `analyzeModuleBoundaries(tree)` -> returns `{ layers, importPatterns, conventions }`

- [ ] **Step 1: Write test cases for code parser TS/React features and JSON parser in tests/ingest-parsers.test.js**
- [ ] **Step 2: Write test cases for Directory Scanner in tests/directory-scanner.test.js**
- [ ] **Step 3: Run the tests to verify (`node --test tests/ingest-parsers.test.js tests/directory-scanner.test.js`)**
- [ ] **Step 4: Commit with message `feat(planner): add enhanced typescript/json parsers and directory scanner with tests`**

---

### Task 2: Update Test Suite for 14 Knowledge Extraction Categories & Schema

**Files:**
- Modify: `skills/planner/references/extraction-schema.md`
- Modify: `tests/extract-schema.test.js`

**Interfaces:**
- Consumes: `.insightify/sources/` markdown files
- Produces: 14 markdown files in `.insightify/knowledge/`

- [ ] **Step 1: Update tests/extract-schema.test.js to assert all 14 categories and YAML frontmatter requirements**
- [ ] **Step 2: Run test to verify (`node --test tests/extract-schema.test.js`)**
- [ ] **Step 3: Commit with message `feat(planner): update extraction schema to 14 categories with test verification`**

---

### Task 3: Update Test Suite for Plan Template & 5-Wave Dependency Graph

**Files:**
- Modify: `skills/planner/templates/plan-template.md`
- Modify: `skills/planner/SKILL.md`
- Modify: `tests/plan-template.test.js`

**Interfaces:**
- Consumes: 14 knowledge files from `.insightify/knowledge/`
- Produces: `.insightify/plan.md` with 14 pages structured in 5 waves and approval checklist

- [ ] **Step 1: Update tests/plan-template.test.js to assert 14 planned pages and 5 waves in plan template and skill**
- [ ] **Step 2: Run test to verify (`node --test tests/plan-template.test.js`)**
- [ ] **Step 3: Commit with message `feat(planner): update plan template for 14 pages across 5 waves with tests`**

---

### Task 4: Update Test Suite for 14 Writer Templates

**Files:**
- Create/Verify: 14 files in `skills/writer/templates/*.md`
- Modify: `skills/writer/SKILL.md`
- Modify: `tests/write-templates.test.js`

**Interfaces:**
- Consumes: `.insightify/plan.md` + `.insightify/knowledge/*.md`
- Produces: 14 markdown pages in `docs/markdown/`

- [ ] **Step 1: Update tests/write-templates.test.js to verify all 14 templates exist and contain valid frontmatter and source citations**
- [ ] **Step 2: Run test to verify (`node --test tests/write-templates.test.js`)**
- [ ] **Step 3: Commit with message `feat(writer): add 14 specialized templates with 5-wave execution and tests`**

---

### Task 5: Update Test Suite for Reviewer (7 Dimensions)

**Files:**
- Modify: `skills/reviewer/SKILL.md`
- Modify: `skills/reviewer/references/review-criteria.md`
- Modify: `tests/review-criteria.test.js`

**Interfaces:**
- Consumes: `docs/markdown/*.md` + `.insightify/knowledge/*.md` + `.insightify/plan.md`
- Produces: `.insightify/review/review-report.md` with scoring across 7 dimensions

- [ ] **Step 1: Update tests/review-criteria.test.js to assert all 7 review dimensions and stage 3 definition**
- [ ] **Step 2: Run test to verify (`node --test tests/review-criteria.test.js`)**
- [ ] **Step 3: Commit with message `feat(reviewer): upgrade to 7 quality dimensions including type safety & architecture`**

---

### Task 6: Update Test Suite for Builder (HTML, CSS Tokens, Client JS, KB Assembly)

**Files:**
- Modify: `skills/builder/SKILL.md`
- Modify: `skills/builder/templates/index-html-template.html`
- Modify: `skills/builder/templates/build-html.mjs`
- Create: `skills/builder/templates/styles.css`
- Create: `skills/builder/templates/scripts.js`
- Modify: `tests/build-templates.test.js`

**Interfaces:**
- Consumes: `docs/markdown/*.md`, `.insightify/knowledge/*.md`, `.insightify/plan.md`
- Produces: `index.html` (single artifact document) and `knowledge-base.md` (concatenated)

- [ ] **Step 1: Update tests/build-templates.test.js to assert HTML placeholders, CSS design tokens, client scripts, and 14-category KB assembly**
- [ ] **Step 2: Run test to verify (`node --test tests/build-templates.test.js`)**
- [ ] **Step 3: Commit with message `feat(builder): add artifact-style html templates, css design system, and client scripts`**

---

### Task 7: Update Integration & Orchestrator Test Suite

**Files:**
- Modify: `skills/insightify/SKILL.md`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.gemini-plugin/plugin.json`
- Modify: `.opencode/plugin.json`
- Modify: `package.json`
- Modify: `tests/orchestrator.test.js`
- Modify: `tests/scaffold.test.js`
- Modify: `tests/integration/pipeline.test.js`

**Interfaces:**
- Orchestrates: Planner (1) → Writer (2) → Reviewer (3) → Builder (4)
- Outputs: `insights/<project>/index.html` + `insights/<project>/knowledge-base.md`

- [ ] **Step 1: Update tests/orchestrator.test.js and tests/scaffold.test.js for v4 manifests and pipeline flow**
- [ ] **Step 2: Update tests/integration/pipeline.test.js for end-to-end multi-source extraction, directory scanner, and HTML builder rendering**
- [ ] **Step 3: Run full test suite (`node --test`) to ensure 100% passing tests**
- [ ] **Step 4: Commit with message `feat(orchestrator): finalize v4 4-stage pipeline orchestrator and full test suite`**

---

## Plan Self-Review Checklist

1. **Spec Coverage:**
   - 14 knowledge extraction categories covered in Task 2 & Task 3
   - Parsers (code, json, directory scanner) covered in Task 1
   - 14 writer templates in 5 waves covered in Task 4
   - 7 reviewer quality dimensions covered in Task 5
   - Builder artifact HTML, CSS tokens, client JS covered in Task 6
   - 4-stage orchestrator covered in Task 7
2. **Placeholder Scan:** No "TODO", "TBD", or vague instructions. All test commands and file paths are fully specified.
3. **Type Consistency:** Function names and interfaces (`parseCode`, `parseJson`, `scanDirectory`, `renderMarkdown`, `buildProductOverview`, `assembleKnowledgeBase`) match across all tasks and implementation files.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-21-insightify-v4-implementation-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**