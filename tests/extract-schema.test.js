const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Extract Schema Reference', () => {
  test('extraction-schema.md defines all required categories', () => {
    const schemaDoc = fs.readFileSync(path.join(__dirname, '../skills/extract/references/extraction-schema.md'), 'utf8');
    const categories = ['product', 'features', 'terminology', 'api', 'workflows', 'constraints', 'unanswered'];
    categories.forEach(cat => {
      assert.strictEqual(schemaDoc.includes(cat), true);
    });
  });
});
