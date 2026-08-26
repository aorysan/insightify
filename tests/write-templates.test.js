const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Writer Templates (14 Templates)', () => {
  const templateDir = path.join(__dirname, '../skills/writer/templates');
  const expectedTemplates = [
    'executive-summary-template.md',
    'directory-structure-template.md',
    'data-models-template.md',
    'component-architecture-template.md',
    'state-management-template.md',
    'routing-structure-template.md',
    'ui-component-library-template.md',
    'api-patterns-template.md',
    'features-template.md',
    'cross-cutting-template.md',
    'terminology-template.md',
    'constraints-template.md',
    'workflows-template.md',
    'appendix-template.md'
  ];

  test('templates directory contains exactly the 14 expected templates', () => {
    const files = fs.readdirSync(templateDir).filter(f => f.endsWith('.md'));
    assert.strictEqual(files.length, 14, `Expected 14 templates, found ${files.length}: ${files.join(', ')}`);
    expectedTemplates.forEach(t => {
      assert.ok(files.includes(t), `Template ${t} should be present in ${templateDir}`);
    });
  });

  function parseAndValidateFrontmatter(content, filename) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    assert.ok(match, `${filename} must start with valid YAML frontmatter enclosed in --- delimiters`);
    const yamlBlock = match[1];

    // Validate title field with strict multiline regex
    const titleMatch = yamlBlock.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    assert.ok(titleMatch && titleMatch[1].trim().length > 0, `${filename} must define a non-empty 'title:' in YAML frontmatter`);

    // Validate description field with strict multiline regex
    const descMatch = yamlBlock.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    assert.ok(descMatch && descMatch[1].trim().length > 0, `${filename} must define a non-empty 'description:' in YAML frontmatter`);

    // Validate audience field with strict multiline regex
    const audienceMatch = yamlBlock.match(/^audience:\s*["']?(.+?)["']?\s*$/m);
    assert.ok(audienceMatch && audienceMatch[1].trim().length > 0, `${filename} must define a non-empty 'audience:' in YAML frontmatter`);

    // Validate sources list in YAML frontmatter
    const sourcesMatch = yamlBlock.match(/^sources:\s*\r?\n((?:\s*-\s*.+\r?\n?)+)/m);
    assert.ok(sourcesMatch, `${filename} must define a 'sources:' list in YAML frontmatter`);
    const sources = sourcesMatch[1].split(/\r?\n/).map(s => s.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
    assert.ok(sources.length > 0, `${filename} must list at least one source in YAML frontmatter`);

    return {
      title: titleMatch[1].trim(),
      description: descMatch[1].trim(),
      audience: audienceMatch[1].trim(),
      sources
    };
  }

  expectedTemplates.forEach(filename => {
    test(`template ${filename} exists and has valid frontmatter & structure`, () => {
      const filePath = path.join(templateDir, filename);
      assert.strictEqual(fs.existsSync(filePath), true, `${filename} must exist`);
      const content = fs.readFileSync(filePath, 'utf8');

      // Strict YAML Frontmatter validation
      const frontmatter = parseAndValidateFrontmatter(content, filename);
      assert.ok(frontmatter.title, `${filename} parsed frontmatter title`);
      assert.ok(frontmatter.description, `${filename} parsed frontmatter description`);
      assert.ok(frontmatter.audience, `${filename} parsed frontmatter audience`);
      assert.ok(frontmatter.sources.length > 0, `${filename} parsed frontmatter sources list`);

      // Content structure validation
      assert.ok(content.includes('# '), `${filename} must have an H1 title`);
      assert.ok(content.includes('## '), `${filename} must have H2 section headers`);
      assert.ok(content.includes('> **Source:**'), `${filename} must contain blockquote source citations`);
    });
  });

  test('executive-summary-template contains vision, tech stack, key features, and architecture highlights', () => {
    const content = fs.readFileSync(path.join(templateDir, 'executive-summary-template.md'), 'utf8');
    assert.ok(content.includes('Project Vision & Value Proposition'), 'Must contain vision section');
    assert.ok(content.includes('Tech Stack Summary'), 'Must contain tech stack summary');
    assert.ok(content.includes('Key Features at a Glance'), 'Must contain key features table');
    assert.ok(content.includes('Architecture Highlights'), 'Must contain architecture highlights');
  });

  test('directory-structure-template contains tree, module boundary rules, and import conventions', () => {
    const content = fs.readFileSync(path.join(templateDir, 'directory-structure-template.md'), 'utf8');
    assert.ok(content.includes('<details') && content.includes('<summary>'), 'Must contain collapsible details/summary tree');
    assert.ok(content.includes('Module Boundary Rules'), 'Must contain module boundary rules table');
    assert.ok(content.includes('Import Path Conventions'), 'Must contain import path conventions code block');
  });

  test('data-models-template contains TypeScript interfaces and Mermaid class diagram', () => {
    const content = fs.readFileSync(path.join(templateDir, 'data-models-template.md'), 'utf8');
    assert.ok(content.includes('interface BaseEntity'), 'Must define BaseEntity');
    assert.ok(content.includes('interface ApiResponse'), 'Must define ApiResponse');
    assert.ok(content.includes('interface PaginatedResponse'), 'Must define PaginatedResponse');
    assert.ok(content.includes('classDiagram'), 'Must contain Mermaid class diagram');
  });

  test('component-architecture-template contains layouts, shell components, and composition tree', () => {
    const content = fs.readFileSync(path.join(templateDir, 'component-architecture-template.md'), 'utf8');
    assert.ok(content.includes('PublicLayout'), 'Must define PublicLayout');
    assert.ok(content.includes('AuthLayout'), 'Must define AuthLayout');
    assert.ok(content.includes('ProtectedLayout'), 'Must define ProtectedLayout');
    assert.ok(content.includes('Component Composition Tree'), 'Must contain component composition tree');
    assert.ok(content.includes('graph TD') || content.includes('flowchart TD'), 'Must contain Mermaid tree diagram');
  });

  test('state-management-template contains Zustand stores, flow diagram, and persistence', () => {
    const content = fs.readFileSync(path.join(templateDir, 'state-management-template.md'), 'utf8');
    assert.ok(content.includes('useAuthStore'), 'Must define useAuthStore');
    assert.ok(content.includes('useAppStore'), 'Must define useAppStore');
    assert.ok(content.includes('State Flow Diagram'), 'Must contain state flow diagram');
    assert.ok(content.includes('Persistence Strategy'), 'Must define persistence strategy');
  });

  test('routing-structure-template contains route tree, guards, lazy loading, and metadata', () => {
    const content = fs.readFileSync(path.join(templateDir, 'routing-structure-template.md'), 'utf8');
    assert.ok(content.includes('PublicRoute'), 'Must define PublicRoute guard');
    assert.ok(content.includes('PrivateRoute'), 'Must define PrivateRoute guard');
    assert.ok(content.includes('RoleRoute'), 'Must define RoleRoute guard');
    assert.ok(content.includes('LazyPage'), 'Must define lazy page wrapper');
    assert.ok(content.includes('routeMeta') || content.includes('RouteMeta'), 'Must define route metadata');
  });

  test('ui-component-library-template contains component registry, design tokens, and accessibility', () => {
    const content = fs.readFileSync(path.join(templateDir, 'ui-component-library-template.md'), 'utf8');
    assert.ok(content.includes('Button'), 'Must specify Button component');
    assert.ok(content.includes('Input'), 'Must specify Input component');
    assert.ok(content.includes('Modal'), 'Must specify Modal component');
    assert.ok(content.includes('Component Registry Table'), 'Must contain component registry table');
    assert.ok(content.includes('Design Token References'), 'Must contain design tokens');
    assert.ok(content.includes('Accessibility Checklist'), 'Must contain accessibility checklist');
  });

  test('api-patterns-template contains apiClient, custom hooks, and error handling flow', () => {
    const content = fs.readFileSync(path.join(templateDir, 'api-patterns-template.md'), 'utf8');
    assert.ok(content.includes('apiClient'), 'Must define apiClient');
    assert.ok(content.includes('useFetchData'), 'Must define useFetchData hook');
    assert.ok(content.includes('useMutation'), 'Must define useMutation hook');
    assert.ok(content.includes('useOptimisticUpdate'), 'Must define optimistic update pattern');
    assert.ok(content.includes('Error Handling Flow'), 'Must contain error handling flow diagram');
  });

  test('features-template contains standardized placeholder catalog, Gherkin stories, and technical mapping', () => {
    const content = fs.readFileSync(path.join(templateDir, 'features-template.md'), 'utf8');
    assert.ok(content.includes('Feature Catalog'), 'Must contain feature catalog table');
    assert.ok(content.includes('<Feature 1 Name>'), 'Must use standardized placeholder syntax for features');
    assert.ok(content.includes('Feature:'), 'Must contain Gherkin Feature definition');
    assert.ok(content.includes('Scenario:'), 'Must contain Gherkin Scenario definition');
    assert.ok(content.includes('Acceptance Criteria'), 'Must contain acceptance criteria table');
    assert.ok(content.includes('Technical Mapping'), 'Must contain technical mapping table');
  });

  test('cross-cutting-template contains provider tree, theming, i18n, error boundary, logger, and feature flags', () => {
    const content = fs.readFileSync(path.join(templateDir, 'cross-cutting-template.md'), 'utf8');
    assert.ok(content.includes('Provider Composition Tree'), 'Must contain provider tree');
    assert.ok(content.includes('AuthProvider'), 'Must define AuthProvider');
    assert.ok(content.includes('ThemeProvider'), 'Must define ThemeProvider');
    assert.ok(content.includes('I18nProvider'), 'Must define I18nProvider');
    assert.ok(content.includes('ErrorBoundary'), 'Must define ErrorBoundary');
    assert.ok(content.includes('Logger') || content.includes('logger'), 'Must define logger utility');
    assert.ok(content.includes('FeatureFlagsProvider'), 'Must define FeatureFlagsProvider');
  });

  test('terminology-template contains glossary, acronyms, and naming conventions', () => {
    const content = fs.readFileSync(path.join(templateDir, 'terminology-template.md'), 'utf8');
    assert.ok(content.includes('Glossary'), 'Must contain glossary table');
    assert.ok(content.includes('Acronyms & Abbreviations'), 'Must contain acronyms table');
    assert.ok(content.includes('Naming Conventions'), 'Must contain naming conventions table');
  });

  test('constraints-template contains technical constraints, performance budgets, security, and known issues', () => {
    const content = fs.readFileSync(path.join(templateDir, 'constraints-template.md'), 'utf8');
    assert.ok(content.includes('Technical Constraints'), 'Must contain technical constraints table');
    assert.ok(content.includes('Performance Budgets'), 'Must contain performance budgets table');
    assert.ok(content.includes('Security Requirements'), 'Must contain security requirements table');
    assert.ok(content.includes('Known Issues & Workarounds'), 'Must contain known issues table');
  });

  test('workflows-template contains development workflows, CI pipeline, deployment, and decision trees', () => {
    const content = fs.readFileSync(path.join(templateDir, 'workflows-template.md'), 'utf8');
    assert.ok(content.includes('Feature Development'), 'Must contain feature development workflow');
    assert.ok(content.includes('Bug Fix Workflow'), 'Must contain bug fix workflow');
    assert.ok(content.includes('CI Pipeline'), 'Must contain CI pipeline');
    assert.ok(content.includes('Production Deployment') || content.includes('Deployment Workflows'), 'Must contain deployment workflow');
    assert.ok(content.includes('Decision Trees'), 'Must contain decision trees');
  });

  test('appendix-template contains references, changelog, contributor guide, and generation metadata with standardized placeholders', () => {
    const content = fs.readFileSync(path.join(templateDir, 'appendix-template.md'), 'utf8');
    assert.ok(content.includes('External References & Links'), 'Must contain external references');
    assert.ok(content.includes('Changelog'), 'Must contain changelog section');
    assert.ok(content.includes('Contributor Guide'), 'Must contain contributor guide');
    assert.ok(content.includes('License & Attribution'), 'Must contain license & attribution');
    assert.ok(content.includes('Generation Metadata'), 'Must contain generation metadata table');
    assert.ok(content.includes('<GENERATED_AT>'), 'Must use standardized placeholder for generation timestamp');
    assert.ok(content.includes('<Project Name>'), 'Must use standardized placeholder for project name');
  });

  test('writer skill lists all 14 templates and exact 5 waves in SKILL.md', () => {
    const skill = fs.readFileSync(path.join(__dirname, '../skills/writer/SKILL.md'), 'utf8');
    expectedTemplates.forEach(t => {
      assert.ok(skill.includes(t), `SKILL.md must reference ${t}`);
    });

    // 5 waves structure
    assert.ok(skill.includes('Wave 1 (Independent):'), 'Must define Wave 1');
    assert.ok(skill.includes('Wave 2 (Depends on Wave 1):'), 'Must define Wave 2');
    assert.ok(skill.includes('Wave 3 (Depends on Wave 2):'), 'Must define Wave 3');
    assert.ok(skill.includes('Wave 4 (Depends on Waves 2-3):'), 'Must define Wave 4');
    assert.ok(skill.includes('Wave 5 (Depends on All Prior):'), 'Must define Wave 5');

    // Page mapping in waves
    assert.ok(skill.includes('1. Executive Summary'));
    assert.ok(skill.includes('2. Directory Structure'));
    assert.ok(skill.includes('3. Global Data Models'));
    assert.ok(skill.includes('4. Component Architecture'));
    assert.ok(skill.includes('5. State Management'));
    assert.ok(skill.includes('6. Routing & Layout Structure'));
    assert.ok(skill.includes('7. UI Component Library'));
    assert.ok(skill.includes('8. API Interaction Patterns'));
    assert.ok(skill.includes('9. Features & Business Logic'));
    assert.ok(skill.includes('10. Cross-Cutting Concerns'));
    assert.ok(skill.includes('11. Terminology & Glossary'));
    assert.ok(skill.includes('12. Constraints & Limitations'));
    assert.ok(skill.includes('13. Workflows & Procedures'));
    assert.ok(skill.includes('14. Appendix'));

    // Output target
    assert.ok(skill.includes('docs/markdown/'), 'Must reference docs/markdown/ output path');
  });

  test('writer SKILL.md contains Artifact HTML Formatting section with builder utility classes', () => {
    const skill = fs.readFileSync(path.join(__dirname, '../skills/writer/SKILL.md'), 'utf8');
    assert.ok(skill.includes('## Artifact HTML Formatting'), 'SKILL.md must contain an Artifact HTML Formatting section');

    const utilityClasses = ['artifact-card', 'grid-2', 'grid-3', 'badge', 'status-indicator'];
    utilityClasses.forEach(cls => {
      assert.ok(skill.includes(cls), `Artifact HTML Formatting must reference ${cls}`);
    });

    assert.ok(skill.includes('status-warning'), 'status-indicator guidance must include status-warning modifier');
    assert.ok(skill.includes('status-error'), 'status-indicator guidance must include status-error modifier');

    // Section must sit after Content Structure and before Cross-References
    const contentIdx = skill.indexOf('## Content Structure');
    const artifactIdx = skill.indexOf('## Artifact HTML Formatting');
    const crossRefIdx = skill.indexOf('## Cross-References');
    assert.ok(contentIdx !== -1 && artifactIdx !== -1 && crossRefIdx !== -1, 'Required sections must exist');
    assert.ok(contentIdx < artifactIdx && artifactIdx < crossRefIdx,
      'Artifact HTML Formatting must appear after Content Structure and before Cross-References');

    assert.ok(skill.includes('do not invent other class names'), 'Must restrict Writer to Builder CSS classes');
  });
});

