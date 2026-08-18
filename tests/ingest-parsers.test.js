const { describe, test } = require('node:test');
const assert = require('assert');
const { parseHtml } = require('../skills/ingest/parsers/html-parser');
const { parseCode } = require('../skills/ingest/parsers/code-parser');
const { parsePdf } = require('../skills/ingest/parsers/pdf-parser');

describe('Ingest Parsers', () => {
  test('html-parser extracts main content and ignores nav/footer', () => {
    const html = `<html><body><nav>Menu</nav><main><h1>Title</h1><p>Hello world</p></main><footer>Footer</footer></body></html>`;
    const md = parseHtml(html);
    assert.strictEqual(md.includes('Title'), true);
    assert.strictEqual(md.includes('Hello world'), true);
    assert.strictEqual(md.includes('Menu'), false);
  });

  test('html-parser preserves heading hierarchy', () => {
    const html = '<html><body><main><h1>Title</h1><h2>Section</h2><p>Content</p><h3>Subsection</h3><p>More</p></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('# Title'));
    assert.ok(md.includes('## Section'));
    assert.ok(md.includes('### Subsection'));
    assert.ok(md.includes('Content'));
    assert.ok(md.includes('More'));
  });

  test('html-parser converts unordered lists', () => {
    const html = '<html><body><main><ul><li>First</li><li>Second</li><li>Third</li></ul></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('- First'));
    assert.ok(md.includes('- Second'));
    assert.ok(md.includes('- Third'));
  });

  test('html-parser converts ordered lists', () => {
    const html = '<html><body><main><ol><li>Step one</li><li>Step two</li></ol></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('1. Step one'));
    assert.ok(md.includes('2. Step two'));
  });

  test('html-parser converts nested lists', () => {
    const html = '<html><body><main><ul><li>Parent<ul><li>Child</li></ul></li></ul></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('- Parent'));
    assert.ok(md.includes('  - Child'));
  });

  test('html-parser converts fenced code blocks with language', () => {
    const html = '<html><body><main><pre><code class="language-js">const x = 1;</code></pre></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('```js'));
    assert.ok(md.includes('const x = 1;'));
    assert.ok(md.includes('```'));
  });

  test('html-parser converts inline code', () => {
    const html = '<html><body><main><p>Use the <code>npm install</code> command</p></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('`npm install`'));
  });

  test('html-parser converts links', () => {
    const html = '<html><body><main><p>Visit <a href="https://example.com">Example</a> for more.</p></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('[Example](https://example.com)'));
  });

  test('html-parser converts bold and italic', () => {
    const html = '<html><body><main><p>This is <strong>bold</strong> and <em>italic</em> text.</p></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('**bold**'));
    assert.ok(md.includes('*italic*'));
  });

  test('html-parser converts images', () => {
    const html = '<html><body><main><img src="photo.jpg" alt="A photo" /></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('![A photo](photo.jpg)'));
  });

  test('html-parser converts tables', () => {
    const html = '<html><body><main><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>1</td></tr></tbody></table></main></body></html>';
    const md = parseHtml(html);
    assert.ok(md.includes('| Name | Value |'));
    assert.ok(md.includes('| --- | --- |'));
    assert.ok(md.includes('| A | 1 |'));
  });

  test('html-parser handles empty elements gracefully', () => {
    const html = '<html><body><main><p></p><h2></h2><ul></ul></main></body></html>';
    const md = parseHtml(html);
    assert.strictEqual(typeof md, 'string');
  });

  test('html-parser handles mixed content', () => {
    const html = `<html><body><main>
      <h1>API Guide</h1>
      <p>Welcome to the <strong>API</strong>.</p>
      <h2>Installation</h2>
      <pre><code class="language-bash">npm install sdk</code></pre>
      <ul><li>Fast</li><li>Reliable</li></ul>
    </main></body></html>`;
    const md = parseHtml(html);
    assert.ok(md.includes('# API Guide'));
    assert.ok(md.includes('**API**'));
    assert.ok(md.includes('## Installation'));
    assert.ok(md.includes('```bash'));
    assert.ok(md.includes('npm install sdk'));
    assert.ok(md.includes('- Fast'));
    assert.ok(md.includes('- Reliable'));
  });

  test('code-parser extracts docstrings and JSDoc', () => {
    const code = `
      /**
       * Calculate total price
       * @param {number} amount
       */
      function calc(amount) { return amount; }
    `;
    const extracted = parseCode(code, 'js');
    assert.strictEqual(extracted.includes('Calculate total price'), true);
  });

  test('code-parser extracts python docstrings', () => {
    const code = `
def add(a, b):
    """Add two numbers together."""
    return a + b
`;
    const extracted = parseCode(code, 'py');
    assert.strictEqual(extracted.includes('Add two numbers together.'), true);
  });

  test('code-parser falls back to codeString if no comments found', () => {
    const code = `const x = 10;`;
    const extracted = parseCode(code, 'js');
    assert.strictEqual(extracted, 'const x = 10;');
  });

  test('pdf-parser exports parsePdf function', () => {
    assert.strictEqual(typeof parsePdf, 'function');
  });
});
