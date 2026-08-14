---
name: insightify-ingest
description: Stage 1 - Ingest input files and URLs, normalize content to Markdown, and build manifest.
---

# Stage 1: Source Ingestion Skill

## Instructions
1. Accept input files or URLs from parameters or prompt.
2. For each source, execute appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `.insightify/sources/manifest.md`.
