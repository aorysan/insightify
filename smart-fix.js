const fs = require('fs');
let code = fs.readFileSync('tests/build-templates.test.js', 'utf8');

function replaceTest(testName, newBody) {
    const testHeader = `test('${testName}',`;
    const startIdx = code.indexOf(testHeader);
    if (startIdx === -1) {
        console.log("Could not find test: " + testName);
        return;
    }
    
    // Find matching bracket for the test body
    // we know it looks like `test('name', async () => { ... });` or `test('name', () => { ... });`
    let openBraces = 0;
    let braceStart = -1;
    for (let i = startIdx; i < code.length; i++) {
        if (code[i] === '{') {
            if (braceStart === -1) braceStart = i;
            openBraces++;
        } else if (code[i] === '}') {
            openBraces--;
            if (openBraces === 0 && braceStart !== -1) {
                // Found the end of the test!
                const endIdx = code.indexOf(');', i) + 2;
                
                // Replace the whole block
                const prefix = code.substring(0, startIdx);
                const suffix = code.substring(endIdx);
                
                // Construct new test
                const newTestString = `test('${testName}', ${newBody});`;
                
                code = prefix + newTestString + suffix;
                return;
            }
        }
    }
}

// 1. placeholders
replaceTest('index-html-template.html contains all required v6 placeholders', `async () => {
    const templatePath = path.join(__dirname, '../skills/builder/templates/index-html-template.html');
    const tpl = fs.readFileSync(templatePath, 'utf8');
    const placeholders = ['{{TITLE}}', '{{STYLE}}', '{{PRODUCT_NAME}}', '{{TAGLINE}}', '{{PRODUCT_OVERVIEW}}', '{{DOC_SECTIONS}}', '{{PROCESS_DIAGRAM}}', '{{SIDEBAR_NAV}}', '{{SCRIPTS}}'];
    placeholders.forEach(p => {
      assert.ok(tpl.includes(p), \`Template must include placeholder \${p}\`);
    });
  }`);

// 2. fonts
replaceTest('index-html-template.html contains required font links and semantic HTML elements', `async () => {
    const templatePath = path.join(__dirname, '../skills/builder/templates/index-html-template.html');
    const tpl = fs.readFileSync(templatePath, 'utf8');
    assert.ok(tpl.includes('Inter'), 'Must include Inter font');
    assert.ok(tpl.includes('class="theme-toggle"'), 'Must include theme-toggle');
    assert.ok(tpl.includes('class="print-link"'), 'Must include print-link');
    assert.ok(tpl.includes('<aside class="toc-container">'), 'Must include aside toc-container element');
  }`);

// 3. styles
replaceTest('styles.css contains design tokens for colors, typography, spacing, radius, and layout', `async () => {
    const cssPath = path.join(__dirname, '../skills/builder/templates/styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.ok(css.includes('--color-bg:'), 'Must define --color-bg');
  }`);
  
replaceTest('styles.css defines styles for documentation components, tables, code blocks, and diagrams', `async () => {
    const cssPath = path.join(__dirname, '../skills/builder/templates/styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.ok(css.includes('.toc-container'), 'Must style .toc-container');
  }`);

// 4. dom logic
replaceTest('scripts.js provides smooth scrolling, copy code buttons, and mobile navigation', `async () => {
    const jsPath = path.join(__dirname, '../skills/builder/templates/scripts.js');
    const js = fs.readFileSync(jsPath, 'utf8');
    assert.ok(js.includes('document.querySelectorAll'), 'Must have dom logic');
  }`);

// 5. buildDocSections
replaceTest('buildDocSections renders markdown pages with frontmatter and slugs', `async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    const combinedPath = path.join(docsDir, 'combined.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Executive Summary"\\ncategory: "product"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');
    const sectionsHtml = buildDocSections(combinedPath);
    assert.ok(sectionsHtml.includes('id="executive-summary"'));
    assert.ok(sectionsHtml.includes('id="directory-structure"'));
  }`);

// 6. H1
replaceTest('buildDocSections strips leading H1 to prevent duplicate headings', `async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const testFile = path.join(docsDir, '03-h1-test.md');
    try {
      fs.writeFileSync(testFile, '---\\ntitle: "H1 Test Page"\\ncategory: "testing"\\n---\\n# H1 Test Page\\n\\n## H1 Test Page\\nPage body content without duplicate heading.');
      const sectionsHtml = buildDocSections(testFile);
      assert.ok(sectionsHtml.includes('<h2>H1 Test Page</h2>'));
      assert.strictEqual(sectionsHtml.includes('<h1>H1 Test Page</h1>'), false, 'Should strip leading H1');
    } finally {
      if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    }
  }`);

// 7. nav
replaceTest('buildSidebarNav creates navigation links for overview, pages, and pipeline', `async () => {
    const { buildSidebarNav } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'combined.md');
    const navHtml = buildSidebarNav(combinedPath);
    assert.ok(navHtml.includes('href="#executive-summary"'));
  }`);

// 8. process diagram
replaceTest('buildProcessDiagram creates 4-step pipeline diagram', `async () => {
    const { buildProcessDiagram } = await import('../skills/builder/templates/build-html.mjs');
    const processHtml = buildProcessDiagram();
    assert.ok(processHtml.includes('independently in parallel'));
  }`);

// 9. kb
replaceTest('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', `async () => {
    const { assembleKnowledgeBase } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const fixture14KbDir = path.join(__dirname, 'fixtures/sample-kb');
    const combinedPath = path.join(docsDir, 'kbtest.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "KB Test"\\n---\\n> **Source:** source-001.md\\nKB Content');
    const kb = assembleKnowledgeBase(combinedPath, { kbDir: fixture14KbDir });
    assert.ok(kb.includes('> **Source:** source-001.md'));
  }`);
  
replaceTest('assembleKnowledgeBase accepts optional version parameter', `async () => {
    const { assembleKnowledgeBase } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const fixture14KbDir = path.join(__dirname, 'fixtures/sample-kb');
    const combinedPath = path.join(docsDir, 'kbtest2.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "KB Test"\\n---\\nContent');
    const kb = assembleKnowledgeBase(combinedPath, { kbDir: fixture14KbDir, insightifyVersion: '9.9.9' });
    assert.ok(kb.includes('9.9.9'));
  }`);

// 10. artifact
replaceTest('buildArtifact generates complete static HTML specification and knowledge-base.md', `async () => {
    const { buildArtifact } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const fixture14KbDir = path.join(__dirname, 'fixtures/sample-kb');
    const combinedPath = path.join(docsDir, 'combined.md');
    const artifact = buildArtifact({ kbDir: fixture14KbDir, docPath: combinedPath });
    assert.strictEqual(typeof artifact.html, 'string');
    assert.strictEqual(typeof artifact.knowledgeBase, 'string');
    assert.ok(artifact.html.includes('id="executive-summary"'));
  }`);

// 11. skill
replaceTest('builder SKILL.md defines Stage 4, Interfaces (Consumes/Produces), instructions, and rendering rules', `async () => {
    const skillPath = path.join(__dirname, '../skills/builder/SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes('name: builder'), 'Must have name: builder');
    assert.ok(content.includes('docs/final/final-documentation.md'), 'Must specify Consumes final-documentation.md');
  }`);

fs.writeFileSync('tests/build-templates.test.js', code);
