---
name: insightify-review
description: Stage 5 - Evaluate generated docs across 5 quality dimensions and generate report.
---

# Stage 5: Documentation Reviewer Skill

## Instructions

1. Evaluate `docs/*` in parallel across the 5 dimensions defined in `references/review-criteria.md`.
2. Write report to `.insightify/review/review-report.md`.
3. If verdict is `changes_needed`, send specific page issues back to Stage 4 Writer.
4. If iteration reaches 3, escalate remaining issues to user.

## Scoring Rubric (per dimension, 1-5 scale)

**Accuracy** (compare against `.insightify/knowledge/*`):
- 5: All facts match knowledge base, no unsupported claims
- 3: Minor inaccuracies or missing nuances
- 1: Major factual errors or contradictions with knowledge base

**Completeness** (compare against `.insightify/plan.md`):
- 5: All planned sections present and substantive
- 3: Most sections present, some thin or missing minor content
- 1: Major planned sections missing entirely

**Consistency** (cross-page comparison):
- 5: Terminology, tone, and formatting uniform across all pages
- 3: Minor inconsistencies in naming or tone
- 1: Same concept called different names, mixed tone, inconsistent formatting

**Structure** (heading/link integrity):
- 5: Heading levels incremental, all internal links valid, no orphan pages
- 3: Minor heading level issues or 1-2 broken links
- 1: Heading hierarchy broken, multiple broken links

**Usability** (readability for target audience):
- 5: Clear code examples, approachable prose, good information flow
- 3: Adequate but could be clearer in places
- 1: Missing examples, wall-of-text, unclear instructions

## Verdict Thresholds

- `approved`: All dimensions score 3 or above, no critical issues
- `changes_needed`: Any dimension scores below 3, OR any critical issue found

## Issue Classification

- **Critical**: Factual error, missing entire planned section, broken navigation
- **Minor**: Typo, slightly inconsistent tone, suboptimal heading level

## Issue Format for Stage 4

When sending issues back to the Writer, format each as:

```markdown
### Issue: [Short description]
- **Page:** `docs/[filename].md`
- **Dimension:** [Accuracy|Completeness|Consistency|Structure|Usability]
- **Severity:** [Critical|Minor]
- **Issue:** [Description of what's wrong]
- **Suggestion:** [How to fix it]
```
