const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Plan Template', () => {
  test('plan-template.md contains required structure sections', () => {
    const template = fs.readFileSync(path.join(__dirname, '../skills/plan/templates/plan-template.md'), 'utf8');
    assert.strictEqual(template.includes('## Page Dependency Graph'), true);
    assert.strictEqual(template.includes('## Writing Order'), true);
    assert.strictEqual(template.includes('status: "approved"'), true);
  });
});
