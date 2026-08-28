# AST Parsing Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Tree-sitter for accurate AST-based dependency extraction in Insightify code parsing.

**Architecture:** We will add `tree-sitter` and language bindings to the project. We will create a new `ast-extractor.js` utility to handle Tree-sitter setup and querying. Finally, `code-parser.js` will be updated to leverage this utility and inject `<ast-dependencies>` blocks into the parsed markdown, falling back to regex if necessary.

**Tech Stack:** Node.js, tree-sitter, tree-sitter-javascript, tree-sitter-typescript, tree-sitter-python

## Global Constraints

- Must run natively in Node.js environments.
- Fallback to existing regex extraction is required if Tree-sitter fails to initialize or parse a file.

---

### Task 1: Add Dependencies

**Files:**
- Modify: `package.json:10-15`

**Interfaces:**
- Consumes: N/A
- Produces: Installed NPM packages

- [ ] **Step 1: Install Tree-sitter packages**

```bash
npm install tree-sitter tree-sitter-javascript tree-sitter-typescript tree-sitter-python
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add tree-sitter dependencies"
```

---

### Task 2: Implement AST Extractor Utility

**Files:**
- Create: `skills/planner/parsers/ast-extractor.js`
- Test: `tests/ast-extractor.test.js`

**Interfaces:**
- Consumes: Raw code string, language identifier string.
- Produces: `function extractAst(code, lang)` returning an object `{ imports: string[], exports: string[], status: 'success' | 'failed' }`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/ast-extractor.test.js
const { extractAst } = require('../skills/planner/parsers/ast-extractor.js');

test('extracts imports from typescript', () => {
    const code = `import { foo } from 'bar'; export const baz = 1;`;
    const result = extractAst(code, 'ts');
    expect(result.status).toBe('success');
    expect(result.imports).toContain('bar');
    expect(result.exports).toContain('baz');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/ast-extractor.test.js`
Expected: FAIL with module not found or function not defined

- [ ] **Step 3: Write minimal implementation**

```javascript
// skills/planner/parsers/ast-extractor.js
const Parser = require('tree-sitter');

function extractAst(code, lang) {
    try {
        const parser = new Parser();
        if (lang === 'ts' || lang === 'tsx') {
            parser.setLanguage(require('tree-sitter-typescript').typescript);
        } else if (lang === 'js' || lang === 'jsx') {
            parser.setLanguage(require('tree-sitter-javascript'));
        } else if (lang === 'py') {
            parser.setLanguage(require('tree-sitter-python'));
        } else {
            return { status: 'failed' };
        }

        const tree = parser.parse(code);
        const imports = [];
        const exports = [];
        
        // Very basic manual traversal for this minimal implementation step
        const walk = (node) => {
            if (node.type === 'import_statement' || node.type === 'import_from_statement') {
                const source = node.children.find(c => c.type === 'string');
                if (source) imports.push(source.text.replace(/['"]/g, ''));
            }
            if (node.type === 'export_statement') {
                const dec = node.children.find(c => c.type === 'lexical_declaration' || c.type === 'variable_declaration');
                if (dec) {
                    const id = dec.children.find(c => c.type === 'variable_declarator');
                    if (id && id.children[0]) exports.push(id.children[0].text);
                }
            }
            node.children.forEach(walk);
        };
        walk(tree.rootNode);

        return { status: 'success', imports, exports };
    } catch (e) {
        return { status: 'failed', error: e.message };
    }
}

module.exports = { extractAst };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/ast-extractor.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/planner/parsers/ast-extractor.js tests/ast-extractor.test.js
git commit -m "feat: implement basic AST extractor utility"
```

---

### Task 3: Integrate AST Extraction into Code Parser

**Files:**
- Modify: `skills/planner/parsers/code-parser.js`

**Interfaces:**
- Consumes: `extractAst` from Task 2.
- Produces: Appended `<ast-dependencies>` XML block in the returned Markdown string.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/code-parser.test.js
const { parseCode } = require('../skills/planner/parsers/code-parser.js');

test('injects ast-dependencies block', () => {
    const code = `import { a } from 'b';`;
    const result = parseCode(code, 'ts');
    expect(result).toContain('<ast-dependencies>');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/code-parser.test.js`
Expected: FAIL (missing ast-dependencies)

- [ ] **Step 3: Write minimal implementation**

Modify `skills/planner/parsers/code-parser.js`:
```javascript
// Add at the top:
const { extractAst } = require('./ast-extractor');

// Near the end of function parseCode(codeString, lang), right before `return output;`:
  const astResult = extractAst(codeString, lang);
  if (astResult.status === 'success') {
      output += '\n\n<ast-dependencies>\n';
      output += JSON.stringify({ imports: astResult.imports, exports: astResult.exports }, null, 2);
      output += '\n</ast-dependencies>';
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/code-parser.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add skills/planner/parsers/code-parser.js tests/code-parser.test.js
git commit -m "feat: integrate AST extraction into code parser"
```
