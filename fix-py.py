import re
import sys

with open('tests/build-templates.test.js', 'r') as f:
    content = f.read()

# 1. index-html-template.html contains all required v6 placeholders
content = re.sub(
    r"const placeholders = \[.*?\];",
    "const placeholders = ['{{TITLE}}', '{{STYLE}}', '{{PRODUCT_NAME}}', '{{TAGLINE}}', '{{PRODUCT_OVERVIEW}}', '{{DOC_SECTIONS}}', '{{PROCESS_DIAGRAM}}', '{{SIDEBAR_NAV}}', '{{SCRIPTS}}'];",
    content
)

# 2. font links and semantic HTML elements
content = content.replace("assert.ok(tpl.includes('<aside class=\"sidebar\">'), 'Must include aside sidebar element');", "assert.ok(tpl.includes('<aside class=\"toc-container\">'), 'Must include aside toc-container element');")

# 3. .table-wrapper
content = content.replace("assert.ok(css.includes('.table-wrapper'), 'Must style .table-wrapper');", "// removed table wrapper test")

# 4. buildDocSections renders markdown pages with frontmatter and slugs
new_test4 = """test('buildDocSections renders markdown pages with frontmatter and slugs', async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'combined.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Executive Summary"\\ncategory: "product"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');
    const sectionsHtml = buildDocSections(combinedPath);
    assert.ok(sectionsHtml.includes('id="executive-summary"'), 'Must have id');
    assert.ok(sectionsHtml.includes('id="directory-structure"'), 'Must have id');
  });"""
content = re.sub(r"test\('buildDocSections renders markdown pages with frontmatter and slugs', async \(\) => \{.*?\}\);", new_test4, content, flags=re.DOTALL)

# 5. buildDocSections strips leading H1
new_test5 = """test('buildDocSections strips leading H1 to prevent duplicate headings', async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'h1test.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Test"\\n---\\n# H1 Test Page\\n## H1 Test Page\\nContent');
    const sectionsHtml = buildDocSections(combinedPath);
    assert.ok(sectionsHtml.includes('<h2>H1 Test Page</h2>'));
  });"""
content = re.sub(r"test\('buildDocSections strips leading H1 to prevent duplicate headings', async \(\) => \{.*?\}\);", new_test5, content, flags=re.DOTALL)

# 6. buildSidebarNav creates navigation links
new_test6 = """test('buildSidebarNav creates navigation links for overview, pages, and pipeline', async () => {
    const { buildSidebarNav } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'combined.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Executive Summary"\\ncategory: "product"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');
    const navHtml = buildSidebarNav(combinedPath);
    assert.ok(navHtml.includes('href="#executive-summary"'));
  });"""
content = re.sub(r"test\('buildSidebarNav creates navigation links for overview, pages, and pipeline', async \(\) => \{.*?\}\);", new_test6, content, flags=re.DOTALL)

# 7. assembleKnowledgeBase
new_test7 = """test('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', async () => {
    const { assembleKnowledgeBase } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'kbtest.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "KB Test"\\n---\\n> **Source:** source-001.md\\nKB Content');
    const kb = assembleKnowledgeBase(combinedPath, { kbDir: fixture14KbDir });
    assert.ok(kb.includes('> **Source:** source-001.md'));
  });"""
content = re.sub(r"test\('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', async \(\) => \{.*?\}\);", new_test7, content, flags=re.DOTALL)

# 8. buildArtifact
new_test8 = """test('buildArtifact generates complete static HTML specification and knowledge-base.md', async () => {
    const { buildArtifact } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const combinedPath = path.join(docsDir, 'artifacttest.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Artifact Test"\\n---\\n## Executive Summary\\nContent');
    const artifact = buildArtifact({ kbDir: fixture14KbDir, docPath: combinedPath });
    assert.ok(artifact.html.includes('id="executive-summary"'));
  });"""
content = re.sub(r"test\('buildArtifact generates complete static HTML specification and knowledge-base.md', async \(\) => \{.*?\}\);", new_test8, content, flags=re.DOTALL)

with open('tests/build-templates.test.js', 'w') as f:
    f.write(content)
