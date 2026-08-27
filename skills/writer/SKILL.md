---
name: writer
description: Stage 2 - Execute documentation plan by generating a single comprehensive markdown document.
---

# Writer Skill

## Instructions

1. Read `[OUT_DIR]/.insightify/plan.md` to get document structure, sections, and topics.
2. Read extracted knowledge categories in `[OUT_DIR]/.insightify/knowledge/*.md` for source facts, citations, and context.
3. Assign sub-agents to render sections/parts of the document independently in parallel based on the plan.
4. Once all sections are rendered, stitch them together into a single comprehensive markdown document at `[OUT_DIR]/docs/markdown/documentation.md`.
5. Display summary to user for post-write review (total word count, section count, diagram count).
5. Handle targeted revisions if requested by user.

## Writing Style

- Tone: technical but approachable
- Person: second person ("you") for instructions, third person for concepts
- Voice: active voice preferred ("Run the command" not "The command should be run")
- Avoid jargon without explanation — if a term is in `knowledge/terminology.md`, link or define it on first use

## Content Structure

- H1 (`#`): Reserved for the document title at the top of the file
- Content sections start at H2 (`##`) corresponding to the planned sections
- Heading levels incremental: H2 → H3 → H4, never skip levels
- Feature / sub-section headings: H3 = feature or sub-section title, H4 = detail sections; never skip levels

## Artifact HTML Formatting

- High information density: no long prose paragraphs or bullet walls. Every paragraph is at most 3 sentences. Optimize for scannability with short paragraphs, cards, grids, and tables.
- Use structural HTML wrappers for dense, enumerable information (architecture components, API endpoint lists, process steps, configuration options):
  - `<div class="grid-2">...</div>` and `<div class="grid-3">...</div>` as layout wrappers containing two/three columns of cards
  - `<div class="artifact-card">...</div>` for each discrete item inside a grid (title in bold or H4, then a 1–2 sentence description)
  - `<span class="badge">LABEL</span>` for small labels such as HTTP methods, statuses, versions
  - `<div class="status-indicator">TEXT</div>` for state/health lists, with modifiers `status-warning` and `status-error` (e.g., `<div class="status-indicator status-error">Deprecated</div>`)
- **Hard rule — raw HTML only inside wrappers:** Within `grid-*`, `artifact-card`, `badge`, and `status-indicator` wrappers, use raw HTML only (`<strong>`, `<h4>`, plain text). Markdown syntax will not be rendered inside these raw HTML elements (marked emits literal asterisks for `**bold**`, etc.) — never nest markdown syntax in them.
- Markdown stays the default for narrative flow; interleave the HTML wrappers above where structure beats prose — instead of raw markdown tables or bullet lists where appropriate.
- These classes are styled by the Builder CSS; do not invent other class names.
- Section heading numbers (`01`, `02`, ...) are added automatically by CSS counters — never hardcode them into headings.

## Cross-References

- Use section anchor links: `[Section Title](#section-title)`
- Only link to sections that exist in the document — do not create phantom references

## Code Examples

- Every API endpoint: at least one request/response example
- Every workflow: step-by-step code or command example
- Fenced code blocks with language tags: ` ```js `, ` ```bash `, etc.
- Mermaid diagrams (fenced with ` ```mermaid ` language tag):
  - Every user journey/workflow section: at least one ` ```mermaid flowchart ` showing steps and decision points
  - State machine/entity lifecycle documentation: ` ```mermaid stateDiagram ` covering all states and transitions
