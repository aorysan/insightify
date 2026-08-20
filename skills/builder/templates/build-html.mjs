import fs from 'fs';
import path from 'path';

const STYLE = `
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Space Grotesk', var(--font-sans);
  --font-mono: 'JetBrains Mono', monospace;
  --color-bg: #ffffff;
  --color-text: #1a1a2e;
  --color-text-muted: #5a5a7a;
  --color-border: #e0e0eb;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-code-bg: #f3f4f6;
  --color-code-text: #1f2937;
  --color-blockquote-bg: #f8fafc;
  --color-blockquote-border: #cbd5e1;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --radius-sm: 4px;
  --radius-md: 8px;
  --max-width: 900px;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #0f0f1a;
    --color-text: #e8e8f0;
    --color-text-muted: #9aa0b0;
    --color-border: #2d2d44;
    --color-primary: #60a5fa;
    --color-primary-hover: #93c5fd;
    --color-code-bg: #1e1e2e;
    --color-code-text: #e0e0e8;
    --color-blockquote-bg: #1a1a2e;
    --color-blockquote-border: #3d3d5c;
  }
}

[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #1a1a2e;
  --color-text-muted: #5a5a7a;
  --color-border: #e0e0eb;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-code-bg: #f3f4f6;
  --color-code-text: #1f2937;
  --color-blockquote-bg: #f8fafc;
  --color-blockquote-border: #cbd5e1;
}

[data-theme="dark"] {
  --color-bg: #0f0f1a;
  --color-text: #e8e8f0;
  --color-text-muted: #9aa0b0;
  --color-border: #2d2d44;
  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --color-code-bg: #1e1e2e;
  --color-code-text: #e0e0e8;
  --color-blockquote-bg: #1a1a2e;
  --color-blockquote-border: #3d3d5c;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

/* Masthead */
.masthead {
  text-align: center;
  padding: var(--spacing-2xl) 0 var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-2xl);
}

.project-kicker {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-sm);
}

.project-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  line-height: 1.2;
}

.project-desc {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Main content */
main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.doc-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(37, 99, 235, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
}

.doc-page h2 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

.doc-page h3 {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-text);
  margin: var(--spacing-xl) 0 var(--spacing-md);
}

.doc-page h4 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
  margin: var(--spacing-lg) 0 var(--spacing-sm);
}

.doc-page p {
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.doc-page a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.doc-page a:hover {
  border-bottom-color: var(--color-primary);
}

.doc-page code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 0.15em 0.4em;
  border-radius: var(--radius-sm);
}

.doc-page pre {
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--spacing-md) 0;
  border: 1px solid var(--color-border);
}

.doc-page pre code {
  background: transparent;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.doc-page .lang-javascript, .doc-page .lang-js { }
.doc-page .lang-typescript, .doc-page .lang-ts { }
.doc-page .lang-bash, .doc-page .lang-sh { }
.doc-page .lang-json { }

.doc-page blockquote {
  border-left: 3px solid var(--color-blockquote-border);
  background: var(--color-blockquote-bg);
  padding: var(--spacing-md) var(--spacing-lg);
  margin: var(--spacing-md) 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-style: italic;
  color: var(--color-text-muted);
}

.doc-page blockquote p {
  margin: 0;
}

.doc-page blockquote strong {
  font-style: normal;
  color: var(--color-text);
}

.doc-page ul, .doc-page ol {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-xl);
}

.doc-page li {
  margin: var(--spacing-xs) 0;
  line-height: 1.7;
}

.doc-page table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
  font-size: 0.9rem;
}

.doc-page th, .doc-page td {
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
}

.doc-page th {
  background: var(--color-code-bg);
  font-weight: 600;
  font-family: var(--font-heading);
}

.doc-page tr:nth-child(even) td {
  background: var(--color-code-bg);
}

/* Product Overview Cards */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.product-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.product-card .card-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--spacing-xs);
}

.product-card .card-value {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.feature-item {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
}

.feature-item h4 {
  font-family: var(--font-heading);
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.feature-item p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* Process Diagram */
.process-diagram {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
  align-items: flex-start;
}

.process-step {
  flex: 1;
  min-width: 180px;
  max-width: 220px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
  position: relative;
}

.process-step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -var(--spacing-lg);
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: bold;
}

@media (max-width: 768px) {
  .process-step:not(:last-child)::after {
    content: '↓';
    right: auto;
    bottom: -var(--spacing-lg);
    top: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

.process-step .step-num {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.process-step h4 {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.process-step .step-io {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-family: var(--font-mono);
}

.process-step .step-in { color: #10b981; }
.process-step .step-out { color: #f59e0b; }

/* Footer */
footer {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

footer span {
  font-family: var(--font-mono);
}

/* Knowledge Base (markdown file) */
.kb-section {
  margin-bottom: var(--spacing-2xl);
}

.kb-section h2 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}
`;

export function renderMarkdown(md) {
  return md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^\|(.+)\|$/gm, (m) => '<tr>' + m.split('|').slice(1,-1).map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}

