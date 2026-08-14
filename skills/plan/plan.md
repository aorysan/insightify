---
name: insightify-plan
description: Stage 3 - Analyze knowledge base and design documentation plan with user approval.
---

# Stage 3: Documentation Planner Skill

## Instructions
1. Read `.insightify/knowledge/*.md`.
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
   - If `Y`/`y`/Enter: Save plan to `.insightify/plan.md` with `status: approved` and proceed.
   - If `n`: Exit pipeline, save plan as `rejected`.
   - If `revise`: Prompt "What changes? (e.g., 'add FAQ page', 'merge API pages')". Re-generate plan based on feedback, and loop back to Step 3.
5. Max 3 revision cycles. On the 4th cycle, ask the user to force approval or exit.
