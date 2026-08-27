const { describe, test, before } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Plan Template (14 Pages, 5 Waves)', () => {
  const templatePath = path.join(__dirname, '../skills/planner/templates/plan-template.md');
  const skillPath = path.join(__dirname, '../skills/planner/SKILL.md');

  let templateContent = '';
  let skillContent = '';

  before(() => {
    if (fs.existsSync(templatePath)) {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    }
    if (fs.existsSync(skillPath)) {
      skillContent = fs.readFileSync(skillPath, 'utf8');
    }
  });

  const EXPECTED_PAGES = [
    '1. Executive Summary',
    '2. Directory Structure',
    '3. Global Data Models',
    '4. Component Architecture',
    '5. State Management',
    '6. Routing & Layout Structure',
    '7. UI Component Library',
    '8. API Interaction Patterns',
    '9. Features & Business Logic',
    '10. Cross-Cutting Concerns',
    '11. Terminology & Glossary',
    '12. Constraints & Limitations',
    '13. Workflows & Procedures',
    '14. Appendix'
  ];

  test('plan-template.md exists and contains required frontmatter configuration', () => {
    assert.strictEqual(fs.existsSync(templatePath), true, 'plan-template.md must exist');
    assert.ok(templateContent.startsWith('---'), 'Must start with YAML frontmatter');
    assert.ok(templateContent.includes('total_pages: 14'), 'Must set total_pages to 14');
    assert.ok(templateContent.includes('doc_type: "frontend-technical-specification"'), 'Must define frontend-technical-specification doc_type');
    assert.ok(templateContent.includes('output_format: "artifact-html"'), 'Must specify artifact-html output_format');
    assert.ok(templateContent.includes('status: "approved"'), 'Must define status field');
  });

  test('plan-template.md defines all 14 planned pages with metadata and section breakdowns', () => {
    assert.strictEqual(fs.existsSync(templatePath), true, 'plan-template.md must exist');

    EXPECTED_PAGES.forEach(page => {
      assert.ok(templateContent.includes(`### ${page}`), `Must contain page heading: ### ${page}`);
    });

    // Check each page has Purpose, Audience, Sources, Dependencies, Priority
    const pageBlocks = templateContent.split(/### \d+\.\s+/).slice(1);
    assert.strictEqual(pageBlocks.length, 14, 'Must have 14 page specification blocks');

    pageBlocks.forEach((block, idx) => {
      assert.ok(block.includes('- **Purpose:**'), `Page ${idx + 1} must specify Purpose`);
      assert.ok(block.includes('- **Audience:**'), `Page ${idx + 1} must specify Audience`);
      assert.ok(block.includes('- **Sources:**'), `Page ${idx + 1} must specify Sources`);
      assert.ok(block.includes('- **Dependencies:**'), `Page ${idx + 1} must specify Dependencies`);
      assert.ok(block.includes('- **Priority:**'), `Page ${idx + 1} must specify Priority`);
    });
  });

  test('plan-template.md defines 5-wave dependency graph with correct page allocations', () => {
    assert.strictEqual(fs.existsSync(templatePath), true, 'plan-template.md must exist');

    assert.ok(templateContent.includes('WAVE 1 (Parallel - No Dependencies):'), 'Must define Wave 1');
    assert.ok(templateContent.includes('WAVE 2 (Depends on Wave 1):'), 'Must define Wave 2');
    assert.ok(templateContent.includes('WAVE 3 (Depends on Wave 2):'), 'Must define Wave 3');
    assert.ok(templateContent.includes('WAVE 4 (Depends on Waves 2-3):'), 'Must define Wave 4');
    assert.ok(templateContent.includes('WAVE 5 (Depends on All):'), 'Must define Wave 5');

    // Check Wave 1 pages (1, 2, 3, 11, 12)
    const wave1Section = templateContent.slice(
      templateContent.indexOf('WAVE 1'),
      templateContent.indexOf('WAVE 2')
    );
    assert.ok(wave1Section.includes('1. Executive Summary'));
    assert.ok(wave1Section.includes('2. Directory Structure'));
    assert.ok(wave1Section.includes('3. Global Data Models'));
    assert.ok(wave1Section.includes('11. Terminology & Glossary'));
    assert.ok(wave1Section.includes('12. Constraints & Limitations'));

    // Check Wave 2 pages (4, 5, 7)
    const wave2Section = templateContent.slice(
      templateContent.indexOf('WAVE 2'),
      templateContent.indexOf('WAVE 3')
    );
    assert.ok(wave2Section.includes('4. Component Architecture'));
    assert.ok(wave2Section.includes('5. State Management'));
    assert.ok(wave2Section.includes('7. UI Component Library'));

    // Check Wave 3 pages (6, 8)
    const wave3Section = templateContent.slice(
      templateContent.indexOf('WAVE 3'),
      templateContent.indexOf('WAVE 4')
    );
    assert.ok(wave3Section.includes('6. Routing & Layout Structure'));
    assert.ok(wave3Section.includes('8. API Interaction Patterns'));

    // Check Wave 4 pages (9, 10, 13)
    const wave4Section = templateContent.slice(
      templateContent.indexOf('WAVE 4'),
      templateContent.indexOf('WAVE 5')
    );
    assert.ok(wave4Section.includes('9. Features & Business Logic'));
    assert.ok(wave4Section.includes('10. Cross-Cutting Concerns'));
    assert.ok(wave4Section.includes('13. Workflows & Procedures'));

    // Check Wave 5 page (14)
    const wave5Section = templateContent.slice(
      templateContent.indexOf('WAVE 5'),
      templateContent.indexOf('## Writing Order')
    );
    assert.ok(wave5Section.includes('14. Appendix'));
  });

  const EXPECTED_WRITING_ORDER = [
    '1. Executive Summary',
    '2. Directory Structure',
    '3. Global Data Models',
    '11. Terminology & Glossary',
    '12. Constraints & Limitations',
    '4. Component Architecture',
    '5. State Management',
    '7. UI Component Library',
    '6. Routing & Layout Structure',
    '8. API Interaction Patterns',
    '9. Features & Business Logic',
    '10. Cross-Cutting Concerns',
    '13. Workflows & Procedures',
    '14. Appendix'
  ];

  test('plan-template.md specifies sequential writing order and approval checklist', () => {
    assert.strictEqual(fs.existsSync(templatePath), true, 'plan-template.md must exist');

    const writingOrderStartIndex = templateContent.indexOf('## Writing Order (Sequential for Human Review)');
    const approvalChecklistIndex = templateContent.indexOf('## Approval Checklist');

    assert.ok(writingOrderStartIndex !== -1, 'Writing Order section must exist');
    assert.ok(approvalChecklistIndex !== -1, 'Approval Checklist section must exist');
    assert.ok(writingOrderStartIndex < approvalChecklistIndex, 'Writing Order must precede Approval Checklist');

    const writingOrderSection = templateContent.slice(writingOrderStartIndex, approvalChecklistIndex);

    EXPECTED_WRITING_ORDER.forEach(page => {
      assert.ok(writingOrderSection.includes(page), `Writing order section must list: ${page}`);
    });

    const checklistSection = templateContent.slice(approvalChecklistIndex);
    assert.ok(checklistSection.includes('- [ ] All 14 pages planned with clear purpose and sources'));
    assert.ok(checklistSection.includes('- [ ] Dependency graph is acyclic and max 5 waves'));
    assert.ok(checklistSection.includes('- [ ] Priority distribution: 7 high, 3 medium, 4 low'));
  });

  test('planner skill defines archetype-aware categories, 5 waves, and user approval workflow in SKILL.md', () => {
    assert.strictEqual(fs.existsSync(skillPath), true, 'planner SKILL.md must exist');

    const expectedKnowledgeCategories = [
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

    expectedKnowledgeCategories.forEach(cat => {
      assert.ok(skillContent.includes(cat), `SKILL.md must list category: ${cat}`);
    });

    assert.ok(skillContent.includes('detected archetype'), 'SKILL.md must derive category set from detected archetype');
    assert.ok(skillContent.includes('max 5 waves'), 'SKILL.md must enforce max 5 waves');
    assert.ok(/Plan Template Output.*5 Waves/.test(skillContent), 'SKILL.md must have 5 waves table');
  });
  test('planner skill enforces parallel extraction with a maximum concurrency of 5', () => {
    assert.strictEqual(fs.existsSync(skillPath), true, 'planner SKILL.md must exist');
    assert.ok(skillContent.includes('parallel'), 'SKILL.md must specify parallel extraction');
    assert.ok(skillContent.includes('concurrency limit of 5'), 'SKILL.md must specify a max concurrency limit of 5');
  });
});
