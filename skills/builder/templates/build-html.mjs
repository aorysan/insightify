import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render markdown to HTML
 */
export function renderMarkdown(md) {
  if (!md) return '';

  // Custom renderer for citations, code blocks, mermaid, and tables
  const renderer = new marked.Renderer();

  // Render blockquotes with source citations
  renderer.blockquote = (quote) => {
    const quoteText = typeof quote === 'object' ? (quote.text || '') : quote;
    if (quoteText.includes('**Source:**') || quoteText.includes('<strong>Source:</strong>') || quoteText.includes('Source:')) {
      return `<blockquote class="source-citation">${quoteText}</blockquote>\n`;
    }
    return `<blockquote>${quoteText}</blockquote>\n`;
  };

  // Render code blocks with language and Mermaid support
  renderer.code = (code, language) => {
    const text = typeof code === 'object' ? (code.text || '') : (code || '');
    const lang = (typeof code === 'object' ? code.lang : language) || 'text';
    const cleanLang = lang.trim().toLowerCase();

    if (cleanLang === 'mermaid') {
      return `<pre class="mermaid">${escapeHtml(text)}</pre>\n`;
    }
    return `<pre class="code-block" data-language="${escapeHtml(cleanLang)}"><code class="language-${escapeHtml(cleanLang)}">${escapeHtml(text)}</code></pre>\n`;
  };

  // Render tables with responsive wrapper
  renderer.table = (header, body) => {
    const head = typeof header === 'object' ? (header.header || '') : header;
    const rows = typeof header === 'object' ? (header.rows || '') : body;
    return `<div class="table-wrapper"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
  };

  const html = marked.parse(md, { renderer, gfm: true, breaks: true });
  return html;
}

/**
 * Parse markdown with frontmatter
 */
function parseMarkdownWithFrontmatter(md) {
  if (!md || typeof md !== 'string') return { frontmatter: {}, content: '' };
  const frontmatterMatch = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (frontmatterMatch) {
    const frontmatter = parseYaml(frontmatterMatch[1]);
    return { frontmatter, content: frontmatterMatch[2] };
  }
  return { frontmatter: {}, content: md };
}

/**
 * Simple YAML parser for frontmatter
 */
function parseYaml(yaml) {
  const result = {};
  if (!yaml) return result;
  const lines = yaml.split('\n');
  let currentKey = null;
  let inArray = false;

  for (let rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;

    // Check array item
    if (line.trim().startsWith('- ') && currentKey) {
      let item = line.trim().substring(2).trim();
      if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
        item = item.slice(1, -1);
      }
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      result[currentKey].push(item);
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if (!value) {
        currentKey = key;
        result[key] = [];
        inArray = true;
        continue;
      }

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Handle inline arrays [a, b, c]
      else if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.slice(1, -1).split(',').map(v => {
            let item = v.trim();
            if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
              item = item.slice(1, -1);
            }
            return item;
          });
        }
      }

      result[key] = value;
      currentKey = key;
    }
  }
  return result;
}

/**
 * Build product overview from knowledge base
 */
export function buildProductOverview(kbDir) {
  let productMd = '';
  let featuresMd = '';
  let crossCuttingMd = '';

  if (kbDir && fs.existsSync(kbDir)) {
    try {
      productMd = fs.readFileSync(path.join(kbDir, 'product.md'), 'utf-8');
    } catch {}

    try {
      featuresMd = fs.readFileSync(path.join(kbDir, 'features.md'), 'utf-8');
    } catch {}

    try {
      crossCuttingMd = fs.readFileSync(path.join(kbDir, 'cross-cutting.md'), 'utf-8');
    } catch {}
  }

  // Extract product info
  const { frontmatter: productInfo, content: productBody } = parseMarkdownWithFrontmatter(productMd);
  const name = productInfo.name || productInfo.title || (productMd.match(/^#\s+(.+)$/m)?.[1]) || 'Project';
  const description = productInfo.description || productBody || 'Frontend Technical Specification';
  const version = productInfo.version || '1.0.0';
  const tagline = productInfo.tagline || productInfo.value_proposition || productInfo.valueProposition || '';
  const audience = productInfo.audience || productInfo.target_audience || 'Developers & Engineering Team';
  const docType = productInfo.doc_type || productInfo.docType || 'React/Frontend Application';

  let rawTechStack = productInfo.techStack || productInfo.tech_stack || [];
  if (typeof rawTechStack === 'string') {
    rawTechStack = [rawTechStack];
  }
  const techStack = Array.isArray(rawTechStack) ? rawTechStack : [];

  let html = `
    <div class="product-overview">
      <div class="product-meta">
        <div class="meta-card">
          <span class="meta-label">Product</span>
          <span class="meta-value">${escapeHtml(name)}</span>
        </div>
        <div class="meta-card">
          <span class="meta-label">Version</span>
          <span class="meta-value">${escapeHtml(version)}</span>
        </div>
        <div class="meta-card">
          <span class="meta-label">Type</span>
          <span class="meta-value">${escapeHtml(docType)}</span>
        </div>
        <div class="meta-card">
          <span class="meta-label">Audience</span>
          <span class="meta-value">${escapeHtml(audience)}</span>
        </div>
      </div>

      <div class="product-description">
        ${renderMarkdown(description)}
      </div>

      ${techStack.length > 0 ? `
        <div class="tech-stack">
          <h3>Technology Stack</h3>
          <div class="tech-badges">
            ${techStack.map(tech => `<span class="tech-badge">${escapeHtml(tech)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="architecture-highlights">
        <h3>Architecture Highlights</h3>
        <ul class="highlight-list">
          <li><strong>Feature-based modular architecture</strong> — Components, hooks, stores, and types co-located by domain</li>
          <li><strong>Zustand for global state</strong> — With persist, immer, and devtools middleware</li>
          <li><strong>React Router v6</strong> — Layout-driven routing with Public/Auth/Protected layouts and guards</li>
          <li><strong>TanStack Query v5</strong> — Custom hooks for data fetching, mutations, and optimistic updates</li>
          <li><strong>Tailwind CSS + CVA</strong> — Design tokens with class-variance-authority for component variants</li>
          <li><strong>TypeScript strict mode</strong> — BaseEntity, ApiResponse, PaginatedResponse patterns</li>
        </ul>
      </div>
    </div>
  `;

  return { html, name, version, tagline, description, audience, docType, techStack };
}

/**
 * Helper to parse plan pages from text or object
 */
function parsePlanPages(planInput) {
  if (!planInput) return [];

  if (Array.isArray(planInput)) return planInput;
  if (typeof planInput === 'object' && Array.isArray(planInput.pages)) return planInput.pages;

  if (typeof planInput === 'string') {
    try {
      const parsed = JSON.parse(planInput);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.pages)) return parsed.pages;
    } catch {}

    const pages = [];
    const lines = planInput.split('\n');

    // Check for ### N. Page Name
    for (const line of lines) {
      const match = line.trim().match(/^###\s+(?:(\d+)\.\s+)?(.+)$/);
      if (match) {
        const num = match[1];
        const title = match[2].trim();
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const file = num ? `${num.padStart(2, '0')}-${slug}.md` : `${slug}.md`;
        pages.push({ title: num ? `${num}. ${title}` : title, file, slug });
      }
    }

    if (pages.length > 0) return pages;

    // Check for list items - N. Page Name
    for (const line of lines) {
      const match = line.trim().match(/^-\s+(?:\[[ xX]\]\s+)?(?:(\d+)\.\s+)?(.+)$/);
      if (match) {
        const num = match[1];
        const title = match[2].trim();
        if (title.startsWith('All ') || title.startsWith('Dependency ') || title.startsWith('Priority ')) continue;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const file = num ? `${num.padStart(2, '0')}-${slug}.md` : `${slug}.md`;
        pages.push({ title: num ? `${num}. ${title}` : title, file, slug });
      }
    }

    return pages;
  }

  return [];
}

/**
 * Build documentation sections from markdown pages
 */
export function buildDocSections(docsDir, plan = {}) {
  let pages = parsePlanPages(plan);

  // Fallback: read docsDir files if no pages found in plan
  if (pages.length === 0 && docsDir && fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();
    pages = files.map(file => ({
      file,
      title: file.replace(/^\d+-/, '').replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      slug: file.replace('.md', '').replace(/^\d+-/, '')
    }));
  }

  let sectionsHtml = '';
  for (const page of pages) {
    const fileName = typeof page === 'string' ? page : (page.file || `${page.slug}.md`);
    let filePath = docsDir ? path.join(docsDir, fileName) : '';

    if ((!filePath || !fs.existsSync(filePath)) && docsDir && fs.existsSync(docsDir)) {
      const slug = fileName.replace('.md', '').replace(/^\d+-/, '');
      const candidate = fs.readdirSync(docsDir).find(f => f.replace('.md', '').replace(/^\d+-/, '') === slug || f === `${slug}.md`);
      if (candidate) {
        filePath = path.join(docsDir, candidate);
      }
    }

    if (!filePath || !fs.existsSync(filePath)) continue;

    const md = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseMarkdownWithFrontmatter(md);

    const slug = fileName.replace('.md', '').replace(/^\d+-/, '');
    const label = frontmatter.category || (typeof page === 'object' ? page.category : null) || 'Documentation';
    const title = frontmatter.title || (typeof page === 'object' ? page.title : null) || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    sectionsHtml += `
      <section id="${escapeHtml(slug)}" class="doc-section">
        <span class="section-label">${escapeHtml(label)}</span>
        <h2>${escapeHtml(title)}</h2>
        ${renderMarkdown(content)}
      </section>
    `;
  }

  return sectionsHtml;
}

/**
 * Build sidebar navigation from plan
 */
export function buildSidebarNav(plan = {}) {
  const pages = parsePlanPages(plan);

  let navHtml = '<ul class="nav-list">';
  navHtml += `
    <li class="nav-item">
      <a href="#overview" class="nav-link">Overview</a>
    </li>
  `;

  for (const page of pages) {
    const fileName = typeof page === 'string' ? page : (page.file || page.slug || page.title);
    const slug = (fileName || '').replace('.md', '').replace(/^\d+-/, '');
    const label = (typeof page === 'object' && page.title) ? page.title : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    navHtml += `
      <li class="nav-item">
        <a href="#${escapeHtml(slug)}" class="nav-link">${escapeHtml(label)}</a>
      </li>
    `;
  }

  // Add pipeline link
  navHtml += `
    <li class="nav-item">
      <a href="#pipeline" class="nav-link">Documentation Pipeline</a>
    </li>
  `;

  navHtml += '</ul>';
  return navHtml;
}

/**
 * Build process diagram
 */
export function buildProcessDiagram() {
  return `
    <div class="process-diagram">
      <div class="process-step">
        <div class="step-number">1</div>
        <div class="step-content">
          <h3>Planner</h3>
          <p>Ingest sources → Extract 14 knowledge categories → Generate documentation plan</p>
          <div class="step-io">
            <span class="input">Sources (files, URLs)</span>
            <span class="arrow">→</span>
            <span class="output">Knowledge Base + Plan</span>
          </div>
        </div>
      </div>
      <div class="process-step">
        <div class="step-number">2</div>
        <div class="step-content">
          <h3>Writer</h3>
          <p>Generate 14 markdown pages in 5 dependency-aware waves</p>
          <div class="step-io">
            <span class="input">Knowledge Base + Plan</span>
            <span class="arrow">→</span>
            <span class="output">14 Markdown Pages</span>
          </div>
        </div>
      </div>
      <div class="process-step">
        <div class="step-number">3</div>
        <div class="step-content">
          <h3>Reviewer</h3>
          <p>Evaluate across 7 dimensions (Accuracy, Completeness, Consistency, Structure, Usability, Type Safety, Architecture Alignment)</p>
          <div class="step-io">
            <span class="input">Markdown Pages</span>
            <span class="arrow">→</span>
            <span class="output">Review Report + Issues</span>
          </div>
        </div>
      </div>
      <div class="process-step">
        <div class="step-number">4</div>
        <div class="step-content">
          <h3>Builder</h3>
          <p>Render artifact-style HTML with sidebar, Mermaid diagrams, dark/light mode, and assemble knowledge-base.md</p>
          <div class="step-io">
            <span class="input">Approved Pages</span>
            <span class="arrow">→</span>
            <span class="output">index.html + knowledge-base.md</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Assemble knowledge base from 14 category files
 */
export function assembleKnowledgeBase(kbDir) {
  const categories = [
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

  let projectName = 'Project';
  if (kbDir && fs.existsSync(path.join(kbDir, 'product.md'))) {
    try {
      const prodContent = fs.readFileSync(path.join(kbDir, 'product.md'), 'utf-8');
      const { frontmatter } = parseMarkdownWithFrontmatter(prodContent);
      if (frontmatter.name) projectName = frontmatter.name;
    } catch {}
  }

  let kbMd = `# Knowledge Base: ${projectName}\n\n`;
  kbMd += `*Generated by Insightify v4.0.0*\n\n`;

  for (const category of categories) {
    const filePath = kbDir ? path.join(kbDir, `${category}.md`) : '';
    if (!filePath || !fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content: body } = parseMarkdownWithFrontmatter(content);

    const title = frontmatter.title || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    kbMd += `## ${title}\n\n`;
    kbMd += body.trim();
    kbMd += '\n\n---\n\n';
  }

  return kbMd;
}

/**
 * Render template with data
 */
export function render(template, data = {}) {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, value !== undefined && value !== null ? String(value) : '');
  }
  return result;
}

/**
 * Read template file safely from templates directory
 */
export function readTemplate(templateName) {
  const templatePath = path.join(__dirname, templateName);
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Build single artifact HTML and knowledge base
 */
export function buildArtifact(options = {}) {
  const kbDir = options.kbDir || path.join(options.outDir || '.', '.insightify/knowledge');
  const docsDir = options.docsDir || path.join(options.outDir || '.', 'docs/markdown');
  const plan = options.plan || (options.planFile && fs.existsSync(options.planFile) ? fs.readFileSync(options.planFile, 'utf-8') : null) || {};

  const overview = buildProductOverview(kbDir);
  const docSections = buildDocSections(docsDir, plan);
  const sidebarNav = buildSidebarNav(plan);
  const processDiagram = buildProcessDiagram();
  const styles = options.styles || readTemplate('styles.css');
  const scripts = options.scripts || readTemplate('scripts.js');
  const htmlTemplate = options.htmlTemplate || readTemplate('index-html-template.html');

  // Mermaid CDN dependency:
  // Note: By default, Mermaid is loaded via jsDelivr CDN (<script src="https://cdn.jsdelivr.net/.../mermaid.min.js">).
  // In offline or air-gapped environments, diagrams will display formatted raw markdown code blocks unless
  // the script tag is replaced with a locally bundled Mermaid library.
  const renderedHtml = render(htmlTemplate, {
    TITLE: `${overview.name} - Technical Specification`,
    PRODUCT_NAME: overview.name,
    TAGLINE: overview.tagline,
    VERSION: overview.version,
    GENERATED_AT: new Date().toISOString().split('T')[0],
    SIDEBAR_NAV: sidebarNav,
    PRODUCT_OVERVIEW: overview.html,
    DOC_SECTIONS: docSections,
    PROCESS_DIAGRAM: processDiagram,
    STYLE: `<style>\n${styles}\n</style>`,
    SCRIPTS: `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>\n<script>\n${scripts}\n</script>`
  });

  const knowledgeBase = assembleKnowledgeBase(kbDir);

  if (options.outDir) {
    fs.mkdirSync(options.outDir, { recursive: true });
    fs.writeFileSync(path.join(options.outDir, 'index.html'), renderedHtml, 'utf-8');
    fs.writeFileSync(path.join(options.outDir, 'knowledge-base.md'), knowledgeBase, 'utf-8');
  }

  return { html: renderedHtml, knowledgeBase };
}