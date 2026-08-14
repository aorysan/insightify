# Insightify v2 Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement v2 enhancements including orchestrator resilience, CLI argument parsing, interactive plan approval loops, and foundational testing strategy.

**Architecture:** We are updating the Markdown-based prompts (skills) for the orchestrator and planner to handle errors and implement interactive revision loops. We will also scaffold the directory structure for test fixtures and create an initial end-to-end integration test setup using the native `node:test` runner.

**Tech Stack:** Node.js, `node:test`, Markdown (Claude skills)

**Spec:** `docs/superpowers/specs/2026-08-14-insightify-v2-enhancements.md`

## Global Constraints

- Must run on Node.js v18+ (using native `node:test` module)
- No new external npm dependencies beyond what is already in `package.json`

---

### Task 1: Update Orchestrator Skill

**Files:**
- Modify: `skills/insightify.md`

**Interfaces:**
- Consumes: The `insightify` command inputs
- Produces: Enhanced pipeline orchestrator prompt that handles CLI arguments, errors, and progress reporting.

- [ ] **Step 1: Write the updated orchestrator logic**

```bash
# Add CLI argument parsing, progress indicators, and error resilience.
cat << 'EOF' > skills/insightify.md
---
name: insightify
description: Generate complete VitePress documentation from an unstructured code repository.
---

# Insightify Pipeline Orchestrator

When the user runs this skill, execute the 6-stage documentation pipeline sequentially. Do NOT skip any steps unless explicitly requested by the user.

## CLI Argument Parsing & Invocation
Support the following invocation patterns:
- `/insightify` -> Interactive: prompt for project name and sources
- `/insightify <url>` -> Use URL as first source, prompt for project name, then prompt for additional sources
- `/insightify --project <name> --source <path>` -> Non-interactive
- `/insightify --config <path>` -> Read from `insightify.config.json`
- `/insightify --dry-run` -> Show execution plan without running
- `/insightify --resume [--from-stage N]` -> Resume from last completed stage or specified stage

## Pipeline Execution

1. **Stage 1 (Ingest):** Run `insightify-ingest`.
   - *Progress Indicator:* Display `⏳ Ingesting: [===----] X/Y sources`
   - *Error Handling:* If partial failure, log in manifest as `failed` and continue.
2. **Stage 2 (Extract):** Run `insightify-extract`.
   - *Progress Indicator:* Display `⏳ Extracting: [======-] X/Y categories`
   - *Error Handling:* If category fails, write empty file and note in `unanswered.md`.
3. **Stage 3 (Plan):** Run `insightify-plan`.
   - *Progress Indicator:* Display `⏳ Planning: generating plan...`
   - *Error Handling:* Prompt user with the plan. If no response after 5 mins, present summary again; after 10 mins, exit saving plan as `draft`.
4. **Stage 4 (Write):** Run `insightify-write`. Generate pages in waves.
   - *Progress Indicator:* Display `⏳ Writing: Wave X/Y — [======--] A/B pages`
   - *Error Handling:* If single page fails, log error, continue other pages, report failed pages to user.
5. **Stage 5 (Review):** Run `insightify-review`.
   - *Progress Indicator:* Display `⏳ Reviewing: [========] X/Y dimensions (iteration 1/3)`
   - *Error Handling:* If review loop exceeds 3 iterations, stop and report to user.
6. **Stage 6 (Build):** Run `insightify-build`. Print success summary.
   - *Progress Indicator:* Display `⏳ Building: generating config, sidebar, index...`

## Workspace Constraints
- All intermediate data MUST be stored in `.insightify/` relative to the target directory.
- The final output is the `docs/` folder, `knowledge-base/` folder, `.vitepress` config, and `package.json`.
- Detect missing `.insightify/` directory on resume and offer to restart or resume from last completed stage.
EOF
```

- [ ] **Step 2: Commit changes**

```bash
git add skills/insightify.md
git commit -m "feat: enhance insightify orchestrator with resilience and progress reporting"
```

### Task 2: Enhance Planner Skill with Interactive Revision Loop

**Files:**
- Modify: `skills/plan/plan.md`

**Interfaces:**
- Consumes: `.insightify/knowledge/*.md`
- Produces: Enhanced interaction flow for plan approval

- [ ] **Step 1: Write the updated planner logic**

```bash
cat << 'EOF' > skills/plan/plan.md
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
EOF
```

- [ ] **Step 2: Commit changes**

```bash
git add skills/plan/plan.md
git commit -m "feat: implement interactive revision loop in plan stage"
```

### Task 3: Scaffold Testing Setup

**Files:**
- Create: `tests/fixtures/sample.pdf`
- Create: `tests/fixtures/sample.html`
- Create: `tests/fixtures/sample.js`
- Create: `tests/fixtures/sample.ts`
- Create: `tests/fixtures/sample.md`
- Create: `tests/integration/pipeline.test.js`

**Interfaces:**
- Consumes: Standard test runner
- Produces: Foundational test directory structure

- [ ] **Step 1: Create fixture directories and placeholder files**

```bash
mkdir -p tests/fixtures/multi-source/src tests/fixtures/multi-source/docs tests/integration tests/unit tests/e2e
echo "Dummy PDF content" > tests/fixtures/sample.pdf
echo "<html><body><h1>Hello World</h1><nav></nav></body></html>" > tests/fixtures/sample.html
echo "/**\n * @description A sample function\n */\nfunction hello() {}" > tests/fixtures/sample.js
echo "interface User { name: string; }" > tests/fixtures/sample.ts
echo "---\ntitle: Sample\n---\n# Sample Markdown" > tests/fixtures/sample.md
echo "console.log('src code');" > tests/fixtures/multi-source/src/index.ts
echo "# Guide" > tests/fixtures/multi-source/docs/guide.md
echo "# README" > tests/fixtures/multi-source/README.md
```

- [ ] **Step 2: Create initial test placeholder file**

```bash
cat << 'EOF' > tests/integration/pipeline.test.js
const test = require('node:test');
const assert = require('node:assert');

test('Integration: Pipeline sanity check', (t) => {
  // TODO: Add actual end-to-end orchestration tests matching scenarios defined in spec
  assert.strictEqual(1, 1, 'Basic test setup works');
});
EOF
```

- [ ] **Step 3: Run the test to ensure it passes**

```bash
npm test
```
Expected output: The pipeline sanity check passes.

- [ ] **Step 4: Commit changes**

```bash
git add tests/
git commit -m "test: scaffold testing directory and fixtures"
```