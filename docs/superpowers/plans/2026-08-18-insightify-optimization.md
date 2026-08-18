# Insightify Plugin Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename, restructure, enrich, and improve the Insightify plugin to align with Claude Code conventions and improve output quality.

**Architecture:** The plugin is a 6-stage documentation pipeline (ingest → extract → plan → write → review → build). Changes are additive — config renames, file moves, content enrichment, and one parser rewrite. No architectural changes to the pipeline itself.

**Tech Stack:** Node.js, Cheerio (HTML parsing), Claude Code plugin system (SKILL.md convention)

**Spec:** `docs/superpowers/specs/2026-08-18-insightify-optimization-design.md`

## Global Constraints

- Plugin root: `D:\AryokPunya\Magang\insight\.claude\plugins\insightify`
- Node.js test runner: `node --test` (native, no frameworks)
- Existing tests must continue to pass after each task
- Frontmatter `name` fields in skill files do NOT change — only file names and locations change
- Use `"should"` not `"must"` for enriched skill guidance (avoid over-constraining the LLM)

---

### Task 1: Rename Plugin & Enrich Metadata

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `.gemini-plugin/plugin.json`
- Modify: `.opencode/plugin.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: Nothing
- Produces: All config files with `"name": "insightify"` and enriched metadata

- [ ] **Step 1: Replace `.claude-plugin/plugin.json` with enriched version**

Replace the entire contents of `.claude-plugin/plugin.json` with:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "insightify",
  "displayName": "Insightify",
  "version": "1.0.0",
  "description": "Generate documentation website and knowledge base from files and URLs",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "homepage": "https://github.com/aorysan/insightify",
  "repository": "https://github.com/aorysan/insightify",
  "license": "MIT",
  "keywords": [
    "documentation",
    "vitepress",
    "knowledge-base",
    "doc-generator",
    "insightify"
  ],
  "skills": ["./"]
}
```

- [ ] **Step 2: Update `.gemini-plugin/plugin.json`**

Replace contents with:

```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Documentation generator plugin for Gemini CLI",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "license": "MIT"
}
```

- [ ] **Step 3: Update `.opencode/plugin.json`**

Replace contents with:

```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Documentation generator plugin for OpenCode",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "license": "MIT"
}
```

- [ ] **Step 4: Update `package.json`**

Replace contents with:

```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Multi-platform documentation generator plugin",
  "main": "index.js",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/aorysan/insightify"
  },
  "keywords": [
    "documentation",
    "vitepress",
    "knowledge-base",
    "doc-generator",
    "insightify"
  ],
  "scripts": {
    "test": "node --test"
  },
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "pdf-parse": "^1.1.1"
  }
}
```

- [ ] **Step 5: Run tests to verify nothing broke**

