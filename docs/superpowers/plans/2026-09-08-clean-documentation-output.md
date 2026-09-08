# Clean Documentation Output Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove source citations (`> **Source:**`) and the internal "Documentation Pipeline" process section from all Insightify user-facing documentation outputs, while bringing the plugin test suite to 100% green.

**Architecture:** A defense-in-depth approach combining updated AI agent instructions in `skills/writer/SKILL.md`, `skills/reviewer/SKILL.md`, and `skills/builder/SKILL.md` with runtime code sanitization in `skills/builder/templates/build-html.mjs` (regex strip on Markdown assembly + empty return on citation blockquotes in HTML renderer) and removing the `buildProcessDiagram` generator. Test assertions in `tests/write-templates.test.js` and `tests/build-templates.test.js` are updated to match.

**Tech Stack:** Node.js (v18+ / v20+), Node Test Runner (`node --test`), Markdown, HTML5 / CSS3.

## Global Constraints

- Working directory: `D:/AryokPunya/Magang/insight/.claude/plugins/insightify`
- Do NOT remove source citation extraction from `.insightify/knowledge/*.md` (Planner internal extraction retains citations for internal fact auditing).
- Do NOT introduce new external runtime dependencies.
- Ensure all 133 unit and integration tests pass via `npm test`.

---

### Task 1: Update Builder Runtime Script (`build-html.mjs`) & Builder Tests

**Files:**
- Modify: `skills/builder/templates/build-html.mjs:72-80`
- Modify: `skills/builder/templates/build-html.mjs:445-502`
- Modify: `skills/builder/templates/build-html.mjs:520-545`
- Modify: `skills/builder/templates/build-html.mjs:575-650`
- Modify: `tests/build-templates.test.js:365-375`
- Modify: `tests/build-templates.test.js:440-450`

**Interfaces:**
- Consumes: Final Markdown documentation file (`final-documentation.md`) and knowledge base directory (`.insightify/knowledge`).
- Produces: Sanitized `Product-Knowledge-Base.md` (no `> **Source:**` lines) and `index.html` (no `source-citation` blockquotes, no `id="pipeline"` or `Documentation Pipeline` section).

- [ ] **Step 1: Update failing tests in `tests/build-templates.test.js`**

Update `tests/build-templates.test.js`:
1. In test `'builder builds artifact HTML and knowledge base from finalized doc'`, change `assert.ok(artifact.html.includes('id="pipeline"'));` to:
   ```javascript
   assert.strictEqual(artifact.html.includes('id="pipeline"'), false, 'artifact must not include pipeline section');
   assert.strictEqual(artifact.html.includes('Documentation Pipeline'), false, 'artifact must not include Documentation Pipeline header');
   ```
2. Replace test `'builder builds process diagram with 4 steps'` with citation sanitization tests:
   ```javascript
   test('assembleKnowledgeBase strips blockquote source citations', () => {
     const tempDoc = path.join(fixturesDir, 'temp-citation-doc.md');
     fs.writeFileSync(tempDoc, '# Test Doc\n\n## Section 1\n\nSome paragraph.\n\n> **Source:** source-001.md § Overview\n\nAnother paragraph.\n', 'utf8');
     const kb = assembleKnowledgeBase(tempDoc, { kbDir: fixture14KbDir });
     assert.strictEqual(kb.includes('> **Source:**'), false, 'Knowledge base must not contain source citations');
     assert.ok(kb.includes('Some paragraph.'));
     assert.ok(kb.includes('Another paragraph.'));
     fs.unlinkSync(tempDoc);
   });

   test('renderMarkdown suppresses blockquote source citations', () => {
     const mdWithCitation = 'Text before citation.\n\n> **Source:** source-001.md § Overview\n\nText after citation.';
     const html = renderMarkdown(mdWithCitation);
     assert.strictEqual(html.includes('source-citation'), false);
     assert.strictEqual(html.includes('source-001.md'), false);
     assert.ok(html.includes('Text before citation.'));
   });
   ```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test tests/build-templates.test.js`
Expected: FAIL on pipeline assertions or citation sanitization.

- [ ] **Step 3: Implement code changes in `skills/builder/templates/build-html.mjs`**

1. In `renderer.blockquote` (lines 72-80), suppress source citations:
   ```javascript
   // Render blockquotes (suppress source citations in HTML output)
   renderer.blockquote = (quote) => {
     const quoteText = typeof quote === 'object' ? (quote.text || '') : quote;
     if (quoteText.includes('**Source:**') || quoteText.includes('<strong>Source:</strong>') || quoteText.includes('Source:')) {
       return '';
     }
     return `<blockquote>${quoteText}</blockquote>\n`;
   };
   ```
2. Remove `export function buildProcessDiagram()` (lines 448-501).
3. In `assembleKnowledgeBase(finalDocPath, options)` (lines 520-545), sanitize citations from markdown body:
   ```javascript
   // Strip frontmatter
   let body = content;
   const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
   if (frontmatterMatch) {
     body = frontmatterMatch[2];
   }

   // Strip blockquote source citations
   body = body.replace(/^>\s*\*\*Source:\*\*.*(?:\r?\n)?/gm, '').replace(/\n{3,}/g, '\n\n');
   ```
4. In `buildArtifact(options)` (lines 574-650), remove `const processDiagram = buildProcessDiagram();` and remove `PROCESS_DIAGRAM: processDiagram` from template variables.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/build-templates.test.js`
Expected: PASS on all builder tests.

