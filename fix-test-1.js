const fs = require('fs');
let content = fs.readFileSync('tests/build-templates.test.js', 'utf8');

const regex = /test\('buildDocSections renders markdown pages with frontmatter and slugs', async \(\) => \{[\s\S]*?\}\);/;
const newTest = `test('buildDocSections renders markdown pages with frontmatter and slugs', async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const combinedPath = path.join(docsDir, 'combined.md');
    fs.writeFileSync(combinedPath, '---\\ntitle: "Combined"\\n---\\n## Executive Summary\\nSummary content here.\\n## Directory Structure\\nDirectory content here.');

    const sectionsHtml = buildDocSections(combinedPath);
    assert.ok(sectionsHtml.includes('id="executive-summary"'), 'Must have executive summary id');
    assert.ok(sectionsHtml.includes('id="directory-structure"'), 'Must have directory structure id');
    assert.ok(sectionsHtml.includes('class="doc-section"'), 'Must use doc-section class');
    assert.ok(sectionsHtml.includes('Summary content here.'), 'Must include content');
  });`;

content = content.replace(regex, newTest);
fs.writeFileSync('tests/build-templates.test.js', content);