Run: `npm test`
Expected: All existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin/plugin.json .gemini-plugin/plugin.json .opencode/plugin.json package.json
git commit -m "chore: rename plugin to insightify and enrich metadata"
```

---

### Task 2: Rename Skill Files to SKILL.md Convention

**Files:**
- Move: `skills/insightify.md` → `skills/insightify/SKILL.md`
- Move: `skills/ingest/ingest.md` → `skills/ingest/SKILL.md`
- Move: `skills/extract/extract.md` → `skills/extract/SKILL.md`
- Move: `skills/plan/plan.md` → `skills/plan/SKILL.md`
- Move: `skills/write/write.md` → `skills/write/SKILL.md`
- Move: `skills/review/review.md` → `skills/review/SKILL.md`
- Move: `skills/build/build.md` → `skills/build/SKILL.md`

**Interfaces:**
- Consumes: Nothing (file renames only; frontmatter `name` fields stay the same)
- Produces: All skill entry points at `skills/<name>/SKILL.md`

- [ ] **Step 1: Create orchestrator directory and move orchestrator skill**

```bash
mkdir -p skills/insightify
git mv skills/insightify.md skills/insightify/SKILL.md
```

- [ ] **Step 2: Rename all stage skill files**

```bash
git mv skills/ingest/ingest.md skills/ingest/SKILL.md
git mv skills/extract/extract.md skills/extract/SKILL.md
git mv skills/plan/plan.md skills/plan/SKILL.md
git mv skills/write/write.md skills/write/SKILL.md
git mv skills/review/review.md skills/review/SKILL.md
git mv skills/build/build.md skills/build/SKILL.md
```

- [ ] **Step 3: Verify no relative path references broke**

Check all skill files for relative path references (e.g. `references/`, `templates/`). These are relative to the skill file's location, so:
- `skills/ingest/SKILL.md` → references `parsers/` still works (same directory)
- `skills/extract/SKILL.md` → references `references/extraction-schema.md` still works (same directory)
- `skills/plan/SKILL.md` → references `templates/plan-template.md` still works (same directory)
- `skills/write/SKILL.md` → references `templates/` still works (same directory)
- `skills/review/SKILL.md` → references `references/review-criteria.md` still works (same directory)
- `skills/build/SKILL.md` → references `templates/index-template.md` still works (same directory)
- `skills/insightify/SKILL.md` → references stage skills by frontmatter `name`, not path — no change needed

All relative paths should be fine because the files moved within the same directory (except orchestrator, which references stages by name not path).

- [ ] **Step 4: Run tests to verify nothing broke**

Run: `npm test`
Expected: All existing tests pass (tests reference parsers by path from repo root, not relative to skill files).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename skill files to SKILL.md convention"
```

---

### Task 3: Enrich Skill Instructions — Ingest, Extract, Plan

**Files:**
- Modify: `skills/ingest/SKILL.md`
- Modify: `skills/extract/SKILL.md`
- Modify: `skills/plan/SKILL.md`

**Interfaces:**
- Consumes: Task 2 completed (files are now at `SKILL.md` locations)
- Produces: Enriched skill instructions for stages 1-3

- [ ] **Step 1: Enrich `skills/ingest/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-ingest
description: Stage 1 - Ingest input files and URLs, normalize content to Markdown, and build manifest.
---

# Stage 1: Source Ingestion Skill

## Instructions

1. Accept input files or URLs from parameters or prompt.
2. For each source, execute the appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `.insightify/sources/manifest.md`.

## Supported Input Types

| Extension | Parser | Notes |
|-----------|--------|-------|
| `.html`, `.htm` | `parsers/html-parser.js` | Strips nav/footer/scripts, preserves content structure |
| `.js`, `.ts`, `.py`, `.java`, `.go`, `.rs`, `.rb`, `.php`, `.c`, `.cpp`, `.cs` | `parsers/code-parser.js` | Extracts JSDoc/docstrings; falls back to raw code |
| `.pdf` | `parsers/pdf-parser.js` | Binary buffer input via `pdf-parse` |
| `.md`, `.txt`, `.rst` | Direct copy | Copy content as-is with frontmatter added |
| URLs (`http://`, `https://`) | Fetch → HTML parser | Fetch page, then process as HTML |
| Other extensions | Skip | Log warning, mark as `skipped` in manifest |

## URL Fetching

- Timeout: 30 seconds per request
- Retry: 1 retry on failure (timeout or HTTP 5xx)
- User-Agent: `Insightify/1.0`
- On permanent failure (4xx or second failure): mark as `failed` in manifest, continue pipeline

## File Size Limits

- Files > 5MB: log a warning but process normally
- Files > 20MB: skip and mark as `skipped` in manifest with reason `"file_too_large"`

## Normalized Output Format

Each source file should have this frontmatter:

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

Content headings should be normalized to start at H2 (`##`) — reserve H1 for the source title.

## Manifest Format

Each entry in `.insightify/sources/manifest.md` should include:

```markdown
| Source ID | Path | Type | Status | Words |
|-----------|------|------|--------|-------|
| source-001 | ./src/main.js | code | success | 543 |
| source-002 | https://example.com | url | failed | 0 |
```

