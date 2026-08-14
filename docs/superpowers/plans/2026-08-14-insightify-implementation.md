# Insightify Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Insightify documentation generator plugin for Claude Code, Gemini CLI, and OpenCode, implementing a 6-stage documentation pipeline from ingestion to VitePress build.

**Architecture:** Multi-skill pipeline where each of the 6 stages (Ingest, Extract, Plan, Write, Review, Build) is housed in its own directory with supporting parsers/templates/schemas. An orchestrator skill (`insightify.md`) controls sequential flow, stage dependencies, and user approval checkpoints.

**Tech Stack:** Node.js, Markdown (with YAML frontmatter), Cheerio, pdf-parse, VitePress templates, JSON Schema.

**Spec:** `docs/superpowers/specs/2026-08-14-insightify-design.md`

## Global Constraints

- Multi-platform compatibility: Claude Code (`.claude-plugin/plugin.json`), Gemini CLI (`.gemini-plugin/`), OpenCode (`.opencode/`).
- Intermediate workspace stored in `.insightify/` relative to user's output directory.
- All extracted knowledge stored as Structured Markdown with YAML frontmatter.
- Max 3 automated review-revision iterations in Stage 5.

---

### Task 1: Scaffold Project Directory & Platform Manifests

**Files:**
- Create: `package.json`
- Create: `.claude-plugin/plugin.json`
- Create: `.gemini-plugin/plugin.json`
- Create: `.opencode/plugin.json`
- Create: `CLAUDE.md`
- Create: `README.md`
- Create: `tests/scaffold.test.js`

**Interfaces:**
- Consumes: None
- Produces: Package dependencies (`cheerio`, `pdf-parse`) and multi-platform plugin manifests.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/scaffold.test.js
const fs = require('fs');
const path = require('path');

describe('Project Scaffolding', () => {
  test('plugin manifests exist and have correct structure', () => {
    const claudeManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../.claude-plugin/plugin.json'), 'utf8'));
    expect(claudeManifest.name).toBe('insightify');
    expect(claudeManifest.version).toBe('1.0.0');

    const geminiManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../.gemini-plugin/plugin.json'), 'utf8'));
    expect(geminiManifest.name).toBe('insightify');

    const opencodeManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../.opencode/plugin.json'), 'utf8'));
    expect(opencodeManifest.name).toBe('insightify');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/scaffold.test.js`
Expected: FAIL with missing file error.

- [ ] **Step 3: Implement minimal manifests and package.json**

Create `package.json`:
```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Multi-platform documentation generator plugin",
  "main": "index.js",
  "scripts": {
    "test": "node --test tests/*.test.js"
  },
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "pdf-parse": "^1.1.1"
  }
}
```

Create `.claude-plugin/plugin.json`:
```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Generate documentation website and knowledge base from files and URLs",
  "commands": [
    { "name": "insightify", "description": "Full documentation pipeline" },
    { "name": "insightify-ingest", "description": "Stage 1: Source Ingestion" },
    { "name": "insightify-extract", "description": "Stage 2: Knowledge Extraction" },
    { "name": "insightify-plan", "description": "Stage 3: Documentation Planner" },
    { "name": "insightify-write", "description": "Stage 4: Documentation Writer" },
    { "name": "insightify-review", "description": "Stage 5: Documentation Reviewer" },
    { "name": "insightify-build", "description": "Stage 6: Documentation Builder" }
  ]
}
```

Create `.gemini-plugin/plugin.json`:
```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Documentation generator plugin for Gemini CLI"
}
```

Create `.opencode/plugin.json`:
```json
{
  "name": "insightify",
  "version": "1.0.0",
  "description": "Documentation generator plugin for OpenCode"
}
```

Create `CLAUDE.md`:
```markdown
# Insightify Development Guide

Insightify is a 6-stage documentation generator plugin.

## Testing
Run unit tests with `npm test`.
```

Create `README.md`:
```markdown
# Insightify

