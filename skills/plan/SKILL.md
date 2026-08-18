---
name: insightify-plan
description: Stage 3 - Analyze knowledge base and design documentation plan with user approval.
---

# Stage 3: Documentation Planner Skill

## Instructions

1. Read `[OUT_DIR]/.insightify/knowledge/*.md`.
2. Generate documentation plan using `templates/plan-template.md`.
3. Display a concise summary of the generated plan to the user:
   ```
   📝 Documentation Plan: [Project Name]
   🎯 Audience: [Primary & Secondary]
   📄 Pages: [Total count, breakdown by priority]
   🔄 Dependencies: [Number of waves]
   📊 Est. words: [Estimation]
   ```
4. Ask for explicit user approval using this prompt: "Approve plan? [Y/n/revise]"
   - If `Y`/`y`/Enter: Save plan to `[OUT_DIR]/.insightify/plan.md` with `status: approved` and proceed.
   - If `n`: Exit pipeline, save plan as `rejected`.
   - If `revise`: Prompt "What changes? (e.g., 'add FAQ page', 'merge API pages')". Re-generate plan based on feedback, and loop back to Step 3.
5. Max 3 revision cycles. On the 4th cycle, ask the user to force approval or exit.

## Page Sizing Guidance

- Ideal page length: 500–2000 words
- If a page would exceed 3000 words, split it into sub-pages
- Very short pages (< 300 words) should be merged with related content

## When to Merge vs Split

- **Merge** when: two topics share the same audience and one topic is < 300 words
- **Split** when: a page covers two distinct audiences, or exceeds 3000 words, or mixes conceptual/reference content

## Priority Assignment

- `high`: Getting started, installation, core concepts — pages every user needs
- `medium`: Feature guides, detailed workflows — pages most users need
- `low`: API reference, troubleshooting, FAQ — pages some users need

## Dependency Graph Rules

- No circular dependencies between pages
- Aim for max 3 writing waves — if more are needed, re-evaluate page boundaries
- Wave 1 should contain all standalone pages (no dependencies)
- Each page should depend on at most 2 other pages