Status values: `success`, `failed`, `skipped`
```

- [ ] **Step 2: Enrich `skills/extract/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-extract
description: Stage 2 - Read normalized sources and extract product knowledge into structured categories.
---

# Stage 2: Knowledge Extraction Skill

## Instructions

1. Read all `.insightify/sources/*.md` files.
2. For each category defined in `references/extraction-schema.md`, analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md § Section Name`) for every extracted fact.
4. Write output files to `.insightify/knowledge/`.

## Handling Conflicts Between Sources

When two sources provide contradictory information:
- Keep both facts in the relevant knowledge file
- Flag the contradiction in `unanswered.md` with references to both sources
- Example: `> ⚠️ Conflict: source-001 says max 100 users, source-003 says max 500 users`

## Confidence Scoring

Assign confidence to each extracted fact in the YAML frontmatter:
- `high`: Fact is explicitly and clearly stated in source material
- `medium`: Fact is inferred from context or implied by multiple sources
- `low`: Fact is ambiguous, mentioned only once, or from a low-quality source

## Edge Cases

- **Source doesn't fit any category:** Note it in `unanswered.md` with a suggested category name
- **Very thin sources:** Always produce at minimum `product.md` (even with basic info) and `unanswered.md` (listing what's missing)
- **Empty source files:** Skip, log a note in `unanswered.md`

## Citation Format

Every extracted fact should include a blockquote citation:

```markdown
The API supports up to 1000 concurrent connections.

> **Source:** source-003.md § API Limits
```

The `§` symbol references the section within the source where the fact was found.
```

