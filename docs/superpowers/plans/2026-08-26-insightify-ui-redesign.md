# Insightify UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the `insightify` generated HTML UI to match the clean, card-based, minimal-text aesthetic of Claude Artifacts.

**Architecture:** Modifies the plugin's CSS (`styles.css`) to introduce artifact layout primitives (cards, grid, badges, CSS numbered headings) and updates the HTML shell (`index-html-template.html`). Modifies the `writer` skill prompt to instruct the LLM to output dense data via HTML container classes rather than raw markdown prose.

**Tech Stack:** HTML/CSS (Vanilla), Markdown

## Global Constraints

- Retain the floating Table of Contents (TOC) on the side.
- Implement both Light and Dark mode styling.
- Use `Inter` font for typography.
- Rely on CSS counters for section numbering to avoid LLM numbering drift.

---

### Task 1: Update CSS Styles and Variables

**Files:**
- Modify: `d:\AryokPunya\Magang\insight\.claude\plugins\insightify\skills\builder\templates\styles.css`

**Interfaces:**
- Consumes: Existing CSS tokens
- Produces: Updated CSS file with new artifact classes and dark mode tokens.

- [ ] **Step 1: Update Global Tokens**
Replace the `--color-bg`, `--color-surface` and their dark mode equivalents to match the Claude Artifact design (off-white light mode, pure black background in dark mode).

```css
/* In light theme root */
--color-bg: #f9f9f7;
--color-surface: #ffffff;
--color-border: #e5e7eb;

/* In dark theme root */
--color-bg: #0b0b0b;
--color-surface: #1a1a19;
--color-border: rgba(255, 255, 255, 0.1);
```

- [ ] **Step 2: Add Artifact Utility Classes**
Add CSS for grids, cards, and badges.

```css
/* --- Artifact Primitives --- */
.artifact-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.artifact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.artifact-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
```

- [ ] **Step 3: Auto-Numbering for Section Headers**
Use CSS counters to number `h2` elements.

```css
.doc-content {
  counter-reset: section;
}

.doc-section h2::before {
  counter-increment: section;
  content: counter(section, decimal-leading-zero) " ";
  color: var(--color-info);
  font-size: 0.75em;
  margin-right: var(--spacing-sm);
}
```

---

### Task 2: Update HTML Template Structure

**Files:**
- Modify: `d:\AryokPunya\Magang\insight\.claude\plugins\insightify\skills\builder\templates\index-html-template.html`

**Interfaces:**
- Consumes: Existing Handlebars-like syntax
- Produces: Updated HTML shell that centers content.

- [ ] **Step 1: Wrap Content in Container**
Modify `.doc-content` layout or add an `.artifact-container` to limit the reading width and center it, making it look more like a standalone artifact pane.

```html
<!-- Inside .content-wrapper, wrap the article content -->
<article class="doc-content artifact-container" style="max-width: 850px; margin: 0 auto;">
  <!-- Product Overview -->
```

---

### Task 3: Update LLM Writer Prompt

**Files:**
- Modify: `d:\AryokPunya\Magang\insight\.claude\plugins\insightify\skills\writer\SKILL.md`

**Interfaces:**
- Consumes: Original prompt logic
- Produces: LLM prompt forcing card/grid HTML structures.

- [ ] **Step 1: Update Formatting Rules**
Add explicit instructions under `## Content Structure` or create a new `## Artifact Formatting` section instructing the LLM to output HTML tags for cards instead of plain paragraphs.

```markdown
## Artifact Formatting (CRITICAL)

- **Do NOT write long, sequential prose paragraphs.** Use high-density, scannable layouts.
- **Use HTML Structure:** You MUST wrap logical groupings of content inside `<div class="artifact-card">` elements.
- **Use Grids:** For features, architectures, or step-by-step processes, use `<div class="artifact-grid">` to display items side-by-side.
- **Use Badges:** For small metadata like status, version, or method type (GET/POST), use `<span class="artifact-badge">`.
- **Example Usage:**
  <div class="artifact-card">
    <h3>Authentication</h3>
    <div class="artifact-grid">
      <div><span class="artifact-badge">Method</span> OAuth2</div>
      <div><span class="artifact-badge">Scope</span> read/write</div>
    </div>
  </div>
```
