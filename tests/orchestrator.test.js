const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Orchestrator Skill', () => {
  test('insightify.md exists and contains pipeline stages', () => {
    const orchestratorPath = path.join(__dirname, '../skills/insightify/SKILL.md');
    assert.strictEqual(fs.existsSync(orchestratorPath), true, 'skills/insightify/SKILL.md must exist');

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

  test('insightify.md includes CLI argument parsing, progress indicators, and error resilience', () => {
    const orchestratorPath = path.join(__dirname, '../skills/insightify/SKILL.md');
    const content = fs.readFileSync(orchestratorPath, 'utf8');

    // CLI argument parsing
    assert.strictEqual(content.includes('CLI Argument Parsing & Invocation'), true);
    assert.strictEqual(content.includes('--dry-run'), true);
    assert.strictEqual(content.includes('--resume'), true);
    assert.strictEqual(content.includes('--config'), true);
    assert.strictEqual(content.includes('--project'), true);

    // Progress indicators and error handling
    assert.strictEqual(content.includes('Progress Indicator:'), true);
    assert.strictEqual(content.includes('Error Handling:'), true);
    assert.strictEqual(content.includes('unanswered.md'), true);
    assert.strictEqual(content.includes('Detect missing `[OUT_DIR]/.insightify/` directory on resume'), true);
  });
});
