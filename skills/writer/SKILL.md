---
name: writer
description: Stage 2 - Execute documentation plan by generating 14 markdown docs in 5 dependency-aware waves.
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

## Template Selection (14 Templates for 14 Pages)

| Page | Template | Knowledge Categories |
|------|----------|---------------------|
| 1. Executive Summary | `templates/executive-summary-template.md` | product, features, cross-cutting |
| 2. Directory Structure | `templates/directory-structure-template.md` | directory-structure |
| 3. Global Data Models | `templates/data-models-template.md` | data-models, api-patterns |
| 4. Component Architecture | `templates/component-architecture-template.md` | component-architecture, ui-component-library |
| 5. State Management | `templates/state-management-template.md` | state-management |
| 6. Routing & Layout | `templates/routing-structure-template.md` | routing-structure, component-architecture |
| 7. UI Component Library | `templates/ui-component-library-template.md` | ui-component-library |
| 8. API Patterns | `templates/api-patterns-template.md` | api-patterns, data-models |
| 9. Features & Business Logic | `templates/features-template.md` | features, workflows |
| 10. Cross-Cutting Concerns | `templates/cross-cutting-template.md` | cross-cutting |
| 11. Terminology & Glossary | `templates/terminology-template.md` | terminology |
| 12. Constraints & Limitations | `templates/constraints-template.md` | constraints, unanswered |
| 13. Workflows & Procedures | `templates/workflows-template.md` | workflows |
| 14. Appendix | `templates/appendix-template.md` | all |

## Wave Execution Order

**Wave 1 (Independent):**
- 1. Executive Summary
- 2. Directory Structure
- 3. Global Data Models
- 11. Terminology & Glossary
- 12. Constraints & Limitations

**Wave 2 (Depends on Wave 1):**
- 4. Component Architecture (depends on 2)
- 5. State Management (depends on 3)
- 7. UI Component Library (depends on 2)

**Wave 3 (Depends on Wave 2):**
- 6. Routing & Layout Structure (depends on 4)
- 8. API Interaction Patterns (depends on 3)

**Wave 4 (Depends on Waves 2-3):**
- 9. Features & Business Logic (depends on 3, 4, 5)
- 10. Cross-Cutting Concerns (depends on 5, 6)
- 13. Workflows & Procedures (depends on 4, 5, 8)

**Wave 5 (Depends on All Prior):**
- 14. Appendix (depends on all prior pages)