- [ ] **Step 3: Enrich `skills/plan/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-plan
description: Stage 3 - Analyze knowledge base and design documentation plan with user approval.
---

# Stage 3: Documentation Planner Skill

## Instructions

1. Read `.insightify/knowledge/*.md`.
2. Generate documentation plan using `templates/plan-template.md`.
3. Display a concise summary of the generated plan to the user:
   ```
   📝 Documentation Plan: [Project Name]
   🎯 Audience: [Primary & Secondary]
   📄 Pages: [Total count, breakdown by priority]
   🔄 Dependencies: [Number of waves]
   📊 Est. words: [Estimation]
   ```
4. Ask for explicit user approval using this prompt: "Approve plan? [Y/n/revise]"
   - If `Y`/`y`/Enter: Save plan to `.insightify/plan.md` with `status: approved` and proceed.
   - If `n`: Exit pipeline, save plan as `rejected`.
   - If `revise`: Prompt "What changes? (e.g., 'add FAQ page', 'merge API pages')". Re-generate plan based on feedback, and loop back to Step 3.
5. Max 3 revision cycles. On the 4th cycle, ask the user to force approval or exit.

## Page Sizing Guidance

- Ideal page length: 500–2000 words
- If a page would exceed 3000 words, split it into sub-pages
- Very short pages (< 300 words) should be merged with related content

## When to Merge vs Split

- **Merge** when: two topics share the same audience and one topic is < 300 words
- **Split** when: a page covers two distinct audiences, or exceeds 3000 words, or mixes conceptual/reference content

## Priority Assignment

- `high`: Getting started, installation, core concepts — pages every user needs
- `medium`: Feature guides, detailed workflows — pages most users need
- `low`: API reference, troubleshooting, FAQ — pages some users need

## Dependency Graph Rules

- No circular dependencies between pages
- Aim for max 3 writing waves — if more are needed, re-evaluate page boundaries
- Wave 1 should contain all standalone pages (no dependencies)
- Each page should depend on at most 2 other pages
```

- [ ] **Step 4: Commit**

```bash
git add skills/ingest/SKILL.md skills/extract/SKILL.md skills/plan/SKILL.md
git commit -m "docs: enrich ingest, extract, and plan skill instructions"
```

---

### Task 4: Enrich Skill Instructions — Write, Review, Build

**Files:**
- Modify: `skills/write/SKILL.md`
- Modify: `skills/review/SKILL.md`
- Modify: `skills/build/SKILL.md`

**Interfaces:**
- Consumes: Task 2 completed (files are now at `SKILL.md` locations)
- Produces: Enriched skill instructions for stages 4-6

- [ ] **Step 1: Enrich `skills/write/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-write
description: Stage 4 - Execute documentation plan by generating markdown docs in waves.
---

# Stage 4: Documentation Writer Skill

## Instructions

1. Read `.insightify/plan.md` to get page list and writing order waves.
2. For each wave, generate pure markdown pages under `docs/` using templates in `templates/`.
3. Read `.insightify/knowledge/*.md` and previous wave pages for cross-referencing.
4. Display summary to user for post-write review.
5. Handle targeted page revisions if requested by user.

## Writing Style

- Tone: technical but approachable
- Person: second person ("you") for instructions, third person for concepts
- Voice: active voice preferred ("Run the command" not "The command should be run")
- Avoid jargon without explanation — if a term is in `knowledge/terminology.md`, link or define it on first use

## Content Structure

- H1 (`#`): Reserved for the page title (set in frontmatter `title` field, not in body)
- Content starts at H2 (`##`)
- Heading levels should be incremental: H2 → H3 → H4, never skip levels

## Cross-References

- Use relative markdown links: `[Getting Started](./getting-started.md)`
- Only link to pages that exist in the plan — do not create phantom references
- When referencing a specific section: `[Authentication](./api-reference.md#authentication)`

## Code Examples

- Every API endpoint described should have at least one request/response example
- Every workflow should have a step-by-step code or command example
- Use fenced code blocks with language tags: ` ```js `, ` ```bash `, etc.

## Template Selection

Choose the template based on the page type from the plan:
- API documentation pages → `templates/api-template.md`
- Guide/tutorial pages → `templates/guide-template.md`
- FAQ/troubleshooting pages → `templates/faq-template.md`
- Other page types → use `templates/guide-template.md` as default
```

- [ ] **Step 2: Enrich `skills/review/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-review
description: Stage 5 - Evaluate generated docs across 5 quality dimensions and generate report.
---

# Stage 5: Documentation Reviewer Skill

## Instructions

1. Evaluate `docs/*` in parallel across the 5 dimensions defined in `references/review-criteria.md`.
2. Write report to `.insightify/review/review-report.md`.
3. If verdict is `changes_needed`, send specific page issues back to Stage 4 Writer.
4. If iteration reaches 3, escalate remaining issues to user.

## Scoring Rubric (per dimension, 1-5 scale)

**Accuracy** (compare against `.insightify/knowledge/*`):
- 5: All facts match knowledge base, no unsupported claims
- 3: Minor inaccuracies or missing nuances
- 1: Major factual errors or contradictions with knowledge base

**Completeness** (compare against `.insightify/plan.md`):
- 5: All planned sections present and substantive
- 3: Most sections present, some thin or missing minor content
- 1: Major planned sections missing entirely

**Consistency** (cross-page comparison):
- 5: Terminology, tone, and formatting uniform across all pages
- 3: Minor inconsistencies in naming or tone
- 1: Same concept called different names, mixed tone, inconsistent formatting

**Structure** (heading/link integrity):
- 5: Heading levels incremental, all internal links valid, no orphan pages
- 3: Minor heading level issues or 1-2 broken links
- 1: Heading hierarchy broken, multiple broken links

**Usability** (readability for target audience):
- 5: Clear code examples, approachable prose, good information flow
- 3: Adequate but could be clearer in places
- 1: Missing examples, wall-of-text, unclear instructions

## Verdict Thresholds

- `approved`: All dimensions score 3 or above, no critical issues
- `changes_needed`: Any dimension scores below 3, OR any critical issue found

## Issue Classification

- **Critical**: Factual error, missing entire planned section, broken navigation
- **Minor**: Typo, slightly inconsistent tone, suboptimal heading level

## Issue Format for Stage 4

When sending issues back to the Writer, format each as:

```markdown
### Issue: [Short description]
- **Page:** `docs/[filename].md`
- **Dimension:** [Accuracy|Completeness|Consistency|Structure|Usability]
- **Severity:** [Critical|Minor]
- **Issue:** [Description of what's wrong]
- **Suggestion:** [How to fix it]
```
```

- [ ] **Step 3: Enrich `skills/build/SKILL.md`**

Replace the entire file content with:

```markdown
---
name: insightify-build
description: Stage 6 - Transform docs for VitePress, generate site config, and finalize Knowledge Base.
---

# Stage 6: Documentation Builder Skill

## Instructions

1. Transform `docs/*` frontmatter into VitePress format.
2. Generate `.vitepress/config.js` from `templates/vitepress-config.js` and plan dependency graph.
3. Generate root `index.md` hero page from `templates/index-template.md`.
4. Create root `package.json` with VitePress devDependencies.
5. Copy `.insightify/knowledge/*` to `knowledge-base/`.
6. Perform validation (no broken links, no orphan pages).
7. Print completion summary and instructions (`npm run dev`).

## VitePress Frontmatter Transformation

Add VitePress-specific fields to each page's frontmatter:
- `outline: [2, 3]` — show H2 and H3 in the sidebar outline
- `aside: true` — enable the right-side aside panel

Preserve existing fields (`title`, `description`, `audience`, `sources`).

## Sidebar Generation

Build sidebar structure from the documentation plan:
- Group pages by their dependency wave or logical section
- Top-level items: Getting Started, Guides, API Reference, FAQ/Troubleshooting
- Nested items: individual pages under each group
- Order: follow the writing wave order from the plan

## Nav Generation

Generate top navigation from the highest-priority pages:
- Include links to: Getting Started, main guide sections, API Reference
- Keep nav items to 5 or fewer

## Output `package.json`

The generated `package.json` (in the output project, not the plugin) should include:

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
```

## Validation Checklist

Before printing the completion summary, verify:
- [ ] All internal links in `docs/*` resolve to existing files
- [ ] No orphan pages (every page is reachable from sidebar or another page)
- [ ] Every page has `title` and `description` in frontmatter
- [ ] `index.md` hero page has correct links to existing pages
- [ ] `.vitepress/config.js` references only pages that exist

If validation fails, log warnings but do not block — report issues in the completion summary.

## Completion Summary

Print:
```
✅ Insightify Build Complete!
📁 Output: ./docs/ (X pages)
📚 Knowledge Base: ./knowledge-base/ (Y files)
⚙️  Config: .vitepress/config.js

To preview:
  npm install
  npm run docs:dev

⚠️  Warnings: [list any validation issues]
```
```

- [ ] **Step 4: Commit**

```bash
git add skills/write/SKILL.md skills/review/SKILL.md skills/build/SKILL.md
git commit -m "docs: enrich write, review, and build skill instructions"
```

---

### Task 5: Rewrite HTML Parser with Structure Preservation

**Files:**
- Modify: `skills/ingest/parsers/html-parser.js`
- Modify: `tests/ingest-parsers.test.js`

**Interfaces:**
- Consumes: Cheerio library (already in `dependencies`)
- Produces: `parseHtml(htmlString)` → returns structure-preserving markdown string (same function signature as before)

- [ ] **Step 1: Write failing tests for new HTML parser behavior**

Add these test cases to `tests/ingest-parsers.test.js`, right after the existing `html-parser` test:

```js
test('html-parser preserves heading hierarchy', () => {
  const html = '<html><body><main><h1>Title</h1><h2>Section</h2><p>Content</p><h3>Subsection</h3><p>More</p></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('# Title'));
  assert.ok(md.includes('## Section'));
  assert.ok(md.includes('### Subsection'));
  assert.ok(md.includes('Content'));
  assert.ok(md.includes('More'));
});

test('html-parser converts unordered lists', () => {
  const html = '<html><body><main><ul><li>First</li><li>Second</li><li>Third</li></ul></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('- First'));
  assert.ok(md.includes('- Second'));
  assert.ok(md.includes('- Third'));
});

test('html-parser converts ordered lists', () => {
  const html = '<html><body><main><ol><li>Step one</li><li>Step two</li></ol></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('1. Step one'));
  assert.ok(md.includes('2. Step two'));
});

test('html-parser converts nested lists', () => {
  const html = '<html><body><main><ul><li>Parent<ul><li>Child</li></ul></li></ul></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('- Parent'));
  assert.ok(md.includes('  - Child'));
});

test('html-parser converts fenced code blocks with language', () => {
  const html = '<html><body><main><pre><code class="language-js">const x = 1;</code></pre></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('```js'));
  assert.ok(md.includes('const x = 1;'));
  assert.ok(md.includes('```'));
});

test('html-parser converts inline code', () => {
  const html = '<html><body><main><p>Use the <code>npm install</code> command</p></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('`npm install`'));
});

test('html-parser converts links', () => {
  const html = '<html><body><main><p>Visit <a href="https://example.com">Example</a> for more.</p></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('[Example](https://example.com)'));
});

test('html-parser converts bold and italic', () => {
  const html = '<html><body><main><p>This is <strong>bold</strong> and <em>italic</em> text.</p></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('**bold**'));
  assert.ok(md.includes('*italic*'));
});

test('html-parser converts images', () => {
  const html = '<html><body><main><img src="photo.jpg" alt="A photo" /></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('![A photo](photo.jpg)'));
});

test('html-parser converts tables', () => {
  const html = '<html><body><main><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>1</td></tr></tbody></table></main></body></html>';
  const md = parseHtml(html);
  assert.ok(md.includes('| Name | Value |'));
  assert.ok(md.includes('| --- | --- |'));
  assert.ok(md.includes('| A | 1 |'));
});

test('html-parser handles empty elements gracefully', () => {
  const html = '<html><body><main><p></p><h2></h2><ul></ul></main></body></html>';
  const md = parseHtml(html);
  assert.strictEqual(typeof md, 'string');
});

test('html-parser handles mixed content', () => {
  const html = `<html><body><main>
    <h1>API Guide</h1>
    <p>Welcome to the <strong>API</strong>.</p>
    <h2>Installation</h2>
    <pre><code class="language-bash">npm install sdk</code></pre>
    <ul><li>Fast</li><li>Reliable</li></ul>
  </main></body></html>`;
  const md = parseHtml(html);
  assert.ok(md.includes('# API Guide'));
  assert.ok(md.includes('**API**'));
  assert.ok(md.includes('## Installation'));
  assert.ok(md.includes('```bash'));
  assert.ok(md.includes('npm install sdk'));
  assert.ok(md.includes('- Fast'));
  assert.ok(md.includes('- Reliable'));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: New tests FAIL (current parser doesn't preserve structure). Existing `html-parser extracts main content and ignores nav/footer` test may also fail after the rewrite — that's expected, we'll update it.

- [ ] **Step 3: Rewrite `skills/ingest/parsers/html-parser.js`**

Replace the entire file with:

```js
const cheerio = require('cheerio');

function parseHtml(htmlString) {
  const $ = cheerio.load(htmlString);
  $('nav, footer, header, script, style, .ads, .sidebar').remove();

  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled Page';
  const $content = $('main, article, body').first();

  const md = convertNode($, $content, 0);
  const cleaned = md
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `# ${title}\n\n${cleaned}`;
}

function convertNode($, $el, depth) {
  let result = '';

  $el.contents().each((_, node) => {
    if (node.type === 'text') {
      const text = $(node).text();
      if (text.trim()) {
        result += text.replace(/\s+/g, ' ');
      }
      return;
    }

    if (node.type !== 'tag') return;

    const $node = $(node);
    const tag = node.tagName.toLowerCase();

    // Headings
    if (/^h[1-6]$/.test(tag)) {
      const level = parseInt(tag[1], 10);
      const text = $node.text().trim();
      if (text) {
        result += `\n\n${'#'.repeat(level)} ${text}\n\n`;
      }
      return;
    }

    // Paragraphs
    if (tag === 'p') {
      const inner = convertInline($, $node);
      if (inner.trim()) {
        result += `\n\n${inner.trim()}\n\n`;
      }
      return;
    }

    // Code blocks (pre > code)
    if (tag === 'pre') {
      const $code = $node.find('code').first();
      const codeText = $code.length ? $code.text() : $node.text();
      const langClass = $code.attr('class') || '';
      const langMatch = langClass.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      result += `\n\n\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`;
      return;
    }

    // Unordered lists
    if (tag === 'ul') {
      result += '\n';
      $node.children('li').each((_, li) => {
        const inner = convertListItem($, $(li), depth, '-');
        result += inner;
      });
      result += '\n';
      return;
    }

    // Ordered lists
    if (tag === 'ol') {
      result += '\n';
      $node.children('li').each((i, li) => {
        const inner = convertListItem($, $(li), depth, `${i + 1}.`);
        result += inner;
      });
      result += '\n';
      return;
    }

    // Tables
    if (tag === 'table') {
      result += '\n' + convertTable($, $node) + '\n';
      return;
    }

    // Images
    if (tag === 'img') {
      const alt = $node.attr('alt') || '';
      const src = $node.attr('src') || '';
      if (src) {
        result += `![${alt}](${src})`;
      }
      return;
    }

    // Divs and other containers — recurse
    result += convertNode($, $node, depth);
  });

  return result;
}

function convertInline($, $el) {
  let result = '';

  $el.contents().each((_, node) => {
    if (node.type === 'text') {
      result += $(node).text().replace(/\s+/g, ' ');
      return;
    }

    if (node.type !== 'tag') return;

    const $node = $(node);
    const tag = node.tagName.toLowerCase();

    if (tag === 'strong' || tag === 'b') {
      result += `**${$node.text().trim()}**`;
    } else if (tag === 'em' || tag === 'i') {
      result += `*${$node.text().trim()}*`;
    } else if (tag === 'code') {
      result += `\`${$node.text()}\``;
    } else if (tag === 'a') {
      const href = $node.attr('href') || '';
      const text = $node.text().trim();
      result += `[${text}](${href})`;
    } else if (tag === 'img') {
      const alt = $node.attr('alt') || '';
      const src = $node.attr('src') || '';
      result += `![${alt}](${src})`;
    } else if (tag === 'br') {
      result += '\n';
    } else {
      result += convertInline($, $node);
    }
  });

  return result;
}

function convertListItem($, $li, depth, marker) {
  const indent = '  '.repeat(depth);
  let text = '';
  let sublist = '';

  $li.contents().each((_, node) => {
    if (node.type === 'text') {
      text += $(node).text().replace(/\s+/g, ' ').trim();
      return;
    }
    if (node.type !== 'tag') return;

    const tag = node.tagName.toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      const $sub = $(node);
      const subMarker = tag === 'ul' ? '-' : null;
      $sub.children('li').each((i, subLi) => {
        const m = subMarker || `${i + 1}.`;
        sublist += convertListItem($, $(subLi), depth + 1, m);
      });
    } else {
      text += convertInline($, $(node));
    }
  });

  let result = `${indent}${marker} ${text.trim()}\n`;
  if (sublist) {
    result += sublist;
  }
  return result;
}

function convertTable($, $table) {
  const rows = [];
  $table.find('tr').each((_, tr) => {
    const cells = [];
    $(tr).find('th, td').each((__, cell) => {
      cells.push($(cell).text().trim());
    });
    rows.push(cells);
  });

  if (rows.length === 0) return '';

  const header = rows[0];
  const separator = header.map(() => '---');
  const dataRows = rows.slice(1);

  let md = `| ${header.join(' | ')} |\n`;
  md += `| ${separator.join(' | ')} |\n`;
  for (const row of dataRows) {
    // Pad row to header length
    while (row.length < header.length) row.push('');
    md += `| ${row.join(' | ')} |\n`;
  }

  return md;
}

module.exports = { parseHtml };
```

- [ ] **Step 4: Update the original test to match new output format**

The existing test `html-parser extracts main content and ignores nav/footer` still expects the same behavior (nav/footer removed, content preserved). Since the new parser produces structured markdown instead of a text blob, update the test:

Find in `tests/ingest-parsers.test.js` the first test:
```js
test('html-parser extracts main content and ignores nav/footer', () => {
  const html = `<html><body><nav>Menu</nav><main><h1>Title</h1><p>Hello world</p></main><footer>Footer</footer></body></html>`;
  const md = parseHtml(html);
  assert.strictEqual(md.includes('Title'), true);
  assert.strictEqual(md.includes('Hello world'), true);
  assert.strictEqual(md.includes('Menu'), false);
});
```

Replace with:
```js
test('html-parser extracts main content and ignores nav/footer', () => {
  const html = `<html><body><nav>Menu</nav><main><h1>Title</h1><p>Hello world</p></main><footer>Footer</footer></body></html>`;
  const md = parseHtml(html);
  assert.ok(md.includes('# Title'));
  assert.ok(md.includes('Hello world'));
  assert.ok(!md.includes('Menu'));
  assert.ok(!md.includes('Footer'));
});
```

- [ ] **Step 5: Run all tests to verify they pass**

Run: `npm test`
Expected: ALL tests pass — old and new.

- [ ] **Step 6: Commit**

```bash
git add skills/ingest/parsers/html-parser.js tests/ingest-parsers.test.js
git commit -m "feat: rewrite HTML parser to preserve document structure as markdown"
```

---

### Task 6: Update CLAUDE.md & Final Verification

**Files:**
- Modify: `CLAUDE.md` (only if references need updating)

**Interfaces:**
- Consumes: All previous tasks completed
- Produces: Updated documentation reflecting new file structure

- [ ] **Step 1: Review `CLAUDE.md` for accuracy**

Read `CLAUDE.md` and verify:
- Skill file paths mentioned are still accurate (they reference by name, not path, so should be fine)
- Pipeline stage descriptions still match enriched skill content
- No references to old file names like `ingest.md`, `extract.md`, etc.

The current `CLAUDE.md` references stages by skill name (e.g., "Stage 1 (Ingest): `skills/ingest/ingest.md`"). Update these paths:

Find all path references like `skills/ingest/ingest.md` and replace with `skills/ingest/SKILL.md`:

```
skills/ingest/ingest.md     → skills/ingest/SKILL.md
skills/extract/extract.md   → skills/extract/SKILL.md
skills/plan/plan.md         → skills/plan/SKILL.md
skills/write/write.md       → skills/write/SKILL.md
skills/review/review.md     → skills/review/SKILL.md
skills/build/build.md       → skills/build/SKILL.md
skills/insightify.md        → skills/insightify/SKILL.md
```

Also update the entry point reference:
```
The entry point is `skills/insightify.md`  →  The entry point is `skills/insightify/SKILL.md`
```

- [ ] **Step 2: Run full test suite one final time**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md paths to reflect SKILL.md convention"
```

- [ ] **Step 4: Print completion summary**

```
✅ Insightify Plugin Optimization Complete!

Changes applied:
  🏷️  Plugin renamed: insightify-plugin → insightify
  📁 Skill files standardized: *.md → SKILL.md
  📝 Plugin metadata enriched (author, license, keywords, schema)
  📖 6 skill instructions enriched with edge cases & guidance
  🔧 HTML parser rewritten for structure-preserving markdown

⚠️  Next steps:
  - Re-install/refresh the plugin in any active Claude Code sessions
  - Test invoke: /insightify, /insightify-ingest, etc.
```
