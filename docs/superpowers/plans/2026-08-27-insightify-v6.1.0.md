# Insightify v6.1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Insightify v6.1.0 which relocates the user review step to the Reviewer stage and introduces sub-agent concurrency (max 5) across Planner, Writer, and Reviewer.

**Architecture:** We are updating the Markdown instructions in the plugin's `SKILL.md` files. We remove the interactive prompt in `planner/SKILL.md`, add an interactive prompt to `reviewer/SKILL.md`, and instruct the use of sub-agents with a limit of 5 in `planner`, `writer`, and `reviewer` skills.

**Tech Stack:** Markdown (Claude Agent Skills)

## Global Constraints

- Max concurrency limit for sub-agents MUST be 5.
- The pipeline stages must remain 4 (Planner, Writer, Reviewer, Builder).

---

### Task 1: Update Planner Skill

**Files:**
- Modify: `.claude/plugins/insightify/skills/planner/SKILL.md`

**Interfaces:**
- Consumes: User prompt or sources
- Produces: Extracted knowledge categories, auto-approved plan

- [ ] **Step 1: Write minimal implementation**

Modify `.claude/plugins/insightify/skills/planner/SKILL.md`:
1. Under `### Phase 2: Extract`, add instructions to use sub-agents:
Replace:
```markdown
2. For each of the required categories for the detected archetype (defined in Phase 0; field-level schema in `references/extraction-schema.md`), analyze sources and extract structured facts.
```
With:
```markdown
2. For each of the required categories for the detected archetype, spawn sub-agents to analyze sources and extract structured facts in parallel. **CRITICAL:** Limit parallel sub-agent concurrency to a maximum of 5 at any given time.
```

2. Under `### Phase 3: Plan`, remove the interactive approval prompt:
Replace:
```markdown
4. Ask approval: "Approve plan? [Y/n/revise]"
   - Y/Enter → save as `approved`, proceed (plan frontmatter: `status: approved`)
   - n → exit, save as `rejected`
   - revise → prompt "What changes?", regenerate, loop (max 3 cycles). Max 3 revision cycles.
```
With:
```markdown
4. Automatically save the plan as `approved` and proceed to Writer. Do NOT ask the user for plan approval here.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/insightify/skills/planner/SKILL.md
git commit -m "feat: update planner skill to use sub-agents and auto-approve plan"
```

### Task 2: Update Writer Skill

**Files:**
- Modify: `.claude/plugins/insightify/skills/writer/SKILL.md`

**Interfaces:**
- Consumes: Auto-approved plan from Planner
- Produces: Draft document for Reviewer

- [ ] **Step 1: Write minimal implementation**

Modify `.claude/plugins/insightify/skills/writer/SKILL.md`:
Under `## Instructions`, change step 3 to use sub-agents:
Replace:
```markdown
3. Generate a single comprehensive markdown document at `[OUT_DIR]/docs/markdown/documentation.md` based on `plan.md`.
```
With:
```markdown
3. Generate a single comprehensive markdown document at `[OUT_DIR]/docs/markdown/documentation.md` based on `plan.md`. To speed up execution, spawn sub-agents to draft independent sections concurrently. **CRITICAL:** Limit parallel sub-agent concurrency to a maximum of 5 at any given time.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/insightify/skills/writer/SKILL.md
git commit -m "feat: update writer skill to use sub-agents for concurrent drafting"
```

### Task 3: Update Reviewer Skill

**Files:**
- Modify: `.claude/plugins/insightify/skills/reviewer/SKILL.md`

**Interfaces:**
- Consumes: Draft document from Writer
- Produces: Finalized document awaiting User Approval

- [ ] **Step 1: Write minimal implementation**

Modify `.claude/plugins/insightify/skills/reviewer/SKILL.md`:
Under `## Instructions`, update steps 1 and 5:

Replace:
```markdown
1. Evaluate `[OUT_DIR]/docs/markdown/documentation.md` against `[OUT_DIR]/.insightify/knowledge/*` and `[OUT_DIR]/.insightify/plan.md` across 9 dimensions in `references/review-criteria.md`.
```
With:
```markdown
1. Evaluate `[OUT_DIR]/docs/markdown/documentation.md` against `[OUT_DIR]/.insightify/knowledge/*` and `[OUT_DIR]/.insightify/plan.md` across 9 dimensions in `references/review-criteria.md`. Spawn sub-agents to evaluate these dimensions in parallel (maximum 5 sub-agents at any time), then merge their feedback.
```

Replace:
```markdown
5. If approved or after applying fixes, explicitly output the finalized document to `[OUT_DIR]/docs/final/final-documentation.md` so the user and Builder can see the definitive result.
```
With:
```markdown
5. If AI review is approved or after applying fixes, explicitly output the finalized document to `[OUT_DIR]/docs/final/final-documentation.md`. 
6. Prompt the user for final approval: "Approve doc? [Y/n/revise]".
   - `Y` -> Proceed to Builder stage.
   - `n` -> Abort pipeline.
   - `revise` -> Target specific issues back to Writer or fix directly.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/insightify/skills/reviewer/SKILL.md
git commit -m "feat: update reviewer skill to use sub-agents and add user approval"
```

### Task 4: Update Insightify Orchestrator Skill

**Files:**
- Modify: `.claude/plugins/insightify/skills/insightify/SKILL.md`

**Interfaces:**
- Consumes: Main pipeline execution
- Produces: Correct terminal logging and flow expectations

- [ ] **Step 1: Write minimal implementation**

Modify `.claude/plugins/insightify/skills/insightify/SKILL.md`:
Under `## Pipeline Execution (4 Stages)`:

Replace:
```markdown
1. **Planner:** Run `insightify:planner`.
   - Progress: `⏳ Planner: ingesting sources, extracting knowledge categories for detected archetype, generating plan...`
```
With:
```markdown
1. **Planner:** Run `insightify:planner`.
   - Progress: `⏳ Planner: ingesting sources, extracting categories (max 5 parallel), generating plan (auto-approved)...`
```

Replace:
```markdown
2. **Writer:** Run `insightify:writer`. Generate 14 pages in 5 dependency-aware waves.
   - Progress: `⏳ Writer: Wave X/5 — [======--] A/B pages`
```
With:
```markdown
2. **Writer:** Run `insightify:writer`. Generate pages concurrently (max 5 parallel).
   - Progress: `⏳ Writer: Drafting sections...`
```

Replace:
```markdown
3. **Reviewer:** Run `insightify:reviewer`.
   - Progress: `⏳ Reviewer: [========] X/9 dimensions (iteration 1/3)`
   - Error: If review loop exceeds 3 iterations, stop and report to user.
```
With:
```markdown
3. **Reviewer:** Run `insightify:reviewer`. Evaluates dimensions concurrently (max 5 parallel). 
   - Progress: `⏳ Reviewer: [========] X/9 dimensions (iteration 1/3)`
   - Error: If review loop exceeds 3 iterations, stop and report to user.
   - User Review: Stops at end to ask `Approve doc?`.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/insightify/skills/insightify/SKILL.md
git commit -m "feat: update orchestrator logging to reflect v6.1.0 flow"
```
