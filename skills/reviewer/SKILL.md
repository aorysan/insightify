---
name: reviewer
description: Stage 5 - Evaluate generated docs across 5 quality dimensions and generate report.
---

# Reviewer Skill

## Instructions

1. Evaluate `[OUT_DIR]/docs/markdown/*` in parallel across 5 dimensions in `references/review-criteria.md`.
2. Write report to `[OUT_DIR]/.insightify/review/review-report.md`.
3. If verdict is `changes_needed`, send specific page issues back to Writer.
4. If iteration reaches 3, escalate remaining issues to user.

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

## Verdict Thresholds

- `approved`: All dimensions ≥3, no critical issues
- `changes_needed`: Any dimension <3 OR any critical issue

## Issue Classification

- **Critical**: Factual error, missing entire planned section, broken navigation
- **Minor**: Typo, slightly inconsistent tone, suboptimal heading level

## Issue Format for Writer

```markdown
### Issue: [Short description]
- **Page:** `[OUT_DIR]/docs/markdown/[filename].md`
- **Dimension:** [Accuracy|Completeness|Consistency|Structure|Usability]
- **Severity:** [Critical|Minor]
- **Issue:** [Description of what's wrong]
- **Suggestion:** [How to fix it]
```