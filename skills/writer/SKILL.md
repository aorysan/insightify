---
name: writer
description: Stage 2 - Execute documentation plan by generating a single comprehensive markdown document.
---

# Writer Skill

## Instructions

1. Read `[OUT_DIR]/.insightify/plan.md` to get document structure, sections, and topics.
2. Read extracted knowledge categories in `[OUT_DIR]/.insightify/knowledge/*.md` for source facts, citations, and context.
3. Generate a single comprehensive markdown document at `[OUT_DIR]/docs/markdown/documentation.md` based on `plan.md`.
4. Display summary to user for post-write review (total word count, section count, diagram count).
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
