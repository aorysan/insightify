# Insightify Plugin V4 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix code bugs, documentation inconsistencies, dead code, and test coverage gaps in the Insightify plugin repository.

**Architecture:**
The fixes span multiple independent subsystems: Parsers, Builder, Documentation, Templates, and Tests. Tasks are isolated per subsystem.

**Tech Stack:** Node.js, Markdown, HTML/CSS

## Global Constraints
- Preserve existing working behaviors.
- All tests must pass (`npm test`).
- Fixes must be applied to `D:\AryokPunya\Magang\insight\.claude\plugins\insightify`.

---

### Task 1: Fix Parsers (`json-parser.js`, `html-parser.js`, `code-parser.js`)

**Files:**
- Modify: `skills/planner/parsers/json-parser.js`
- Modify: `skills/planner/parsers/html-parser.js`
- Modify: `skills/planner/parsers/code-parser.js`

- [ ] **Step 1: Fix `json-parser.js` fallback for arbitrary JSON**
Modify `skills/planner/parsers/json-parser.js`:
Find:
```javascript
    if (Object.keys(extracted.compilerOptions).length > 0) {
      output += `## TypeScript Compiler Options\n\`\`\`json\n${JSON.stringify(extracted.compilerOptions, null, 2)}\n\`\`\`\n\n`;
    }

    return output.trim();
```
Replace with:
```javascript
    if (Object.keys(extracted.compilerOptions).length > 0) {
      output += `## TypeScript Compiler Options\n\`\`\`json\n${JSON.stringify(extracted.compilerOptions, null, 2)}\n\`\`\`\n\n`;
    }

    const finalOutput = output.trim();
    if (!finalOutput) {
      return \`## JSON Data\\n\\\`\\\`\\\`json\\n\${JSON.stringify(data, null, 2)}\\n\\\`\\\`\\\`\`;
    }
    return finalOutput;
```

- [ ] **Step 2: Fix `html-parser.js` pipe escaping in tables**
Modify `skills/planner/parsers/html-parser.js`:
Find:
```javascript
    $(tr).find('th, td').each((__, cell) => {
      cells.push($(cell).text().trim());
    });
```
Replace with:
```javascript
    $(tr).find('th, td').each((__, cell) => {
      cells.push($(cell).text().trim().replace(/\\|/g, '\\\\|'));
    });
```

- [ ] **Step 3: Fix `code-parser.js` raw code duplication**
Modify `skills/planner/parsers/code-parser.js`:
Find:
```javascript
  // Build markdown representation strictly for interfaces, types, enums, components, hooks, imports
  let output = comments.join('\n\n') || codeString;
```
Replace with:
```javascript
  // Build markdown representation strictly for interfaces, types, enums, components, hooks, imports
  let output = comments.join('\n\n');
  const hasDefinitions = extracted.interfaces.length > 0 || extracted.types.length > 0 || 
                         extracted.enums.length > 0 || extracted.components.length > 0 || 
                         extracted.hooks.length > 0;
  
  if (!output && !hasDefinitions) {
      output = codeString;
  }
```

- [ ] **Step 4: Run tests**
Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -am "fix(parsers): json fallback, html table pipe escape, code parser duplication"`

---

### Task 2: Fix Builder Duplicate Headings

**Files:**
- Modify: `skills/builder/templates/build-html.mjs`

- [ ] **Step 1: Strip leading H1 in `buildDocSections`**
Modify `skills/builder/templates/build-html.mjs`:
Find:
```javascript
    const title = frontmatter.title || (typeof page === 'object' ? page.title : null) || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    sectionsHtml += `
      <section id="${escapeHtml(slug)}" class="doc-section">
        <span class="section-label">${escapeHtml(label)}</span>
        <h2>${escapeHtml(title)}</h2>
        ${renderMarkdown(content)}
      </section>
    `;
```
Replace with:
```javascript
    const title = frontmatter.title || (typeof page === 'object' ? page.title : null) || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cleanedContent = content.replace(/^#\\s+[^\\n]+\\n*/, '');

    sectionsHtml += `
      <section id="${escapeHtml(slug)}" class="doc-section">
        <span class="section-label">${escapeHtml(label)}</span>
        <h2>${escapeHtml(title)}</h2>
        ${renderMarkdown(cleanedContent)}
      </section>
    `;
```

- [ ] **Step 2: Run tests and Commit**
Run: `npm test`
Run: `git commit -am "fix(builder): strip leading h1 to prevent duplicate headings"`

---

### Task 3: Documentation & Hygiene

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `skills/insightify/SKILL.md`
- Modify: `.gitignore`
- Delete: `skills/builder/templates/index-template.md`, `skills/builder/templates/sidebar-template.js`, `skills/builder/templates/vitepress-config.js`

- [ ] **Step 1: Update AGENTS.md**
Modify `AGENTS.md` to reflect V4 architecture (4 stages instead of 6, output to HTML artifact, dependencies include marked, jsdom, mermaid).

- [ ] **Step 2: Update README.md and SKILL.md paths**
In `README.md`, ensure output paths mention `insights/<project-name>/` (plural). Change `/planner` to `/insightify-planner`.
In `skills/insightify/SKILL.md`, line 64, change `14. appendix` to `14. unanswered`.

- [ ] **Step 3: Remove legacy VitePress files**
Run: `git rm skills/builder/templates/index-template.md skills/builder/templates/sidebar-template.js skills/builder/templates/vitepress-config.js`

- [ ] **Step 4: Update .gitignore**
Add `.claude/settings.local.json` to `.gitignore`.

- [ ] **Step 5: Remove H1 from all 14 writer templates**
Run a script or manually edit the 14 markdown files in `skills/writer/templates/` to remove the line starting with `# ` right after the frontmatter. (e.g., `# Executive Summary`).

- [ ] **Step 6: Commit**
Run: `git commit -am "chore: update docs, remove legacy files, clean templates"`

---

### Task 4: Strengthen Test Suite

**Files:**
- Modify: `tests/ingest-parsers.test.js`

- [ ] **Step 1: Add arbitrary JSON parsing test**
Modify `tests/ingest-parsers.test.js` to add a test case for `parseJson` with arbitrary JSON (e.g., `{"foo": "bar"}`). Verify it outputs `## JSON Data`.

- [ ] **Step 2: Add PDF parser buffer test**
Modify `tests/ingest-parsers.test.js`. Import `fs` and test `parsePdf` using `tests/fixtures/sample.pdf`.

- [ ] **Step 3: Run tests and Commit**
Run: `npm test`
Run: `git commit -am "test: improve parser coverage"`