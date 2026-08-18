---
name: insightify-ingest
description: Stage 1 - Ingest input files and URLs, normalize content to Markdown, and build manifest.
---

# Stage 1: Source Ingestion Skill

## Instructions

1. Accept input files or URLs from parameters or prompt.
2. For each source, execute the appropriate parser (HTML, Code, PDF, or Markdown/Text direct copy).
3. Generate normalized `.insightify/sources/source-XXX.md` with YAML metadata frontmatter.
4. Write master source index `.insightify/sources/manifest.md`.

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

Each entry in `.insightify/sources/manifest.md` should include:

```markdown
| Source ID | Path | Type | Status | Words |
|-----------|------|------|--------|-------|
| source-001 | ./src/main.js | code | success | 543 |
| source-002 | https://example.com | url | failed | 0 |
```

Status values: `success`, `failed`, `skipped`
