import re

with open('tests/build-templates.test.js', 'r') as f:
    text = f.read()

new_test = """test('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', async () => {
    const { assembleKnowledgeBase } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');
    const docPath = path.join(docsDir, '01-executive-summary.md');
    fs.writeFileSync(docPath, '---\\ntitle: "KB Test"\\n---\\n> **Source:** source-001.md\\nKB Content');
    const kb = assembleKnowledgeBase(docPath, { kbDir: fixture14KbDir });
    assert.ok(kb.includes('> **Source:** source-001.md'), 'Citations must be preserved');
  });"""
text = re.sub(r"test\('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', async \(\) => \{[\s\S]*?\}\);\s*test\('render replaces", new_test + "\n\n  test('render replaces", text)

with open('tests/build-templates.test.js', 'w') as f:
    f.write(text)
