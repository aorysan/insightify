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
