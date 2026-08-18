---
name: insightify-build
description: Stage 6 - Transform docs for VitePress, generate site config, and finalize Knowledge Base.
---

# Stage 6: Documentation Builder Skill

## Instructions

1. Transform `docs/*` frontmatter into VitePress format.
2. Generate `.vitepress/config.js` from `templates/vitepress-config.js` and plan dependency graph.
3. Generate root `index.md` hero page from `templates/index-template.md`.
4. Create root `package.json` with VitePress devDependencies.
5. Copy `.insightify/knowledge/*` to `knowledge-base/`.
6. Perform validation (no broken links, no orphan pages).
7. Print completion summary and instructions (`npm run dev`).

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

## Output `package.json`

The generated `package.json` (in the output project, not the plugin) should include:

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
```

## Validation Checklist

Before printing the completion summary, verify:
- [ ] All internal links in `docs/*` resolve to existing files
- [ ] No orphan pages (every page is reachable from sidebar or another page)
- [ ] Every page has `title` and `description` in frontmatter
- [ ] `index.md` hero page has correct links to existing pages
- [ ] `.vitepress/config.js` references only pages that exist

If validation fails, log warnings but do not block — report issues in the completion summary.

## Completion Summary

Print:
```
✅ Insightify Build Complete!
📁 Output: ./docs/ (X pages)
📚 Knowledge Base: ./knowledge-base/ (Y files)
⚙️  Config: .vitepress/config.js

To preview:
  npm install
  npm run docs:dev

⚠️  Warnings: [list any validation issues]
```
