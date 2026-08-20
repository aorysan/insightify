const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Review Criteria', () => {
  test('review-criteria.md covers the 5 dimensions', () => {
    const criteria = fs.readFileSync(path.join(__dirname, '../skills/reviewer/references/review-criteria.md'), 'utf8');
    const dimensions = ['Accuracy', 'Completeness', 'Consistency', 'Structure', 'Usability'];
    dimensions.forEach(dim => {
      assert.strictEqual(criteria.includes(dim), true);
    });
  });
});
