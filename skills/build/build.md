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
