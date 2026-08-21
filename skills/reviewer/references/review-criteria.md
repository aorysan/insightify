# Documentation Review Criteria (7 Dimensions)

1. **Accuracy**: Compare `[OUT_DIR]/docs/markdown/*` against `[OUT_DIR]/.insightify/knowledge/*`. All claims must match knowledge facts.
2. **Completeness**: Compare `[OUT_DIR]/docs/markdown/*` against `[OUT_DIR]/.insightify/plan.md`. All planned sections must be present.
3. **Consistency**: Terminology, tone, formatting must be uniform across all `[OUT_DIR]/docs/markdown/*`.
4. **Structure**: Heading levels must be incremental (H1 -> H2 -> H3). Links between pages must be valid.
5. **Usability**: Clear code examples, readable prose targeted to the intended audience.
6. **Type Safety**: TypeScript interfaces valid, no `any` without justification, strict mode compatible, generics properly used.
7. **Architecture Alignment**: Matches reference artifact patterns — feature-based modular React, Zustand with persist/immer/devtools, React Router v6 with layout-driven routing and guards, TanStack Query v5 custom hooks, Tailwind CSS with design tokens and CVA variants.

Report Verdicts:
- `approved`: All 7 dimensions ≥3, no critical issues.
- `changes_needed`: Any dimension <3 OR any critical issue.

Safety Valve:
- Max 3 iteration loops. After 3 loops, escalate remaining issues to user.

## Scoring Rubric (1-5 per dimension)

**Accuracy** (vs knowledge base):
- 5: All facts match, no unsupported claims
- 3: Minor inaccuracies or missing nuances
- 1: Major factual errors or contradictions

**Completeness** (vs plan):
- 5: All planned sections present and substantive
- 3: Most sections present, some thin
- 1: Major planned sections missing

**Consistency** (cross-page):
- 5: Terminology, tone, formatting uniform
- 3: Minor inconsistencies
- 1: Same concept different names, mixed tone, inconsistent formatting

**Structure** (heading/link integrity):
- 5: Heading levels incremental, all internal links valid, no orphans
- 3: Minor heading issues or 1-2 broken links
- 1: Heading hierarchy broken, multiple broken links

**Usability** (readability):
- 5: Clear code examples, approachable prose, good flow
- 3: Adequate but could be clearer
- 1: Missing examples, wall-of-text, unclear instructions

**Type Safety** (TypeScript correctness):
- 5: All interfaces valid, no `any` without justification, strict mode compatible
- 3: Minor type issues, some `any` with comments
- 1: Major type errors, missing generics, broken interfaces

**Architecture Alignment** (matches reference artifact patterns):
- 5: Follows all patterns (Zustand, TanStack Query, React Router v6, Tailwind, feature-based)
- 3: Most patterns followed, minor deviations
- 1: Major pattern violations, wrong architecture
