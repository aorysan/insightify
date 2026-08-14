# Knowledge Extraction Schema Reference

Extracted knowledge MUST be categorized into 7 files under `.insightify/knowledge/`:

1. `product.md`: Product name, description, audience, value prop.
2. `features.md`: List of features, descriptions, and citations.
3. `terminology.md`: Domain-specific glossary terms and definitions.
4. `api.md`: Endpoints, methods, parameters, request/response formats.
5. `workflows.md`: Step-by-step user procedures.
6. `constraints.md`: Technical limitations, dependencies, requirements.
7. `unanswered.md`: Unclear items, missing details, contradictions.

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
