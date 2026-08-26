# Knowledge Extraction Schema Reference

Extracted knowledge MUST be categorized into archetype-specific files under `[OUT_DIR]/.insightify/knowledge/` (up to 17 for `frontend-spa`; see planner SKILL.md Phase 0):

1. `product.md`: Product name, description, target audience, value proposition, tech stack.
2. `directory-structure.md`: Feature-based modular folder tree with purpose descriptions.
3. `modularization.md`: Module boundaries, public interfaces, dependency direction, reuse patterns.
4. `data-models.md`: Data models, entities, and type interfaces.
5. `component-architecture.md`: Component hierarchy, layout wrappers, UI components.
6. `state-management.md`: Global and local state stores, hooks, selectors.
7. `routing-structure.md`: Route configuration, navigation hierarchy, guards.
8. `ui-component-library.md`: Reusable UI primitives, components inventory, design tokens.
9. `api-patterns.md`: API client patterns, endpoints, hooks, request/response models.
10. `features.md`: Feature catalog, business logic, requirements.
11. `user-journeys.md`: Personas, end-to-end task flows, touchpoints across features.
12. `business-policies.md`: Business rules, validation policies, SLAs, compliance requirements.
13. `cross-cutting.md`: Shared concerns such as authentication, theming, i18n, error handling, logging.
14. `terminology.md`: Domain-specific glossary terms, acronyms, and definitions.
15. `constraints.md`: Technical limitations, version constraints, dependencies.
16. `workflows.md`: Step-by-step procedures, execution flows, user interactions.
17. `unanswered.md`: Gaps, contradictions, ambiguities, missing information.

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
