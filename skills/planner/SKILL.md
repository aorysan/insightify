---
name: insightify-planner
description: Stage 1+2 - Ingest sources, extract knowledge, and generate documentation plan.
---

# Insightify Planner Skill

This skill combines the ingestion, knowledge extraction, and planning stages into a unified planner.

## Instructions

### Phase 1: Source Ingestion
1. Accept input files or URLs from parameters or prompt.
2. For each source, execute the appropriate parser (`parsers/html-parser.js`, `parsers/code-parser.js`, `parsers/pdf-parser.js`).
3. Generate normalized `[OUT_DIR]/.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `[OUT_DIR]/.insightify/sources/manifest.md`.

### Phase 2: Knowledge Extraction
5. Read all `[OUT_DIR]/.insightify/sources/*.md` files.
6. For each category defined in `references/extraction-schema.md`, analyze sources and extract structured facts.
7. Include blockquote source citations (`> **Source:** source-XXX.md § Section Name`) for every extracted fact.
8. Write output files to `[OUT_DIR]/.insightify/knowledge/`.

### Phase 3: Documentation Planning
9. Read `[OUT_DIR]/.insightify/knowledge/*.md`.
10. Generate documentation plan using `templates/plan-template.md`.
11. Display a concise summary of the generated plan to the user:
    ```
    📝 Documentation Plan: [Project Name]
    🎯 Audience: [Primary & Secondary]
    📄 Pages: [Total count, breakdown by priority]
    🔄 Dependencies: [Number of waves]
    📊 Est. words: [Estimation]
    ```
12. Ask for explicit user approval using this prompt: "Approve plan? [Y/n/revise]"
    - If `Y`/`y`/Enter: Save plan to `[OUT_DIR]/.insightify/plan.md` with `status: approved` and proceed.
    - If `n`: Exit pipeline, save plan as `rejected`.
    - If `revise`: Prompt "What changes? (e.g., 'add FAQ page', 'merge API pages')". Re-generate plan based on feedback, and loop back to Step 11.
13. Max 3 revision cycles. On the 4th cycle, ask the user to force approval or exit.

## Supported Input Types

| Extension | Parser | Notes |
|-----------|--------|-------|
| `.html`, `.htm` | `parsers/html-parser.js` | Strips nav/footer/scripts, preserves content structure |
| `.js`, `.ts`, `.py`, `.java`, `.go`, `.rs`, `.rb`, `.php`, `.c`, `.cpp`, `.cs` | `parsers/code-parser.js` | Extracts JSDoc/docstrings; falls back to raw code |
| `.pdf` | `parsers/pdf-parser.js` | Binary buffer input via `pdf-parse` |
| `.md`, `.txt`, `.rst` | Direct copy | Copy content as-is with frontmatter added |
| URLs (`http://`, `https://`) | Fetch → HTML parser | Fetch page, then process as HTML |
| Other extensions | Skip | Log warning, mark as `skipped` in manifest |

## URL Fetching

- Timeout: 30 seconds per request
- Retry: 1 retry on failure (timeout or HTTP 5xx)
- User-Agent: `Insightify/1.0`
- On permanent failure (4xx or second failure): mark as `failed` in manifest, continue pipeline

## File Size Limits

- Files > 5MB: log a warning but process normally
- Files > 20MB: skip and mark as `skipped` in manifest with reason `"file_too_large"`

## Normalized Output Format

Each source file should have this frontmatter:

```yaml
---
source_id: "source-001"
original_path: "path/to/file.js"
type: "code"
parser: "code-parser"
status: "success"
ingested_at: "YYYY-MM-DDTHH:mm:ssZ"
word_count: 1234
---
```

Content headings should be normalized to start at H2 (`##`) — reserve H1 for the source title.

## Manifest Format

Each entry in `[OUT_DIR]/.insightify/sources/manifest.md` should include:

```markdown
| Source ID | Path | Type | Status | Words |
|-----------|------|------|--------|-------|
| source-001 | ./src/main.js | code | success | 543 |
| source-002 | https://example.com | url | failed | 0 |
```

Status values: `success`, `failed`, `skipped`

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

## Page Sizing Guidance

- Ideal page length: 500–2000 words
- If a page would exceed 3000 words, split it into sub-pages
- Very short pages (< 300 words) should be merged with related content

## When to Merge vs Split

- **Merge** when: two topics share the same audience and one topic is < 300 words
- **Split** when: a page covers two distinct audiences, or exceeds 3000 words, or mixes conceptual/reference content

## Priority Assignment

- `high`: Getting started, installation, core concepts — pages every user needs
- `medium`: Feature guides, detailed workflows — pages most users need
- `low`: API reference, troubleshooting, FAQ — pages some users need

## Dependency Graph Rules

- No circular dependencies between pages
- Aim for max 3 writing waves — if more are needed, re-evaluate page boundaries
- Wave 1 should contain all standalone pages (no dependencies)
- Each page should depend on at most 2 other pages