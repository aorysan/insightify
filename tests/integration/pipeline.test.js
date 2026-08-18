const { describe, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { parseHtml } = require('../../skills/ingest/parsers/html-parser');
const { parseCode } = require('../../skills/ingest/parsers/code-parser');
const buildSidebar = require('../../skills/build/templates/sidebar-template');

describe('Integration: Documentation Pipeline', () => {
  const fixturesDir = path.join(__dirname, '../fixtures');

  test('ingests HTML fixture and strips navigation boilerplate', () => {
    const htmlPath = path.join(fixturesDir, 'sample.html');
    assert.strictEqual(fs.existsSync(htmlPath), true, 'sample.html must exist');

    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const parsed = parseHtml(htmlContent);

    assert.ok(parsed.includes('# Hello World'), 'Title extracted as H1');
    assert.strictEqual(parsed.includes('<nav>'), false, 'Nav tags must be stripped');
  });

  test('ingests JS/TS fixtures and extracts comments with fallback', () => {
    const jsPath = path.join(fixturesDir, 'sample.js');
    const tsPath = path.join(fixturesDir, 'sample.ts');
    assert.strictEqual(fs.existsSync(jsPath), true, 'sample.js must exist');
    assert.strictEqual(fs.existsSync(tsPath), true, 'sample.ts must exist');

    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const extractedJs = parseCode(jsContent, 'js');
    assert.ok(extractedJs.includes('A sample function'), 'JSDoc comment extracted');

    const tsContent = fs.readFileSync(tsPath, 'utf8');
    const extractedTs = parseCode(tsContent, 'ts');
    assert.ok(extractedTs.includes('interface User'), 'TypeScript code fallback preserved');
  });

  test('validates multi-source fixtures and pipeline sidebar generation', () => {
    const multiDir = path.join(fixturesDir, 'multi-source');
    assert.strictEqual(fs.existsSync(path.join(multiDir, 'src/index.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(multiDir, 'docs/guide.md')), true);
    assert.strictEqual(fs.existsSync(path.join(multiDir, 'README.md')), true);

    const planPages = [
      { title: 'Home', slug: 'index' },
      { title: 'Guide', slug: 'guide' },
      { title: 'API Reference', slug: 'api' }
    ];
    const sidebar = buildSidebar(planPages);

    assert.strictEqual(sidebar.length, 3);
    assert.deepStrictEqual(sidebar[0], { text: 'Home', link: '/index' });
    assert.deepStrictEqual(sidebar[1], { text: 'Guide', link: '/guide' });
    assert.deepStrictEqual(sidebar[2], { text: 'API Reference', link: '/api' });
  });

  test('orchestrator skill defines the complete 6-stage pipeline flow', () => {
    const orchestratorPath = path.join(__dirname, '../../skills/insightify/SKILL.md');
    assert.strictEqual(fs.existsSync(orchestratorPath), true);

    const content = fs.readFileSync(orchestratorPath, 'utf8');
    const requiredStages = [
      'Stage 1 (Ingest)',
      'Stage 2 (Extract)',
      'Stage 3 (Plan)',
      'Stage 4 (Write)',
      'Stage 5 (Review)',
      'Stage 6 (Build)'
    ];

    for (const stage of requiredStages) {
      assert.ok(content.includes(stage), `Orchestrator must define ${stage}`);
    }
  });
});
