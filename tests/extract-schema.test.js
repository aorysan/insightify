const { describe, test, before } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Extract Schema Reference (14 Categories)', () => {
  const schemaPath = path.join(__dirname, '../skills/planner/references/extraction-schema.md');
  let schemaDoc;

  before(() => {
    if (fs.existsSync(schemaPath)) {
      schemaDoc = fs.readFileSync(schemaPath, 'utf8');
    }
  });

  test('extraction-schema.md exists and defines all 14 required categories', () => {
    assert.strictEqual(fs.existsSync(schemaPath), true, 'Schema file must exist');

    const categories = [
      'product.md',
      'directory-structure.md',
      'data-models.md',
      'component-architecture.md',
      'state-management.md',
      'routing-structure.md',
      'ui-component-library.md',
      'api-patterns.md',
      'features.md',
      'cross-cutting.md',
      'terminology.md',
      'constraints.md',
      'workflows.md',
      'unanswered.md'
    ];

    categories.forEach(cat => {
      assert.strictEqual(schemaDoc.includes(cat), true, `Must include category: ${cat}`);
    });
  });

  test('extraction-schema.md specifies YAML frontmatter with confidence and source tracking', () => {
    assert.strictEqual(fs.existsSync(schemaPath), true, 'Schema file must exist');
    assert.ok(schemaDoc.includes('category:'));
    assert.ok(schemaDoc.includes('extracted_from'));
    assert.ok(schemaDoc.includes('confidence: "high" | "medium" | "low"'));
    assert.ok(schemaDoc.includes('extracted_at:'));
  });
});

