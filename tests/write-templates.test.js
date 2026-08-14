const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Writer Templates', () => {
  test('templates exist and contain expected frontmatter placeholders', () => {
    const guide = fs.readFileSync(path.join(__dirname, '../skills/write/templates/guide-template.md'), 'utf8');
    const api = fs.readFileSync(path.join(__dirname, '../skills/write/templates/api-template.md'), 'utf8');
    const faq = fs.readFileSync(path.join(__dirname, '../skills/write/templates/faq-template.md'), 'utf8');

    assert.strictEqual(guide.includes('title:'), true);
    assert.strictEqual(api.includes('title:'), true);
    assert.strictEqual(faq.includes('title:'), true);
  });
});