Automated Documentation Website & Product Knowledge Base Generator.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/scaffold.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json .claude-plugin/ .gemini-plugin/ .opencode/ CLAUDE.md README.md tests/scaffold.test.js
git commit -m "feat: scaffold multi-platform plugin structure and manifests"
```

---

### Task 2: Implement Stage 1 Parsers & Skill (Source Ingestion)

**Files:**
- Create: `skills/ingest/parsers/pdf-parser.js`
- Create: `skills/ingest/parsers/html-parser.js`
- Create: `skills/ingest/parsers/code-parser.js`
- Create: `skills/ingest/ingest.md`
- Create: `tests/ingest-parsers.test.js`

**Interfaces:**
- Consumes: Raw file buffer/text or HTML string.
- Produces: Clean Markdown text string with extracted comments/text; Stage 1 outputs `.insightify/sources/manifest.md` and `source-XXX.md`.

- [ ] **Step 1: Write the failing tests for parsers**

```javascript
// tests/ingest-parsers.test.js
const assert = require('assert');
const { parseHtml } = require('../skills/ingest/parsers/html-parser');
const { parseCode } = require('../skills/ingest/parsers/code-parser');

describe('Ingest Parsers', () => {
  test('html-parser extracts main content and ignores nav/footer', () => {
    const html = `<html><body><nav>Menu</nav><main><h1>Title</h1><p>Hello world</p></main><footer>Footer</footer></body></html>`;
    const md = parseHtml(html);
    assert.strictEqual(md.includes('Title'), true);
    assert.strictEqual(md.includes('Hello world'), true);
    assert.strictEqual(md.includes('Menu'), false);
  });

  test('code-parser extracts docstrings and JSDoc', () => {
    const code = `
      /**
       * Calculate total price
       * @param {number} amount
       */
      function calc(amount) { return amount; }
    `;
    const extracted = parseCode(code, 'js');
    assert.strictEqual(extracted.includes('Calculate total price'), true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ingest-parsers.test.js`
Expected: FAIL with "Cannot find module" error.

- [ ] **Step 3: Implement parsers and Ingest skill**

Create `skills/ingest/parsers/html-parser.js`:
```javascript
const cheerio = require('cheerio');

function parseHtml(htmlString) {
  const $ = cheerio.load(htmlString);
  $('nav, footer, header, script, style, .ads, .sidebar').remove();
  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled Page';
  const bodyText = $('main, article, body').first().text().replace(/\s+/g, ' ').trim();
  return `# ${title}\n\n${bodyText}`;
}

module.exports = { parseHtml };
```

Create `skills/ingest/parsers/code-parser.js`:
```javascript
function parseCode(codeString, lang) {
  const comments = [];
  // Match JSDoc /** ... */
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  let match;
  while ((match = jsdocRegex.exec(codeString)) !== null) {
    comments.push(match[1].replace(/^\s*\* ?/gm, '').trim());
  }
  // Match Python triple quote docstrings """ ... """
  if (lang === 'py' || lang === 'python') {
    const pyRegex = /"""([\s\S]*?)"""/g;
    while ((match = pyRegex.exec(codeString)) !== null) {
      comments.push(match[1].trim());
    }
  }
  return comments.join('\n\n') || codeString;
}

module.exports = { parseCode };
```

Create `skills/ingest/parsers/pdf-parser.js`:
```javascript
const pdfParse = require('pdf-parse');

async function parsePdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { parsePdf };
```

Create `skills/ingest/ingest.md`:
```markdown
---
name: insightify-ingest
description: Stage 1 - Ingest input files and URLs, normalize content to Markdown, and build manifest.
---

# Stage 1: Source Ingestion Skill

## Instructions
1. Accept input files or URLs from parameters or prompt.
2. For each source, execute appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `.insightify/sources/manifest.md`.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/ingest-parsers.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/ingest/ tests/ingest-parsers.test.js
git commit -m "feat: implement Stage 1 parsers and ingest skill"
```

---

### Task 3: Implement Stage 2 Schemas & Skill (Knowledge Extraction)

**Files:**
- Create: `skills/extract/extract.md`
- Create: `skills/extract/references/extraction-schema.md`
- Create: `tests/extract-schema.test.js`

**Interfaces:**
- Consumes: `.insightify/sources/*.md` files.
- Produces: `.insightify/knowledge/*.md` files (`product.md`, `features.md`, `terminology.md`, `api.md`, `workflows.md`, `constraints.md`, `unanswered.md`).

- [ ] **Step 1: Write failing test for extraction schema validation**

```javascript
// tests/extract-schema.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Extract Schema Reference', () => {
  test('extraction-schema.md defines all required categories', () => {
    const schemaDoc = fs.readFileSync(path.join(__dirname, '../skills/extract/references/extraction-schema.md'), 'utf8');
    const categories = ['product', 'features', 'terminology', 'api', 'workflows', 'constraints', 'unanswered'];
    categories.forEach(cat => {
      assert.strictEqual(schemaDoc.includes(cat), true);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/extract-schema.test.js`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement extraction schema reference and Extract skill**

Create `skills/extract/references/extraction-schema.md`:
```markdown
# Knowledge Extraction Schema Reference

Extracted knowledge MUST be categorized into 7 files under `.insightify/knowledge/`:

1. `product.md`: Product name, description, audience, value prop.
2. `features.md`: List of features, descriptions, and citations.
3. `terminology.md`: Domain-specific glossary terms and definitions.
4. `api.md`: Endpoints, methods, parameters, request/response formats.
5. `workflows.md`: Step-by-step user procedures.
6. `constraints.md`: Technical limitations, dependencies, requirements.
7. `unanswered.md`: Unclear items, missing details, contradictions.

Each file MUST contain YAML frontmatter:
```yaml
---
category: "<category_name>"
extracted_from:
  - source-001.md
confidence: "high" | "medium" | "low"
extracted_at: "YYYY-MM-DDTHH:mm:ssZ"
---
```
```

Create `skills/extract/extract.md`:
```markdown
---
name: insightify-extract
description: Stage 2 - Read normalized sources and extract product knowledge into structured categories.
---

# Stage 2: Knowledge Extraction Skill

## Instructions
1. Read all `.insightify/sources/*.md` files.
2. For each category defined in `references/extraction-schema.md`, analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md`) for every extracted fact.
4. Write output files to `.insightify/knowledge/`.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/extract-schema.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/extract/ tests/extract-schema.test.js
git commit -m "feat: implement Stage 2 extraction schema reference and skill"
```

---

### Task 4: Implement Stage 3 Templates & Skill (Documentation Planner)

**Files:**
- Create: `skills/plan/templates/plan-template.md`
- Create: `skills/plan/plan.md`
- Create: `tests/plan-template.test.js`

**Interfaces:**
- Consumes: `.insightify/knowledge/*.md` files.
- Produces: `.insightify/plan.md` (after user chat approval).

- [ ] **Step 1: Write failing test for plan template validation**

```javascript
// tests/plan-template.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Plan Template', () => {
  test('plan-template.md contains required structure sections', () => {
    const template = fs.readFileSync(path.join(__dirname, '../skills/plan/templates/plan-template.md'), 'utf8');
    assert.strictEqual(template.includes('## Page Dependency Graph'), true);
    assert.strictEqual(template.includes('## Writing Order'), true);
    assert.strictEqual(template.includes('status: "approved"'), true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/plan-template.test.js`
Expected: FAIL with missing file.

- [ ] **Step 3: Implement plan template and Planner skill**

Create `skills/plan/templates/plan-template.md`:
```markdown
---
project: "<Project Name>"
generated_at: "<ISO Timestamp>"
status: "approved"
total_pages: 0
audience: "<primary audience>"
---

# Documentation Plan: <Project Name>

## Overview
<Summary of product and docs goals>

## Audience
- **Primary:** <target>
- **Secondary:** <target>

## Pages

### 1. <Page Title>
- **Purpose:** <purpose>
- **Audience:** <audience>
- **Sources:** <knowledge files>
- **Sections:**
  - Section 1
  - Section 2
- **Dependencies:** None
- **Priority:** high | medium | low

## Page Dependency Graph
```
[Dependency diagram]
```

## Writing Order
1. Page 1 (no dependencies)
2. Page 2 (depends on Page 1)
```

Create `skills/plan/plan.md`:
```markdown
---
name: insightify-plan
description: Stage 3 - Analyze knowledge base and design documentation plan with user approval.
---

# Stage 3: Documentation Planner Skill

## Instructions
1. Read `.insightify/knowledge/*.md`.
2. Generate documentation plan using `templates/plan-template.md`.
3. Present summary of plan to user in chat (page count, priorities, dependencies).
4. Request explicit user approval (or revisions).
5. Upon approval, save to `.insightify/plan.md`.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/plan-template.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/plan/ tests/plan-template.test.js
git commit -m "feat: implement Stage 3 planner templates and skill"
```

---

### Task 5: Implement Stage 4 Templates & Skill (Documentation Writer)

**Files:**
- Create: `skills/write/templates/guide-template.md`
- Create: `skills/write/templates/api-template.md`
- Create: `skills/write/templates/faq-template.md`
- Create: `skills/write/write.md`
- Create: `tests/write-templates.test.js`

**Interfaces:**
- Consumes: `.insightify/plan.md` and `.insightify/knowledge/*.md`.
- Produces: Pure markdown pages in `docs/`.

- [ ] **Step 1: Write failing test for writer templates**

```javascript
// tests/write-templates.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Writer Templates', () => {
  test('templates exist and contain expected frontmatter placeholders', () => {
    const guide = fs.readFileSync(path.join(__dirname, '../skills/write/templates/guide-template.md'), 'utf8');
    const api = fs.readFileSync(path.join(__dirname, '../skills/write/templates/api-template.md'), 'utf8');
    const faq = fs.readFileSync(path.join(__dirname, '../skills/write/templates/faq-template.md'), 'utf8');

    assert.strictEqual(guide.includes('title:'), true);
    assert.strictEqual(api.includes('title:'), true);
    assert.strictEqual(faq.includes('title:'), true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/write-templates.test.js`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement writer templates and Writer skill**

Create `skills/write/templates/guide-template.md`:
```markdown
---
title: "<Title>"
description: "<Description>"
audience: "<Audience>"
sources:
  - product.md
---

# <Title>

<Overview>

## Getting Started

<Instructions>
```

Create `skills/write/templates/api-template.md`:
```markdown
---
title: "<API Title>"
description: "<API Overview>"
audience: "developers"
sources:
  - api.md
---

# <API Title>

## Authentication

<Auth details>

## Endpoints

<Endpoint details>
```

Create `skills/write/templates/faq-template.md`:
```markdown
---
title: "Troubleshooting & FAQ"
description: "Frequently Asked Questions and Known Issues"
audience: "all"
sources:
  - constraints.md
  - unanswered.md
---

# Troubleshooting & FAQ

## Common Issues

<Issues and resolutions>
```

Create `skills/write/write.md`:
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/write-templates.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/write/ tests/write-templates.test.js
git commit -m "feat: implement Stage 4 writer templates and skill"
```

---

### Task 6: Implement Stage 5 Criteria & Skill (Documentation Reviewer)

**Files:**
- Create: `skills/review/references/review-criteria.md`
- Create: `skills/review/review.md`
- Create: `tests/review-criteria.test.js`

**Interfaces:**
- Consumes: `docs/*`, `.insightify/knowledge/*`, `.insightify/plan.md`.
- Produces: `.insightify/review/review-report.md`.

- [ ] **Step 1: Write failing test for review criteria**

```javascript
// tests/review-criteria.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Review Criteria', () => {
  test('review-criteria.md covers the 5 dimensions', () => {
    const criteria = fs.readFileSync(path.join(__dirname, '../skills/review/references/review-criteria.md'), 'utf8');
    const dimensions = ['Accuracy', 'Completeness', 'Consistency', 'Structure', 'Usability'];
    dimensions.forEach(dim => {
      assert.strictEqual(criteria.includes(dim), true);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/review-criteria.test.js`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement review criteria and Review skill**

Create `skills/review/references/review-criteria.md`:
```markdown
# Documentation Review Criteria (5 Dimensions)

1. **Accuracy**: Compare `docs/*` against `.insightify/knowledge/*`. All claims must match knowledge facts.
2. **Completeness**: Compare `docs/*` against `.insightify/plan.md`. All planned sections must be present.
3. **Consistency**: Terminology, tone, formatting must be uniform across all `docs/*`.
4. **Structure**: Heading levels must be incremental (H1 -> H2 -> H3). Links between pages must be valid.
5. **Usability**: Clear code examples, readable prose targeted to the intended audience.

Report Verdicts:
- `approved`: Zero critical or major issues.
- `changes_needed`: Issues present (requires targeted rewrite by Stage 4).

Safety Valve:
- Max 3 iteration loops. After 3 loops, escalate remaining issues to user.
```

Create `skills/review/review.md`:
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/review-criteria.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/review/ tests/review-criteria.test.js
git commit -m "feat: implement Stage 5 review criteria and skill"
```

---

### Task 7: Implement Stage 6 Templates & Skill (Documentation Builder)

**Files:**
- Create: `skills/build/templates/vitepress-config.js`
- Create: `skills/build/templates/sidebar-template.js`
- Create: `skills/build/templates/index-template.md`
- Create: `skills/build/build.md`
- Create: `tests/build-templates.test.js`

**Interfaces:**
- Consumes: `docs/*` and `.insightify/knowledge/*`.
- Produces: `.vitepress/config.js`, transformed `docs/*`, `knowledge-base/*`, `package.json`, `README.md`.

- [ ] **Step 1: Write failing test for build templates**

```javascript
// tests/build-templates.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Build Templates', () => {
  test('vitepress config template is valid JavaScript structure', () => {
    const configTpl = fs.readFileSync(path.join(__dirname, '../skills/build/templates/vitepress-config.js'), 'utf8');
    assert.strictEqual(configTpl.includes('defineConfig'), true);
    assert.strictEqual(configTpl.includes('themeConfig'), true);
  });

  test('index template contains hero frontmatter', () => {
    const indexTpl = fs.readFileSync(path.join(__dirname, '../skills/build/templates/index-template.md'), 'utf8');
    assert.strictEqual(indexTpl.includes('layout: home'), true);
    assert.strictEqual(indexTpl.includes('hero:'), true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/build-templates.test.js`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement build templates and Builder skill**

Create `skills/build/templates/vitepress-config.js`:
```javascript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '{{TITLE}}',
  description: 'Generated by insightify',
  themeConfig: {
    nav: {{NAV}},
    sidebar: {{SIDEBAR}},
    footer: {
      message: 'Generated by insightify'
    }
  }
})
```

Create `skills/build/templates/sidebar-template.js`:
```javascript
module.exports = function buildSidebar(planPages) {
  return planPages.map(page => ({
    text: page.title,
    link: '/' + page.slug
  }));
};
```

Create `skills/build/templates/index-template.md`:
```markdown
---
layout: home
hero:
  name: "{{PRODUCT_NAME}}"
  text: "Documentation"
  tagline: "{{TAGLINE}}"
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: API Reference
      link: /api-reference
---
```

Create `skills/build/build.md`:
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/build-templates.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/build/ tests/build-templates.test.js
git commit -m "feat: implement Stage 6 build templates and skill"
```

---

### Task 8: Implement Orchestrator Skill (`insightify.md`) & Integration Test

**Files:**
- Create: `skills/insightify.md`
- Create: `tests/orchestrator-validation.test.js`

**Interfaces:**
- Consumes: User inputs (project name, files/URLs).
- Produces: Sequentially invokes Stage 1 through Stage 6 skills; handles user approval checkpoints.

- [ ] **Step 1: Write failing test for orchestrator skill definition**

```javascript
// tests/orchestrator-validation.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Orchestrator Skill', () => {
  test('insightify.md references all 6 stage skills in sequence', () => {
    const orchestrator = fs.readFileSync(path.join(__dirname, '../skills/insightify.md'), 'utf8');
    const stages = [
      'insightify-ingest',
      'insightify-extract',
      'insightify-plan',
      'insightify-write',
      'insightify-review',
      'insightify-build'
    ];
    stages.forEach(stage => {
      assert.strictEqual(orchestrator.includes(stage), true);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/orchestrator-validation.test.js`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement orchestrator skill `insightify.md`**

Create `skills/insightify.md`:
```markdown
---
name: insightify
description: Orchestrate 6-stage pipeline to generate VitePress docs site and Product Knowledge Base.
---

# Insightify Main Orchestrator

## Execution Pipeline

1. **Initialization**:
   - Ask user for project name if not provided.
   - Ask for source files/URLs if not provided.
   - Create output project directory: `<project-name>/`.

2. **Stage 1: Source Ingestion**
   - Call `/insightify-ingest` with sources.
   - Output: `<project-name>/.insightify/sources/`

3. **Stage 2: Knowledge Extraction**
   - Call `/insightify-extract`.
   - Output: `<project-name>/.insightify/knowledge/`

4. **Stage 3: Documentation Planner**
   - Call `/insightify-plan`.
   - Present plan to user in chat.
   - **CHECKPOINT 1 (User Approval)**: Wait for user confirmation/revisions before proceeding.
   - Output: `<project-name>/.insightify/plan.md`

5. **Stage 4: Documentation Writer**
   - Call `/insightify-write`.
   - Output: `<project-name>/docs/`
   - **CHECKPOINT 2 (User Review)**: Display file summary and ask user if targeted changes are needed.

6. **Stage 5: Documentation Reviewer**
   - Call `/insightify-review`.
   - Evaluate docs across 5 dimensions.
   - If changes needed: loop back to `/insightify-write` for targeted fixes (max 3 iterations).

7. **Stage 6: Documentation Builder**
   - Call `/insightify-build`.
   - Output: `.vitepress/`, `knowledge-base/`, `package.json`, `README.md`.
   - Validate links and structure.
   - Print completion summary and VitePress preview instructions.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/orchestrator-validation.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/insightify.md tests/orchestrator-validation.test.js
git commit -m "feat: implement main orchestrator skill and validation tests"
```
