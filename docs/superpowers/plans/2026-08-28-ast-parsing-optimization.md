# AST Parsing Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the performance of AST extraction by caching parser instances and eliminating deep recursive AST traversal.

**Architecture:** 
1. **Caching**: We will refactor `ast-extractor.js` to instantiate the `Tree-sitter` parsers and language bindings lazily and cache them at the module level. This prevents reading WebAssembly/native bindings from disk on every function call.
2. **Traversal**: We will replace the deep recursive `walk` (which visits every node in a file) with a shallow traversal. Imports and exports are top-level statements, so iterating over `tree.rootNode.children` is sufficient and orders of magnitude faster.

**Tech Stack:** Node.js, tree-sitter

## Global Constraints

- Must maintain the exact same function signature for `extractAst(code, lang)`.
- Existing tests (`ast-extractor.test.js` and `code-parser.test.js`) must continue to pass without modification.

---

### Task 1: Refactor Parser Instantiation (Caching)

**Files:**
- Modify: `skills/planner/parsers/ast-extractor.js:1-17`

**Interfaces:**
- Consumes: N/A
- Produces: Efficient `extractAst` function that reuses `Parser` instances.

- [x] **Step 1: Write the minimal implementation**

Modify `skills/planner/parsers/ast-extractor.js` to move parsers outside the function:
```javascript
const Parser = require('tree-sitter');

const parsers = {};

function getParser(lang) {
    if (parsers[lang]) return parsers[lang];
    
    const parser = new Parser();
    if (lang === 'ts' || lang === 'tsx') {
        parser.setLanguage(require('tree-sitter-typescript').typescript);
    } else if (lang === 'js' || lang === 'jsx') {
        parser.setLanguage(require('tree-sitter-javascript'));
    } else if (lang === 'py') {
        parser.setLanguage(require('tree-sitter-python'));
    } else {
        return null;
    }
    
    parsers[lang] = parser;
    return parser;
}

function extractAst(code, lang) {
    try {
        const parser = getParser(lang);
        if (!parser) return { status: 'failed' };
        
        const tree = parser.parse(code);
```

- [x] **Step 2: Run test to verify it passes**

Run: `npx jest tests/ast-extractor.test.js`
Expected: PASS

- [x] **Step 3: Commit**

```bash
git add skills/planner/parsers/ast-extractor.js
git commit -m "perf: cache tree-sitter parser instances"
```

---

### Task 2: Refactor AST Traversal (Shallow Search)

**Files:**
- Modify: `skills/planner/parsers/ast-extractor.js` (inside `extractAst` function)

**Interfaces:**
- Consumes: `tree.rootNode`
- Produces: Correct `imports` and `exports` arrays without deep recursion.

- [x] **Step 1: Write the minimal implementation**

Replace the recursive `walk` block in `extractAst` with a shallow loop over top-level children:
```javascript
        const imports = [];
        const exports = [];
        
        // Shallow traversal of top-level nodes only
        for (const node of tree.rootNode.children) {
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
        }

        return { status: 'success', imports, exports };
```

- [x] **Step 2: Run test to verify it passes**

Run: `npx jest tests/ast-extractor.test.js`
Expected: PASS

- [x] **Step 3: Commit**

```bash
git add skills/planner/parsers/ast-extractor.js
git commit -m "perf: optimize ast traversal to shallow search"
```
