---
name: writer
description: Stage 4 - Execute documentation plan by generating markdown docs in waves.
---

# Writer Skill

## Instructions

1. Read `[OUT_DIR]/.insightify/plan.md` to get page list and writing order waves.
2. For each wave, generate pure markdown pages under `[OUT_DIR]/docs/markdown/` using templates in `templates/`.
3. Read `[OUT_DIR]/.insightify/knowledge/*.md` and previous wave pages for cross-referencing.
4. Display summary to user for post-write review.
5. Handle targeted page revisions if requested by user.

## Writing Style

- Tone: technical but approachable
- Person: second person ("you") for instructions, third person for concepts
- Voice: active voice preferred ("Run the command" not "The command should be run")
- Avoid jargon without explanation — if a term is in `knowledge/terminology.md`, link or define it on first use

## Content Structure

- H1 (`#`): Reserved for the page title (set in frontmatter `title` field, not in body)
- Content starts at H2 (`##`)
- Heading levels incremental: H2 → H3 → H4, never skip levels

## Cross-References

- Use relative markdown links: `[Getting Started](./getting-started.md)`
- Only link to pages that exist in the plan — do not create phantom references
- Section reference: `[Authentication](./api-reference.md#authentication)`

## Code Examples

- Every API endpoint: at least one request/response example
- Every workflow: step-by-step code or command example
- Fenced code blocks with language tags: ` ```js `, ` ```bash `, etc.

## Template Selection

| Page Type | Template |
|-----------|----------|
| API documentation | `templates/api-template.md` |
| Guide/tutorial | `templates/guide-template.md` |
| FAQ/troubleshooting | `templates/faq-template.md` |
| Other | `templates/guide-template.md` (default) |