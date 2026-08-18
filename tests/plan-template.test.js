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

  test('plan.md defines interactive revision loop and approval flow', () => {
    const planSkill = fs.readFileSync(path.join(__dirname, '../skills/plan/SKILL.md'), 'utf8');
    assert.strictEqual(planSkill.includes('name: insightify-plan'), true);
    assert.strictEqual(planSkill.includes('Approve plan? [Y/n/revise]'), true);
    assert.strictEqual(planSkill.includes('Max 3 revision cycles'), true);
    assert.strictEqual(planSkill.includes('📝 Documentation Plan: [Project Name]'), true);
    assert.strictEqual(planSkill.includes('status: approved'), true);
  });
});
