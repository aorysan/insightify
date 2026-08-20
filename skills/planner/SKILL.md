---
name: planner
description: Stage 1-3 - Ingest sources, extract knowledge, and generate documentation plan with user approval.
---

# Planner Skill (Ingest → Extract → Plan)

## Instructions

### Phase 1: Ingest (from former insightify-ingest)

1. Accept input files or URLs from parameters or prompt.
2. For each source, execute the appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `[OUT_DIR]/.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `[OUT_DIR]/.insightify/sources/manifest.md`.

**Supported Input Types:**

| Extension | Parser | Notes |
|-----------|--------|-------|
| `.html`, `.htm` | `parsers/html-parser.js` | Strips nav/footer/scripts, preserves content structure |
| `.js`, `.ts`, `.py`, `.java`, `.go`, `.rs`, `.rb`, `.php`, `.c`, `.cpp`, `.cs` | `parsers/code-parser.js` | Extracts JSDoc/docstrings; falls back to raw code |
| `.pdf` | `parsers/pdf-parser.js` | Binary buffer input via `pdf-parse` |
| `.md`, `.txt`, `.rst` | Direct copy | Copy content as-is with frontmatter added |
| URLs (`http://`, `https://`) | Fetch → HTML parser | Fetch page, then process as HTML |
| Other extensions | Skip | Log warning, mark as `skipped` in manifest |

**URL Fetching:** Timeout 30s, 1 retry on 5xx, User-Agent `Insightify/1.0`.
**File Size Limits:** >5MB warning, >20MB skip as `file_too_large`.

**Normalized Output Frontmatter:**
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

Content headings normalized to start at H2 (`##`). Manifest format: table with Source ID, Path, Type, Status, Words.

### Phase 2: Extract (from former insightify-extract)

1. Read all `[OUT_DIR]/.insightify/sources/*.md` files.
2. For each category in `references/extraction-schema.md`, analyze sources and extract structured facts.
3. Include blockquote source citations (`> **Source:** source-XXX.md § Section Name`) for every fact.
4. Write output to `[OUT_DIR]/.insightify/knowledge/`.

**Conflict Handling:** Keep both facts, flag in `unanswered.md`.
**Confidence:** `high` (explicit), `medium` (inferred), `low` (ambiguous).
**Edge Cases:** Uncategorized → `unanswered.md`; thin sources → min `product.md` + `unanswered.md`; empty → skip, log.

**Citation Format:**
```markdown
The API supports up to 1000 concurrent connections.

> **Source:** source-003.md § API Limits
```

### Phase 3: Plan (from former insightify-plan)

1. Read `[OUT_DIR]/.insightify/knowledge/*.md`.
2. Generate plan using `templates/plan-template.md`.
3. Display summary:
   ```
   📝 Documentation Plan: [Project Name]
   🎯 Audience: [Primary & Secondary]
   📄 Pages: [Total count, breakdown by priority]
   🔄 Dependencies: [Number of waves]
   📊 Est. words: [Estimation]
   ```
4. Ask approval: "Approve plan? [Y/n/revise]"
   - Y/Enter → save as `approved`, proceed (plan frontmatter: `status: approved`)
   - n → exit, save as `rejected`
   - revise → prompt "What changes?", regenerate, loop (max 3 cycles). Max 3 revision cycles.

**Page Sizing:** 500–2000 words ideal; >3000 split; <300 merge.
**Merge when:** same audience, one topic <300 words.
**Split when:** distinct audiences, >3000 words, mixed conceptual/reference.
**Priority:** high (getting started, core), medium (features), low (API, FAQ).
**Dependency Graph:** No cycles; max 3 waves; wave 1 = standalone; max 2 deps/page.

### Progress & Error Handling

- Ingest: `⏳ Ingesting: [===----] X/Y sources`; partial failure → log `failed`, continue.
- Extract: `⏳ Extracting: [======-] X/Y categories`; category failure → empty file, note in `unanswered.md`.
- Plan: `⏳ Planning: generating plan...`; no response 5min → re-prompt; 10min → save as `draft`, exit.
