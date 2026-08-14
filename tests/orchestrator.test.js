const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Orchestrator Skill', () => {
  test('insightify.md exists and contains pipeline stages', () => {
    const orchestratorPath = path.join(__dirname, '../skills/insightify.md');
    assert.strictEqual(fs.existsSync(orchestratorPath), true, 'skills/insightify.md must exist');

    const content = fs.readFileSync(orchestratorPath, 'utf8');
    assert.strictEqual(content.includes('name: insightify'), true);
    assert.strictEqual(content.includes('Stage 1 (Ingest):'), true);
    assert.strictEqual(content.includes('Stage 2 (Extract):'), true);
    assert.strictEqual(content.includes('Stage 3 (Plan):'), true);
    assert.strictEqual(content.includes('Stage 4 (Write):'), true);
    assert.strictEqual(content.includes('Stage 5 (Review):'), true);
    assert.strictEqual(content.includes('Stage 6 (Build):'), true);
    assert.strictEqual(content.includes('.insightify/'), true);
  });
});
