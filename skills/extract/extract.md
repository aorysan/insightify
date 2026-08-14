---
name: insightify-extract
description: Stage 2 - Read normalized sources and extract product knowledge into structured categories.
---

# Stage 2: Knowledge Extraction Skill

## Instructions
1. Read all `.insightify/sources/*.md` files.
2. For each category defined in `references/extraction-schema.md`, analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md`) for every extracted fact.
4. Write output files to `.insightify/knowledge/`.
