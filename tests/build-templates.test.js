const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Build Templates (HTML Output)', () => {
  test('index-html-template.html contains required placeholders', () => {
    const tpl = fs.readFileSync(path.join(__dirname, '../skills/builder/templates/index-html-template.html'), 'utf8');
    assert.ok(tpl.includes('{{TITLE}}'));
    assert.ok(tpl.includes('{{PRODUCT_NAME}}'));
    assert.ok(tpl.includes('{{TAGLINE}}'));
    assert.ok(tpl.includes('{{PRODUCT_OVERVIEW}}'));
    assert.ok(tpl.includes('{{DOC_PAGES}}'));
    assert.ok(tpl.includes('{{PROCESS_DIAGRAM}}'));
    assert.ok(tpl.includes('{{STYLE}}'));
    assert.ok(tpl.includes('{{COMPANY}}'));
    assert.ok(tpl.includes('{{LAST_UPDATED}}'));
  });

  test('index-html-template.html has no VitePress traces', () => {
    const tpl = fs.readFileSync(path.join(__dirname, '../skills/builder/templates/index-html-template.html'), 'utf8');
    assert.strictEqual(tpl.includes('vitepress'), false);
    assert.strictEqual(tpl.includes('defineConfig'), false);
    assert.strictEqual(tpl.includes('themeConfig'), false);
    assert.strictEqual(tpl.includes('layout: home'), false);
  });

  test('build-html.mjs exports required functions', async () => {
    const builder = await import('../skills/builder/templates/build-html.mjs');
    assert.ok(typeof builder.renderMarkdown === 'function');
    assert.ok(typeof builder.buildProductOverview === 'function');
    assert.ok(typeof builder.buildDocPages === 'function');
    assert.ok(typeof builder.buildProcessDiagram === 'function');
    assert.ok(typeof builder.assembleKnowledgeBase === 'function');
    assert.ok(typeof builder.render === 'function');
  });

  test('renderMarkdown converts basic markdown', async () => {
    const builder = await import('../skills/builder/templates/build-html.mjs');
    const md = '# Title\n\nParagraph with **bold** and `code`.\n\n## Subheading\n\n- Item 1\n- Item 2';
    const html = builder.renderMarkdown(md);
    assert.ok(html.includes('<h1>Title</h1>'));
    assert.ok(html.includes('<strong>bold</strong>'));
    assert.ok(html.includes('<code>code</code>'));
    assert.ok(html.includes('<h2>Subheading</h2>'));
    assert.ok(html.includes('<li>Item 1</li>'));
  });
});