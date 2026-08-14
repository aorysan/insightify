const { describe, test } = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Build Templates', () => {
  test('vitepress config template is valid JavaScript structure', () => {
    const configTpl = fs.readFileSync(path.join(__dirname, '../skills/build/templates/vitepress-config.js'), 'utf8');
    assert.strictEqual(configTpl.includes('defineConfig'), true);
    assert.strictEqual(configTpl.includes('themeConfig'), true);
  });

  test('index template contains hero frontmatter', () => {
    const indexTpl = fs.readFileSync(path.join(__dirname, '../skills/build/templates/index-template.md'), 'utf8');
    assert.strictEqual(indexTpl.includes('layout: home'), true);
    assert.strictEqual(indexTpl.includes('hero:'), true);
  });

  test('sidebar template transforms plan pages into VitePress sidebar items', () => {
    const buildSidebar = require('../skills/build/templates/sidebar-template.js');
    const pages = [
      { title: 'Getting Started', slug: 'getting-started' },
      { title: 'API Reference', slug: 'api/overview' }
    ];
    const sidebar = buildSidebar(pages);
    assert.deepStrictEqual(sidebar, [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API Reference', link: '/api/overview' }
    ]);
  });
});
