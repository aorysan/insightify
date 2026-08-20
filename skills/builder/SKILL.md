---
name: insightify-builder
description: Stage 5 - Transform docs for VitePress, generate site config, and finalize Knowledge Base.
---

# Insightify Builder Skill

This skill transforms markdown documentation into a VitePress-ready site.

## Instructions

1. Transform `[OUT_DIR]/docs/*` frontmatter into VitePress format.
2. Generate `[OUT_DIR]/.vitepress/config.js` from `templates/vitepress-config.js` and plan dependency graph.
3. Generate root `index.md` hero page from `templates/index-template.md`.
4. Create root `[OUT_DIR]/package.json` with VitePress devDependencies — see **Output `[OUT_DIR]/package.json`** below for the exact contents (`"type": "module"` required).
5. Copy `[OUT_DIR]/.insightify/knowledge/*` to `[OUT_DIR]/knowledge-base/`.
6. Perform validation (no broken links, no orphan pages).
7. Print completion summary and instructions (`npm install` then `npm run docs:dev`).

## VitePress Frontmatter Transformation

Add VitePress-specific fields to each page's frontmatter:
- `outline: [2, 3]` — show H2 and H3 in the sidebar outline
- `aside: true` — enable the right-side aside panel

Preserve existing fields (`title`, `description`, `audience`, `sources`).

## Sidebar Generation

Build sidebar structure from the documentation plan:
- Group pages by their dependency wave or logical section
- Top-level items: Getting Started, Guides, API Reference, FAQ/Troubleshooting
- Nested items: individual pages under each group
- Order: follow the writing wave order from the plan

## Nav Generation

Generate top navigation from the highest-priority pages:
- Include links to: Getting Started, main guide sections, API Reference
- Keep nav items to 5 or fewer

## Output `[OUT_DIR]/package.json`

The generated `[OUT_DIR]/package.json` (in the output project, not the plugin) should include:

```json
{
  "name": "docs",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "docs:dev": "vitepress dev .",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview ."
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
```

> **Important:** `"type": "module"` is **required** — do not omit it. The generated `[OUT_DIR]/.vitepress/config.js` uses ESM syntax (`import { defineConfig } from 'vitepress'`). Without `"type": "module"`, VitePress loads the config as CommonJS and fails with `ESM file cannot be loaded by require` for the ESM-only `vitepress` package. This is the single most common "why won't it run?" failure after generation.

## Validation Checklist

Before printing the completion summary, verify:
- [ ] All internal links in `[OUT_DIR]/docs/*` resolve to existing files
- [ ] No orphan pages (every page is reachable from sidebar or another page)
- [ ] Every page has `title` and `description` in frontmatter (except `index.md`, the `layout: home` hero)
- [ ] `index.md` hero page has correct links to existing pages
- [ ] `[OUT_DIR]/.vitepress/config.js` references only pages that exist
- [ ] `[OUT_DIR]/package.json` includes `"type": "module"` (without it, VitePress fails to load the ESM config)

If validation fails, log warnings but do not block — report issues in the completion summary.

## Completion Summary

Print:
```
✅ Insightify Build Complete!
📁 Output: [OUT_DIR]/docs/ (X pages)
📚 Knowledge Base: [OUT_DIR]/knowledge-base/ (Y files)
⚙️  Config: [OUT_DIR]/.vitepress/config.js

To preview:
  npm install
  npm run docs:dev

⚠️  Warnings: [list any validation issues]
```