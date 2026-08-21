const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Extract Schema Reference (14 Categories)', () => {
  const schemaPath = path.join(__dirname, '../skills/planner/references/extraction-schema.md');
  const schemaDoc = fs.readFileSync(schemaPath, 'utf8');

  const EXPECTED_CATEGORIES = [
    'product.md',
    'directory-structure.md',
    'data-models.md',
    'component-architecture.md',
    'state-management.md',
    'routing-structure.md',
    'ui-component-library.md',
    'api-patterns.md',
    'features.md',
    'terminology.md',
    'workflows.md',
    'constraints.md',
    'unanswered.md',
    'cross-cutting.md'
  ];

  test('extraction-schema.md exists and defines exactly 14 required categories', () => {
    assert.strictEqual(fs.existsSync(schemaPath), true, 'Schema file must exist');

    EXPECTED_CATEGORIES.forEach(cat => {
      assert.strictEqual(schemaDoc.includes(cat), true, `Must include category file: ${cat}`);
    });

    // Verify exactly 14 core categories are listed under Core Categories
    const coreMatch = schemaDoc.match(/## Core Categories[\s\S]*?(?=---|$)/);
    assert.ok(coreMatch, 'Core Categories section must be present');
    const coreSection = coreMatch[0];
    const categoryEntries = coreSection.match(/\d+\.\s+`([^`]+)`/g);
    assert.strictEqual(categoryEntries.length, 14, 'Must have exactly 14 numbered categories');
  });

  test('extraction-schema.md specifies YAML frontmatter with required fields and types', () => {
    assert.ok(schemaDoc.includes('## YAML Frontmatter'), 'Must have YAML Frontmatter section');
    assert.ok(schemaDoc.includes('category:'), 'Must include category field');
    assert.ok(schemaDoc.includes('extracted_from:'), 'Must include extracted_from field');
    assert.ok(schemaDoc.includes('confidence:'), 'Must include confidence field');
    assert.ok(schemaDoc.includes('extracted_at:'), 'Must include extracted_at field');
    assert.ok(schemaDoc.includes('tags:'), 'Must include tags field');

    // Check confidence levels enum
    assert.ok(
      schemaDoc.includes('confidence: "high" | "medium" | "low"'),
      'Must specify valid confidence enum values'
    );

    // Check field definitions table
    assert.ok(schemaDoc.includes('### Field Definitions'), 'Must include Field Definitions table');
    assert.ok(schemaDoc.includes('`category`') && schemaDoc.includes('✅'), 'category must be required');
    assert.ok(schemaDoc.includes('`extracted_from`') && schemaDoc.includes('✅'), 'extracted_from must be required');
    assert.ok(schemaDoc.includes('`confidence`') && schemaDoc.includes('✅'), 'confidence must be required');
    assert.ok(schemaDoc.includes('`extracted_at`') && schemaDoc.includes('✅'), 'extracted_at must be required');
    assert.ok(schemaDoc.includes('`tags`') && schemaDoc.includes('❌'), 'tags must be optional');
  });

  test('extraction-schema.md specifies category-specific guidelines with source signals and extract targets for all 14 categories', () => {
    EXPECTED_CATEGORIES.forEach(cat => {
      const escapedCat = cat.replace('.', '\\.');
      const sectionRegex = new RegExp(`### \\d+\\.\\s+\`${escapedCat}\``);
      assert.ok(
        sectionRegex.test(schemaDoc),
        `Must have dedicated subsection for ${cat}`
      );
    });
  });

  test('extraction-schema.md specifies frontend technical specifications details', () => {
    // Data Models
    assert.ok(schemaDoc.includes('BaseEntity'), 'Must specify BaseEntity in data models');
    assert.ok(schemaDoc.includes('ApiResponse'), 'Must specify ApiResponse in data models');
    assert.ok(schemaDoc.includes('PaginatedResponse'), 'Must specify PaginatedResponse in data models');
    assert.ok(schemaDoc.includes('User'), 'Must specify User entity in data models');

    // Component Architecture
    assert.ok(schemaDoc.includes('PublicLayout'), 'Must specify PublicLayout in components');
    assert.ok(schemaDoc.includes('AuthLayout'), 'Must specify AuthLayout in components');
    assert.ok(schemaDoc.includes('ProtectedLayout'), 'Must specify ProtectedLayout in components');

    // State Management
    assert.ok(schemaDoc.includes('useAuthStore') || schemaDoc.includes('stores/'), 'Must specify stores in state management');
    assert.ok(schemaDoc.includes('selectors') || schemaDoc.includes('Selectors:'), 'Must specify selectors in state management');
    assert.ok(schemaDoc.includes('persistence') || schemaDoc.includes('Persistence:'), 'Must specify persistence in state management');

    // Routing Structure
    assert.ok(schemaDoc.includes('PublicRoute'), 'Must specify PublicRoute guard');
    assert.ok(schemaDoc.includes('PrivateRoute'), 'Must specify PrivateRoute guard');

    // UI Component Library
    assert.ok(schemaDoc.includes('Button'), 'Must specify Button primitive');
    assert.ok(schemaDoc.includes('Input'), 'Must specify Input primitive');
    assert.ok(schemaDoc.includes('Modal'), 'Must specify Modal primitive');

    // API Patterns
    assert.ok(schemaDoc.includes('useFetchData'), 'Must specify useFetchData hook');
    assert.ok(schemaDoc.includes('useMutation'), 'Must specify useMutation hook');
    assert.ok(schemaDoc.includes('interceptors'), 'Must specify interceptors in API patterns');

    // Cross-Cutting
    assert.ok(schemaDoc.includes('Theming') || schemaDoc.includes('Theme'), 'Must specify theming in cross-cutting');
    assert.ok(schemaDoc.includes('I18n') || schemaDoc.includes('i18n'), 'Must specify i18n in cross-cutting');
    assert.ok(schemaDoc.includes('Feature flags') || schemaDoc.includes('feature flags'), 'Must specify feature flags in cross-cutting');
  });

  test('extraction-schema.md defines source citation format and traceability', () => {
    assert.ok(schemaDoc.includes('Source Citations & Fact Traceability'), 'Must define source citations section');
    assert.ok(schemaDoc.includes('> **Source:** source-'), 'Must provide standard citation pattern');
  });

  test('extraction-schema.md specifies conflict resolution rules', () => {
    assert.ok(schemaDoc.includes('## Conflict Handling'), 'Must have Conflict Handling section');
    assert.ok(schemaDoc.includes('Contradictory facts'), 'Must handle contradictory facts');
    assert.ok(schemaDoc.includes('unanswered.md'), 'Must reference unanswered.md for conflicts and gaps');
  });

  test('extraction-schema.md defines confidence scoring criteria', () => {
    assert.ok(schemaDoc.includes('## Confidence Scoring'), 'Must have Confidence Scoring section');
    assert.ok(schemaDoc.includes('`high`'), 'Must define high confidence criteria');
    assert.ok(schemaDoc.includes('`medium`'), 'Must define medium confidence criteria');
    assert.ok(schemaDoc.includes('`low`'), 'Must define low confidence criteria');
  });

  test('extraction-schema.md defines minimum viable output requirements', () => {
    assert.ok(schemaDoc.includes('## Minimum Viable Output'), 'Must have Minimum Viable Output section');
    assert.ok(schemaDoc.includes('`product.md`'), 'product.md must be part of minimum viable output');
    assert.ok(schemaDoc.includes('`directory-structure.md`'), 'directory-structure.md must be part of minimum viable output');
    assert.ok(schemaDoc.includes('`unanswered.md`'), 'unanswered.md must be part of minimum viable output');
  });
});