export function buildProductOverview(kbDir) {
  const product = fs.readFileSync(path.join(kbDir, 'product.md'), 'utf8');
  const features = fs.readFileSync(path.join(kbDir, 'features.md'), 'utf8');

  const extractFrontmatter = (content) => {
    const match = content.match(/^---([\s\S]*?)---/);
    if (!match) return {};
    const yaml = match[1];
    const obj = {};
    yaml.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length) {
        obj[key.trim()] = val.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
    return obj;
  };

  const productMeta = extractFrontmatter(product);
  const name = productMeta.name || 'Product';
  const version = productMeta.version || '1.0.0';
  const company = productMeta.company || 'Unknown';
  const audience = productMeta.audience || 'Developers';

  const featureMatches = features.match(/^## (.*?)\n\n(.*?)(?=\n## |\n---|$)/gms) || [];
  const featureItems = featureMatches.map(f => {
    const lines = f.trim().split('\n');
    const title = lines[0].replace('## ', '');
    const desc = lines.slice(1).join('\n').trim();
    return { title, desc };
  }).slice(0, 6);

  let html = '<div class="product-grid">';
  html += `
    <div class="product-card"><div class="card-label">Name</div><div class="card-value">${name}</div></div>
    <div class="product-card"><div class="card-label">Version</div><div class="card-value">${version}</div></div>
    <div class="product-card"><div class="card-label">Company</div><div class="card-value">${company}</div></div>
    <div class="product-card"><div class="card-label">Audience</div><div class="card-value">${audience}</div></div>
  `;
  html += '</div>';

  if (featureItems.length > 0) {
    html += '<h3>Key Features</h3><div class="feature-list">';
    featureItems.forEach(f => {
      html += `<div class="feature-item"><h4>${f.title}</h4><p>${f.desc}</p></div>`;
    });
    html += '</div>';
  }

  return html;
}

export function buildDocPages(docsDir, plan) {
  const pagesDir = path.join(docsDir, 'markdown');
  if (!fs.existsSync(pagesDir)) return '';

  const planContent = fs.readFileSync(plan, 'utf8');
  const pageOrderMatch = planContent.match(/## Writing Order\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  let pageFiles = [];

  if (pageOrderMatch) {
    const orderText = pageOrderMatch[1];
    const lines = orderText.split('\n').filter(l => l.trim().match(/^\d+\./));
    lines.forEach(line => {
      const match = line.match(/^\d+\.\s+(.+?)\s*\(/);
      if (match) {
        pageFiles.push(match[1].trim() + '.md');
      }
    });
  }

  if (pageFiles.length === 0) {
    pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md')).sort();
  }

  let html = '';
  pageFiles.forEach((file, idx) => {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    let title = file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let label = `Page ${idx + 1}`;
    if (frontmatterMatch) {
      const yaml = frontmatterMatch[1];
      const titleMatch = yaml.match(/title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) title = titleMatch[1].trim();
      const labelMatch = yaml.match(/label:\s*["']?([^"'\n]+)["']?/);
      if (labelMatch) label = labelMatch[1].trim();
    }
    const body = content.replace(/^---[\s\S]*?---/, '').trim();
    const rendered = renderMarkdown(body);
    html += `<section class="doc-page"><span class="page-label">${label}</span><h2>${title}</h2>${rendered}</section>`;
  });

  return html;
}

export function buildProcessDiagram() {
  return `
<section class="doc-page">
  <span class="page-label">Process</span>
  <h2>Documentation Pipeline</h2>
  <div class="process-diagram">
    <div class="process-step">
      <div class="step-num">1</div>
      <h4>Planner</h4>
      <div class="step-io">
        <span class="step-in">In: Sources (files, URLs)</span>
        <span class="step-out">Out: Plan + Knowledge Base</span>
      </div>
    </div>
    <div class="process-step">
      <div class="step-num">2</div>
      <h4>Writer</h4>
      <div class="step-io">
        <span class="step-in">In: Plan + Knowledge</span>
        <span class="step-out">Out: Markdown Docs</span>
      </div>
    </div>
    <div class="process-step">
      <div class="step-num">3</div>
      <h4>Reviewer</h4>
      <div class="step-io">
        <span class="step-in">In: Markdown Docs</span>
        <span class="step-out">Out: Review Report + Issues</span>
      </div>
    </div>
    <div class="process-step">
      <div class="step-num">4</div>
      <h4>Builder</h4>
      <div class="step-io">
        <span class="step-in">In: Markdown + Knowledge</span>
        <span class="step-out">Out: index.html + knowledge-base.md</span>
      </div>
    </div>
  </div>
</section>
  `.trim();
}

export function assembleKnowledgeBase(kbDir) {
  const categories = ['product','features','terminology','api','workflows','constraints','unanswered'];
  return categories.map(cat => {
    const filePath = path.join(kbDir, `${cat}.md`);
    if (!fs.existsSync(filePath)) return `## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n_No content available_`;
    const content = fs.readFileSync(filePath, 'utf8');
    return `## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n` + content.replace(/^---[\s\S]*?---/, '').trim();
  }).join('\n\n');
}

export function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
}