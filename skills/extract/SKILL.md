---
name: insightify-extract
description: Stage 2 - Read normalized sources and extract product knowledge into structured categories.
---

# Stage 2: Knowledge Extraction Skill

## Instructions

1. Read all `[OUT_DIR]/.insightify/sources/*.md` files.
2. For each category defined in `references/extraction-schema.md`, analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md § Section Name`) for every extracted fact.
4. Write output files to `[OUT_DIR]/.insightify/knowledge/`.

## Handling Conflicts Between Sources

When two sources provide contradictory information:
- Keep both facts in the relevant knowledge file
- Flag the contradiction in `unanswered.md` with references to both sources
- Example: `> ⚠️ Conflict: source-001 says max 100 users, source-003 says max 500 users`

## Confidence Scoring

Assign confidence to each extracted fact in the YAML frontmatter:
- `high`: Fact is explicitly and clearly stated in source material
- `medium`: Fact is inferred from context or implied by multiple sources
- `low`: Fact is ambiguous, mentioned only once, or from a low-quality source

## Edge Cases

- **Source doesn't fit any category:** Note it in `unanswered.md` with a suggested category name
- **Very thin sources:** Always produce at minimum `product.md` (even with basic info) and `unanswered.md` (listing what's missing)
- **Empty source files:** Skip, log a note in `unanswered.md`

## Citation Format

Every extracted fact should include a blockquote citation:

```markdown
The API supports up to 1000 concurrent connections.

> **Source:** source-003.md § API Limits
```

The `§` symbol references the section within the source where the fact was found.
