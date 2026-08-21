const { describe, test, before } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Build Templates (Artifact-Style HTML Output)', () => {
  const templatesDir = path.join(__dirname, '../skills/builder/templates');
  const skillPath = path.join(__dirname, '../skills/builder/SKILL.md');
  const fixture14KbDir = path.join(__dirname, 'fixtures/sample-14-kb');

  const EXPECTED_CATEGORIES = [
    'product',
    'directory-structure',
    'data-models',
    'component-architecture',
    'state-management',
    'routing-structure',
    'ui-component-library',
    'api-patterns',
    'features',
    'cross-cutting',
    'terminology',
    'constraints',
    'workflows',
    'unanswered'
  ];

  before(() => {
    // Setup complete 14-category fixture
    if (!fs.existsSync(fixture14KbDir)) {
      fs.mkdirSync(fixture14KbDir, { recursive: true });
    }

    const categoryTitles = {
      'product': 'Product Overview',
      'directory-structure': 'Directory Structure',
      'data-models': 'Data Models',
      'component-architecture': 'Component Architecture',
      'state-management': 'State Management',
      'routing-structure': 'Routing Structure',
      'ui-component-library': 'UI Component Library',
      'api-patterns': 'API Patterns',
      'features': 'Features',
      'cross-cutting': 'Cross-Cutting Concerns',
      'terminology': 'Terminology & Glossary',
      'constraints': 'Constraints & Limitations',
      'workflows': 'Workflows & Procedures',
      'unanswered': 'Unanswered Questions'
    };

    EXPECTED_CATEGORIES.forEach((cat, idx) => {
      const filePath = path.join(fixture14KbDir, `${cat}.md`);
      const content = `---
category: "${cat}"
title: "${categoryTitles[cat]}"
confidence: "high"
extracted_at: "2026-08-21T00:00:00Z"
---

Content for ${cat} section ${idx + 1}.

> **Source:** source-00${(idx % 3) + 1}.md # section-${cat}
`;
      fs.writeFileSync(filePath, content, 'utf8');
    });
  });

  test('index-html-template.html contains all required v4 placeholders', () => {
    const tpl = fs.readFileSync(path.join(templatesDir, 'index-html-template.html'), 'utf8');
    const placeholders = [
      '{{TITLE}}',
      '{{PRODUCT_NAME}}',
      '{{TAGLINE}}',
      '{{VERSION}}',
      '{{GENERATED_AT}}',
      '{{SIDEBAR_NAV}}',
      '{{PRODUCT_OVERVIEW}}',
      '{{DOC_SECTIONS}}',
      '{{PROCESS_DIAGRAM}}',
      '{{STYLE}}',
      '{{SCRIPTS}}'
    ];
    placeholders.forEach(p => {
      assert.ok(tpl.includes(p), `Template must include placeholder ${p}`);
    });
  });

  test('index-html-template.html contains required font links and semantic HTML elements', () => {
    const tpl = fs.readFileSync(path.join(templatesDir, 'index-html-template.html'), 'utf8');

    // Google Fonts
    assert.ok(tpl.includes('Space+Grotesk'), 'Must include Space Grotesk font');
    assert.ok(tpl.includes('Inter'), 'Must include Inter font');
    assert.ok(tpl.includes('JetBrains+Mono'), 'Must include JetBrains Mono font');

    // Semantic layout and CSS-only sidebar
    assert.ok(tpl.includes('id="sidebar-toggle"'), 'Must include sidebar-toggle checkbox');
    assert.ok(tpl.includes('class="sidebar-overlay"'), 'Must include sidebar-overlay');
    assert.ok(tpl.includes('<aside class="sidebar"'), 'Must include aside sidebar element');
    assert.ok(tpl.includes('<main class="main-content">'), 'Must include main content element');
    assert.ok(tpl.includes('<header class="page-header">'), 'Must include page header');
    assert.ok(tpl.includes('<article class="doc-content">'), 'Must include article doc-content');
    assert.ok(tpl.includes('id="overview"'), 'Must include overview section');
    assert.ok(tpl.includes('id="pipeline"'), 'Must include pipeline section');
    assert.ok(tpl.includes('id="theme-toggle"'), 'Must include theme toggle button');
    assert.ok(tpl.includes('class="print-link"'), 'Must include print link');
  });

  test('styles.css contains design tokens for colors, typography, spacing, radius, and layout', () => {
    const css = fs.readFileSync(path.join(templatesDir, 'styles.css'), 'utf8');

    // Color tokens
    assert.ok(css.includes('--color-bg:'), 'Must define --color-bg');
    assert.ok(css.includes('--color-text:'), 'Must define --color-text');
    assert.ok(css.includes('--color-primary:'), 'Must define --color-primary');
    assert.ok(css.includes('--color-border:'), 'Must define --color-border');
    assert.ok(css.includes('--color-surface:'), 'Must define --color-surface');
    assert.ok(css.includes('--color-code-bg:'), 'Must define --color-code-bg');

    // Typography tokens
    assert.ok(css.includes('--font-sans:'), 'Must define --font-sans');
    assert.ok(css.includes('--font-mono:'), 'Must define --font-mono');
    assert.ok(css.includes('--font-heading:'), 'Must define --font-heading');

    // Spacing, Radius, Layout
    assert.ok(css.includes('--spacing-md:'), 'Must define --spacing-md');
    assert.ok(css.includes('--radius-md:'), 'Must define --radius-md');
    assert.ok(css.includes('--sidebar-width:'), 'Must define --sidebar-width');
    assert.ok(css.includes('--header-height:'), 'Must define --header-height');
  });

  test('styles.css defines dark/light theme switching and responsive breakpoints', () => {
    const css = fs.readFileSync(path.join(templatesDir, 'styles.css'), 'utf8');

    // Theme rules
    assert.ok(css.includes('@media (prefers-color-scheme: dark)'), 'Must include prefers-color-scheme: dark media query');
    assert.ok(css.includes('[data-theme="dark"]'), 'Must include [data-theme="dark"] override');
    assert.ok(css.includes('[data-theme="light"]'), 'Must include [data-theme="light"] override');

    // Responsive breakpoints
    assert.ok(css.includes('@media (max-width: 1024px)'), 'Must include 1024px tablet/mobile breakpoint');
    assert.ok(css.includes('@media (max-width: 640px)'), 'Must include 640px phone breakpoint');
  });

  test('styles.css defines styles for documentation components, tables, code blocks, and diagrams', () => {
    const css = fs.readFileSync(path.join(templatesDir, 'styles.css'), 'utf8');

    // Navigation and layout
    assert.ok(css.includes('.sidebar'), 'Must style .sidebar');
    assert.ok(css.includes('.main-content'), 'Must style .main-content');
    assert.ok(css.includes('.doc-section'), 'Must style .doc-section');
    assert.ok(css.includes('.section-label'), 'Must style .section-label');
    assert.ok(css.includes('.tagline'), 'Must style .tagline');

    // Product overview
    assert.ok(css.includes('.product-overview'), 'Must style .product-overview');
    assert.ok(css.includes('.product-meta'), 'Must style .product-meta');
    assert.ok(css.includes('.meta-card'), 'Must style .meta-card');
    assert.ok(css.includes('.tech-badges'), 'Must style .tech-badges');
    assert.ok(css.includes('.architecture-highlights'), 'Must style .architecture-highlights');

    // Content components
    assert.ok(css.includes('.table-wrapper'), 'Must style .table-wrapper');
    assert.ok(css.includes('.code-block'), 'Must style .code-block');
    assert.ok(css.includes('.source-citation'), 'Must style .source-citation');
    assert.ok(css.includes('.mermaid'), 'Must style .mermaid');
    assert.ok(css.includes('.process-diagram'), 'Must style .process-diagram');
    assert.ok(css.includes('.process-step'), 'Must style .process-step');
    assert.ok(css.includes('details'), 'Must style details tree');
    assert.ok(css.includes('summary'), 'Must style summary');
    assert.ok(css.includes('.tabs'), 'Must style CSS tabs');
    assert.ok(css.includes('.callout'), 'Must style callouts');
  });

  test('styles.css defines print stylesheet with clean document layout', () => {
    const css = fs.readFileSync(path.join(templatesDir, 'styles.css'), 'utf8');

    assert.ok(css.includes('@media print'), 'Must define @media print block');
    assert.ok(css.includes('break-inside: avoid') || css.includes('page-break-inside: avoid'), 'Must prevent page breaks in blocks');
  });

  test('scripts.js provides theme toggle with localStorage persistence and system theme detection', () => {
    const js = fs.readFileSync(path.join(templatesDir, 'scripts.js'), 'utf8');

    assert.ok(js.includes('toggleTheme'), 'Must include toggleTheme function');
    assert.ok(js.includes('initTheme'), 'Must include initTheme function');
    assert.ok(js.includes('localStorage'), 'Must use localStorage for persistence');
    assert.ok(js.includes('data-theme'), 'Must manipulate data-theme attribute');
    assert.ok(js.includes('prefers-color-scheme'), 'Must check prefers-color-scheme media query');
  });

  test('scripts.js provides Mermaid diagram initialization and theme mutation observer', () => {
    const js = fs.readFileSync(path.join(templatesDir, 'scripts.js'), 'utf8');

    assert.ok(js.includes('initMermaid'), 'Must include initMermaid function');
    assert.ok(js.includes('mermaid.initialize'), 'Must call mermaid.initialize');
    assert.ok(js.includes('MutationObserver'), 'Must use MutationObserver for theme sync');
  });

  test('scripts.js provides smooth scrolling, copy code buttons, and mobile navigation', () => {
    const js = fs.readFileSync(path.join(templatesDir, 'scripts.js'), 'utf8');

    assert.ok(js.includes('initSmoothScroll'), 'Must include initSmoothScroll');
    assert.ok(js.includes('initCopyCode'), 'Must include initCopyCode');
    assert.ok(js.includes('initSidebarToggle'), 'Must include initSidebarToggle');
    assert.ok(js.includes('initActiveNav'), 'Must include initActiveNav');
  });

  test('build-html.mjs exports all required helper functions', async () => {
    const builder = await import('../skills/builder/templates/build-html.mjs');
    assert.strictEqual(typeof builder.renderMarkdown, 'function');
    assert.strictEqual(typeof builder.buildProductOverview, 'function');
    assert.strictEqual(typeof builder.buildDocSections, 'function');
    assert.strictEqual(typeof builder.buildSidebarNav, 'function');
    assert.strictEqual(typeof builder.buildProcessDiagram, 'function');
    assert.strictEqual(typeof builder.assembleKnowledgeBase, 'function');
    assert.strictEqual(typeof builder.render, 'function');
    assert.strictEqual(typeof builder.readTemplate, 'function');
    assert.strictEqual(typeof builder.buildArtifact, 'function');
  });

  test('renderMarkdown converts markdown, tables, citations, and Mermaid blocks to HTML', async () => {
    const { renderMarkdown } = await import('../skills/builder/templates/build-html.mjs');

    // Markdown typography
    const mdText = '# Heading 1\n\nThis is a paragraph with **bold** text.\n\n- Item 1\n- Item 2';
    const htmlText = renderMarkdown(mdText);
    assert.ok(htmlText.includes('<h1>Heading 1</h1>'));
    assert.ok(htmlText.includes('<strong>bold</strong>'));
    assert.ok(htmlText.includes('<ul>'));

    // Source citations
    const mdCite = '> **Source:** source-001.md # section-overview';
    const htmlCite = renderMarkdown(mdCite);
    assert.ok(htmlCite.includes('<blockquote class="source-citation">'));

    // Tables
    const mdTable = '| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |';
    const htmlTable = renderMarkdown(mdTable);
    assert.ok(htmlTable.includes('<div class="table-wrapper">'));
    assert.ok(htmlTable.includes('<table>'));

    // Mermaid code block
    const mdMermaid = '```mermaid\ngraph TD\n  A --> B\n```';
    const htmlMermaid = renderMarkdown(mdMermaid);
    assert.ok(htmlMermaid.includes('<pre class="mermaid">'));
    assert.ok(htmlMermaid.includes('graph TD'));

    // Standard code block
    const mdCode = '```typescript\nconst x: number = 42;\n```';
    const htmlCode = renderMarkdown(mdCode);
    assert.ok(htmlCode.includes('<pre class="code-block" data-language="typescript">'));
    assert.ok(htmlCode.includes('<code class="language-typescript">'));
  });

  test('buildProductOverview extracts frontmatter and formats product overview HTML', async () => {
    const { buildProductOverview } = await import('../skills/builder/templates/build-html.mjs');
    const overview = buildProductOverview(fixture14KbDir);

    assert.ok(overview.html.includes('class="product-overview"'));
    assert.ok(overview.html.includes('class="product-meta"'));
    assert.ok(overview.html.includes('class="meta-card"'));
    assert.ok(overview.html.includes('class="architecture-highlights"'));
    assert.strictEqual(typeof overview.name, 'string');
    assert.strictEqual(typeof overview.version, 'string');
  });

  test('buildDocSections renders markdown pages with frontmatter and slugs', async () => {
    const { buildDocSections } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      fs.writeFileSync(path.join(docsDir, '01-executive-summary.md'), '---\ntitle: "Executive Summary"\ncategory: "product"\n---\nSummary content here.');
      fs.writeFileSync(path.join(docsDir, '02-directory-structure.md'), '---\ntitle: "Directory Structure"\ncategory: "architecture"\n---\nDirectory content here.');
    }

    const plan = {
      pages: [
        { file: '01-executive-summary.md', title: 'Executive Summary', category: 'product' },
        { file: '02-directory-structure.md', title: 'Directory Structure', category: 'architecture' }
      ]
    };

    const sectionsHtml = buildDocSections(docsDir, plan);
    assert.ok(sectionsHtml.includes('id="executive-summary"'));
    assert.ok(sectionsHtml.includes('id="directory-structure"'));
    assert.ok(sectionsHtml.includes('class="doc-section"'));
    assert.ok(sectionsHtml.includes('Summary content here.'));
  });

  test('buildSidebarNav creates navigation links for overview, pages, and pipeline', async () => {
    const { buildSidebarNav } = await import('../skills/builder/templates/build-html.mjs');
    const plan = {
      pages: [
        { file: '01-executive-summary.md', title: 'Executive Summary' },
        { file: '02-directory-structure.md', title: 'Directory Structure' }
      ]
    };

    const navHtml = buildSidebarNav(plan);
    assert.ok(navHtml.includes('<ul class="nav-list">'));
    assert.ok(navHtml.includes('href="#overview"'));
    assert.ok(navHtml.includes('href="#executive-summary"'));
    assert.ok(navHtml.includes('href="#directory-structure"'));
    assert.ok(navHtml.includes('href="#pipeline"'));
  });

  test('buildProcessDiagram creates 4-step pipeline diagram', async () => {
    const { buildProcessDiagram } = await import('../skills/builder/templates/build-html.mjs');
    const processHtml = buildProcessDiagram();

    assert.ok(processHtml.includes('class="process-diagram"'));
    assert.ok(processHtml.includes('Planner'));
    assert.ok(processHtml.includes('Writer'));
    assert.ok(processHtml.includes('Reviewer'));
    assert.ok(processHtml.includes('Builder'));
    assert.ok(processHtml.includes('14 knowledge categories') || processHtml.includes('14 categories'));
    assert.ok(processHtml.includes('5 dependency-aware waves') || processHtml.includes('5 waves'));
    assert.ok(processHtml.includes('7 dimensions'));
  });

  test('assembleKnowledgeBase processes all 14 categories in order, strips frontmatter, and preserves citations', async () => {
    const { assembleKnowledgeBase } = await import('../skills/builder/templates/build-html.mjs');
    const kb = assembleKnowledgeBase(fixture14KbDir);

    assert.ok(kb.includes('# Knowledge Base'));

    // Check all 14 categories are represented in order
    let lastIndex = -1;
    EXPECTED_CATEGORIES.forEach(cat => {
      const idx = kb.indexOf(`Content for ${cat}`);
      assert.ok(idx > -1, `KB must include content for category ${cat}`);
      assert.ok(idx > lastIndex, `Category ${cat} must follow previous category in order`);
      lastIndex = idx;
    });

    // Check YAML frontmatter is stripped
    assert.strictEqual(kb.includes('extracted_at:'), false, 'Frontmatter must be stripped');
    assert.strictEqual(kb.includes('confidence: "high"'), false, 'Frontmatter must be stripped');

    // Check citations are preserved
    assert.ok(kb.includes('> **Source:** source-001.md'), 'Citations must be preserved');
  });

  test('render replaces template placeholders correctly', async () => {
    const { render } = await import('../skills/builder/templates/build-html.mjs');
    const template = '<h1>{{TITLE}}</h1><p>{{BODY}}</p><span>{{VERSION}}</span>';
    const output = render(template, {
      TITLE: 'Insightify Specification',
      BODY: 'Generated technical specification.',
      VERSION: '4.0.0'
    });

    assert.strictEqual(output, '<h1>Insightify Specification</h1><p>Generated technical specification.</p><span>4.0.0</span>');
  });

  test('readTemplate reads template files safely', async () => {
    const { readTemplate } = await import('../skills/builder/templates/build-html.mjs');

    const htmlTemplate = readTemplate('index-html-template.html');
    assert.ok(htmlTemplate.includes('<!DOCTYPE html>'));

    const cssTemplate = readTemplate('styles.css');
    assert.ok(cssTemplate.includes(':root'));

    const jsTemplate = readTemplate('scripts.js');
    assert.ok(jsTemplate.includes('Insightify'));
  });

  test('buildArtifact generates complete static HTML specification and knowledge-base.md', async () => {
    const { buildArtifact } = await import('../skills/builder/templates/build-html.mjs');
    const docsDir = path.join(__dirname, 'fixtures/sample-docs');

    const artifact = buildArtifact({
      kbDir: fixture14KbDir,
      docsDir: docsDir,
      plan: {
        pages: [
          { file: '01-executive-summary.md', title: 'Executive Summary', category: 'product' },
          { file: '02-directory-structure.md', title: 'Directory Structure', category: 'architecture' }
        ]
      }
    });

    assert.ok(artifact.html.includes('<!DOCTYPE html>'));
    assert.ok(artifact.html.includes('Generated by Insightify v4.0.0'));
    assert.ok(artifact.html.includes('<style>'));
    assert.ok(artifact.html.includes('--color-primary:'));
    assert.ok(artifact.html.includes('<script>'));
    assert.ok(artifact.html.includes('mermaid.initialize'));
    assert.ok(artifact.html.includes('id="overview"'));
    assert.ok(artifact.html.includes('id="executive-summary"'));
    assert.ok(artifact.html.includes('id="pipeline"'));

    assert.ok(artifact.knowledgeBase.includes('# Knowledge Base'));
    assert.ok(artifact.knowledgeBase.includes('## Product'));
  });

  test('builder SKILL.md defines Stage 4, Interfaces (Consumes/Produces), instructions, and rendering rules', () => {
    assert.strictEqual(fs.existsSync(skillPath), true, 'SKILL.md must exist');
    const content = fs.readFileSync(skillPath, 'utf8');

    assert.ok(content.includes('name: builder'), 'Must have name: builder');
    assert.ok(content.includes('Stage 4'), 'Must mention Stage 4');

    // Interfaces
    assert.ok(content.includes('## Interfaces'), 'Must include Interfaces section');
    assert.ok(content.includes('docs/markdown/*.md'), 'Must specify Consumes docs/markdown/*.md');
    assert.ok(content.includes('.insightify/knowledge/*.md'), 'Must specify Consumes .insightify/knowledge/*.md');
    assert.ok(content.includes('.insightify/plan.md'), 'Must specify Consumes .insightify/plan.md');
    assert.ok(content.includes('index.html'), 'Must specify Produces index.html');
    assert.ok(content.includes('knowledge-base.md'), 'Must specify Produces knowledge-base.md');

    // Instructions and rendering rules
    assert.ok(content.includes('## Instructions'), 'Must include Instructions');
    assert.ok(content.includes('## Rendering Rules'), 'Must include Rendering Rules');
    assert.ok(content.includes('templates/index-html-template.html'), 'Must reference index-html-template.html');
    assert.ok(content.includes('templates/build-html.mjs'), 'Must reference build-html.mjs');
    assert.ok(content.includes('templates/styles.css'), 'Must reference styles.css');
    assert.ok(content.includes('templates/scripts.js'), 'Must reference scripts.js');
  });
});