- [ ] **Step 5: Commit**

```bash
git add skills/builder/templates/build-html.mjs tests/build-templates.test.js
git commit -m "fix(builder): remove pipeline diagram and sanitize source citations from outputs"
```

---

### Task 2: Align Writer Templates Test (`tests/write-templates.test.js`)

**Files:**
- Modify: `tests/write-templates.test.js:61-79`

**Interfaces:**
- Consumes: Templates in `skills/writer/templates/*.md`.
- Produces: Validated test suite passing without requiring `> **Source:**` in documentation templates.

- [ ] **Step 1: Remove source citation requirement in `tests/write-templates.test.js`**

In `tests/write-templates.test.js` lines 74-78:
Remove:
```javascript
assert.ok(content.includes('> **Source:**'), `${filename} must contain blockquote source citations`);
```
Keep structural validations:
```javascript
// Content structure validation
assert.ok(content.includes('# '), `${filename} must have an H1 title`);
assert.ok(content.includes('## '), `${filename} must have H2 section headers`);
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node --test tests/write-templates.test.js`
Expected: All 12 tests in `write-templates.test.js` PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/write-templates.test.js
git commit -m "test(writer): remove source citation requirement from template tests"
```

---

### Task 3: Update Skill Instructions (`writer`, `reviewer`, `builder`)

**Files:**
- Modify: `skills/writer/SKILL.md`
- Modify: `skills/reviewer/SKILL.md`
- Modify: `skills/builder/SKILL.md`

**Interfaces:**
- Consumes: None.
- Produces: Updated AI prompt instructions for writer, reviewer, and builder skills.

- [ ] **Step 1: Update `skills/writer/SKILL.md`**

Add clear rule in `skills/writer/SKILL.md` under `## Content Structure` or `## Writing Style`:
```markdown
- **NO Source Citations in Final Documentation**: Do NOT output `> **Source:** ...` or any blockquote source citations in the rendered markdown documentation. The user-facing documentation must be clean, readable, and client-ready. Source citations belong strictly to the internal extraction knowledge base (`.insightify/knowledge/`).
```

- [ ] **Step 2: Update `skills/reviewer/SKILL.md`**

1. In `skills/reviewer/SKILL.md` line 84 (*Minor Issues*), remove `missing citation`:
   Change:
   `- **Minor**: Typo, slightly inconsistent tone, suboptimal heading level, missing citation, document length between 500-700 lines`
   To:
   `- **Minor**: Typo, slightly inconsistent tone, suboptimal heading level, document length between 500-700 lines`
2. Under `## Scoring Rubric` / `Accuracy`, clarify:
   ```markdown
   Note: Source citations (`> **Source:**`) are intentionally omitted from user-facing documentation (`documentation.md`). Do NOT flag missing citations as an accuracy or completeness defect.
   ```

- [ ] **Step 3: Update `skills/builder/SKILL.md`**

1. Remove line 113: `- **Process Diagram**: 4-step flexbox (Planner → Writer → Reviewer → Builder) with In/Out labels.`
2. Update line 107: change `(citations preserved with source-citation class)` to `(source citations suppressed)`.
3. Update line 124: change `preserve all '> **Source:**' citations` to `strip all '> **Source:**' citations`.
4. Update lines 282-283: remove `{{PROCESS_DIAGRAM}}` and `buildProcessDiagram()` references, and sync template paths to `templates/layouts/base.html` and `templates/components/`.

- [ ] **Step 4: Run full test suite**

Run: `npm test`
Expected: All 133 tests PASS (100% green).

- [ ] **Step 5: Commit**

```bash
git add skills/writer/SKILL.md skills/reviewer/SKILL.md skills/builder/SKILL.md
git commit -m "docs(skills): update writer, reviewer, and builder instructions for clean documentation"
```

---

### Task 4: End-to-End Verification & Sanity Check on `congen10`

**Files:**
- Read: `insights/congen10/docs/final/final-documentation.md`
- Generate/Verify: `insights/congen10/Product-Knowledge-Base.md` and `insights/congen10/index.html`

**Interfaces:**
- Consumes: Existing `insights/congen10/` output from user's test run.
- Produces: Cleaned deliverables for `congen10` confirming both requirements are fulfilled.

- [ ] **Step 1: Execute `buildArtifact` against `insights/congen10`**

Run node one-liner to build `congen10`:
```bash
node -e "import('./skills/builder/templates/build-html.mjs').then(m => m.buildArtifact({ outDir: '../../insights/congen10', kbDir: '../../insights/congen10/.insightify/knowledge', docPath: '../../insights/congen10/docs/final/final-documentation.md' }))"
```

- [ ] **Step 2: Verify `Product-Knowledge-Base.md` in `insights/congen10`**

Check that `Product-Knowledge-Base.md`:
1. Exists and has content.
2. Does NOT contain `> **Source:**`.
3. Does NOT contain `Documentation Pipeline`.

- [ ] **Step 3: Verify `index.html` in `insights/congen10`**

Check that `index.html`:
1. Exists and has content.
2. Does NOT contain `source-citation`.
3. Does NOT contain `id="pipeline"` or `Documentation Pipeline`.

- [ ] **Step 4: Clean final documentation markdown in `congen10`**

Sanitize the existing `insights/congen10/docs/final/final-documentation.md` to remove any lingering `> **Source:**` lines so the user's open document reflects the requested clean state immediately.
