# Knowledge Extraction Schema Reference

Extracted knowledge MUST be categorized into 14 files under `[OUT_DIR]/.insightify/knowledge/`:

1. `product.md`: Product name, description, target audience, value proposition, tech stack.
2. `directory-structure.md`: Feature-based modular folder tree with purpose descriptions.
3. `data-models.md`: Data models, entities, and type interfaces.
4. `component-architecture.md`: Component hierarchy, layout wrappers, UI components.
5. `state-management.md`: Global and local state stores, hooks, selectors.
6. `routing-structure.md`: Route configuration, navigation hierarchy, guards.
7. `ui-component-library.md`: Reusable UI primitives, components inventory, design tokens.
8. `api-patterns.md`: API client patterns, endpoints, hooks, request/response models.
9. `features.md`: Feature catalog, business logic, requirements.
10. `cross-cutting.md`: Shared concerns such as authentication, theming, i18n, error handling, logging.
11. `terminology.md`: Domain-specific glossary terms, acronyms, and definitions.
12. `constraints.md`: Technical limitations, version constraints, dependencies.
13. `workflows.md`: Step-by-step procedures, execution flows, user interactions.
14. `unanswered.md`: Gaps, contradictions, ambiguities, missing information.

Each file MUST contain YAML frontmatter:

```yaml
---
category: "<category_name>"
extracted_from:
  - source-001.md
confidence: "high" | "medium" | "low"
extracted_at: "YYYY-MM-DDTHH:mm:ssZ"
---
```
