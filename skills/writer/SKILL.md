---
name: writer
description: Stage 2 - Execute documentation plan by generating markdown docs in dependency-aware waves based on detected archetype.
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
- Mermaid diagrams for architecture, flow, state machines

## Template Selection (5 Base Templates)

Use the following 5 base templates mapped from the extracted categories:

| Base Template | Description | Extracted Category Mappings (Examples) |
|---------------|-------------|----------------------------------------|
| `templates/overview-template.md` | High-level summaries and concepts | product, features, terminology |
| `templates/catalog-template.md` | Inventories and component lists | ui-component-library, features |
| `templates/architecture-template.md` | System design and structures | directory-structure, component-architecture, state-management, routing-structure |
| `templates/reference-template.md` | API, data models, workflows | data-models, api-patterns, workflows, cross-cutting |
| `templates/appendix-template.md` | Supplementary and constraints | constraints, unanswered, appendix |

## Wave Execution Order

Follow the dynamic wave execution order specified in `[OUT_DIR]/.insightify/plan.md`. The exact pages and waves will depend on the detected project archetype.