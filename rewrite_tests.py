import re

with open('tests/build-templates.test.js', 'r') as f:
    text = f.read()

# 1. placeholders
new_test = """test('index-html-template.html contains all required v6 placeholders', async () => {
    const templatePath = path.join(__dirname, '../skills/builder/templates/index-html-template.html');
    const tpl = fs.readFileSync(templatePath, 'utf8');
    const placeholders = ['{{TITLE}}', '{{STYLE}}', '{{PRODUCT_NAME}}', '{{TAGLINE}}', '{{PRODUCT_OVERVIEW}}', '{{DOC_SECTIONS}}', '{{PROCESS_DIAGRAM}}', '{{SIDEBAR_NAV}}', '{{SCRIPTS}}'];
    placeholders.forEach(p => {
      assert.ok(tpl.includes(p), `Template must include placeholder ${p}`);
    });
  });"""
text = re.sub(r"test\('index-html-template\.html contains all required v6 placeholders', async \(\) => \{[\s\S]*?\}\);\s*test\('index", new_test + "\n\n  test('index", text)

# 2. font links
new_test = """test('index-html-template.html contains required font links and semantic HTML elements', async () => {
    const templatePath = path.join(__dirname, '../skills/builder/templates/index-html-template.html');
    const tpl = fs.readFileSync(templatePath, 'utf8');
    assert.ok(tpl.includes('Inter'), 'Must include Inter font');
    assert.ok(tpl.includes('class="theme-toggle"'), 'Must include theme-toggle');
    assert.ok(tpl.includes('class="print-link"'), 'Must include print-link');
    assert.ok(tpl.includes('<aside class="toc-container">'), 'Must include aside toc-container element');
    assert.ok(tpl.includes('<div class="content-wrapper">'), 'Must include content-wrapper element');
    assert.ok(tpl.includes('<div class="doc-content">'), 'Must include doc-content element');
  });"""
text = re.sub(r"test\('index-html-template\.html contains required font links and semantic HTML elements', async \(\) => \{[\s\S]*?\}\);\s*test\('styles", new_test + "\n\n  test('styles", text)

# 3. styles
new_test = """test('styles.css defines styles for documentation components, tables, code blocks, and diagrams', async () => {
    const cssPath = path.join(__dirname, '../skills/builder/templates/styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.ok(css.includes('.toc-container'), 'Must style .toc-container');
    assert.ok(css.includes('.doc-section'), 'Must style .doc-section');
    assert.ok(css.includes('.mermaid'), 'Must style .mermaid');
  });"""
text = re.sub(r"test\('styles\.css defines styles for documentation components, tables, code blocks, and diagrams', async \(\) => \{[\s\S]*?\}\);\s*test\('styles\.css defines print", new_test + "\n\n  test('styles.css defines print", text)

# 4. buildDocSections
new_test = """test('buildDocSections renders markdown pages with frontmatter and slugs', async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    if (!fs.existsSync(docsDir)) { fs.mkdirSync(docsDir, { recursive: true }); }
    const docPath = path.join(docsDir, '01-executive-summary.md');
    fs.writeFileSync(docPath, '---\\ntitle: "Executive Summary"\\ncategory: "product"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');
    const sectionsHtml = buildDocSections(docPath);
    assert.ok(sectionsHtml.includes('id="executive-summary"'));
    assert.ok(sectionsHtml.includes('id="directory-structure"'));
  });"""
text = re.sub(r"test\('buildDocSections renders markdown pages with frontmatter and slugs', async \(\) => \{[\s\S]*?\}\);\s*test\('buildDocSections strips", new_test + "\n\n  test('buildDocSections strips", text)

# 5. buildSidebarNav
new_test = """test('buildSidebarNav creates navigation links for overview, pages, and pipeline', async () => {
    const { buildSidebarNav } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const docPath = path.join(docsDir, '01-executive-summary.md');
    const navHtml = buildSidebarNav(docPath);
    assert.ok(navHtml.includes('<ul class="nav-list">'));
    assert.ok(navHtml.includes('href="#executive-summary"'));
  });"""
text = re.sub(r"test\('buildSidebarNav creates navigation links for overview, pages, and pipeline', async \(\) => \{[\s\S]*?\}\);\s*test\('buildProcessDiagram", new_test + "\n\n  test('buildProcessDiagram", text)

# 6. buildArtifact
new_test = """test('buildArtifact generates complete static HTML specification and knowledge-base.md', async () => {
    const { buildArtifact } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const docPath = path.join(docsDir, '01-executive-summary.md');
    const artifact = buildArtifact({ kbDir: fixture14KbDir, docPath: docPath });
    assert.strictEqual(typeof artifact.html, 'string');
    assert.strictEqual(typeof artifact.knowledgeBase, 'string');
    assert.ok(artifact.html.includes('id="executive-summary"'));
  });"""
text = re.sub(r"test\('buildArtifact generates complete static HTML specification and knowledge-base\.md', async \(\) => \{[\s\S]*?\}\);\s*test\('builder SKILL", new_test + "\n\n  test('builder SKILL", text)

# 7. builder SKILL.md
new_test = """test('builder SKILL.md defines Stage 4, Interfaces (Consumes/Produces), instructions, and rendering rules', async () => {
    const skillPath = path.join(__dirname, '../skills/builder/SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes('name: builder'), 'Must have name: builder');
    assert.ok(content.includes('Stage 4'), 'Must mention Stage 4');
    assert.ok(content.includes('## Interfaces'), 'Must include Interfaces section');
    assert.ok(content.includes('docs/final/final-documentation.md'), 'Must specify Consumes docs/final/final-documentation.md');
    assert.ok(content.includes('.insightify/knowledge/*.md'), 'Must specify Consumes .insightify/knowledge/*.md');
    assert.ok(content.includes('.insightify/plan.md'), 'Must specify Consumes .insightify/plan.md');
    assert.ok(content.includes('index.html'), 'Must specify Produces index.html');
  });"""
text = re.sub(r"test\('builder SKILL\.md defines Stage 4, Interfaces \(Consumes/Produces\), instructions, and rendering rules', async \(\) => \{[\s\S]*?\}\);\s*test\('buildProductOverview", new_test + "\n\n  test('buildProductOverview", text)

with open('tests/build-templates.test.js', 'w') as f:
    f.write(text)
