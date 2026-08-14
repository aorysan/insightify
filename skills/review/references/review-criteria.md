# Documentation Review Criteria (5 Dimensions)

1. **Accuracy**: Compare `docs/*` against `.insightify/knowledge/*`. All claims must match knowledge facts.
2. **Completeness**: Compare `docs/*` against `.insightify/plan.md`. All planned sections must be present.
3. **Consistency**: Terminology, tone, formatting must be uniform across all `docs/*`.
4. **Structure**: Heading levels must be incremental (H1 -> H2 -> H3). Links between pages must be valid.
5. **Usability**: Clear code examples, readable prose targeted to the intended audience.

Report Verdicts:
- `approved`: Zero critical or major issues.
- `changes_needed`: Issues present (requires targeted rewrite by Stage 4).

Safety Valve:
- Max 3 iteration loops. After 3 loops, escalate remaining issues to user.
