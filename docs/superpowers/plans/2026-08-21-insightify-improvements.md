# Insightify Improvement — Implementation Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 41 identified issues across the Insightify plugin workspace — 6 critical bugs, 12 major issues, 15 minor issues, and 8 enhancements.

**Architecture:** Fixes are organized into independent tasks by file/subsystem so each can be tested and committed independently. Tasks within a phase can be executed in parallel.

**Tech Stack:** Python 3.x, Node.js (ESM), VitePress, Markdown

## Global Constraints

- All files must use **UTF-8 without BOM** encoding
- All regex patterns must handle both **LF** (`\n`) and **CRLF** (`\r\n`) line endings
- All file path operations must be **cross-platform** (use `pathlib.Path` / `os.path` in Python, `path.join` in Node.js)
- No hardcoded absolute paths — use environment variables or dynamic resolution
- Preserve all existing comments and docstrings unrelated to changes

---

## Phase 1: Critical Bug Fixes (🔴)

### Task 1: Fix `_doctor_analysis.py` — Crash, Dead Code & Portability

**Files:**
- Modify: [`_doctor_analysis.py`](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py)

**Interfaces:**
- Consumes: `~/.claude.json`, `~/.claude/settings.json`, `~/.claude/projects/**/*.jsonl`
- Produces: `_doctor_summary.json` (unchanged output format)

- [ ] **Step 1: Fix crash on missing `~/.claude.json` (line 11-13)**

Current code ([lines 11-13](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L11-L13)):
```python
claude_json_path = os.path.join(home, ".claude.json")
with open(claude_json_path, "r", encoding="utf-8") as f:
    claude_json = json.load(f)
```

Replace with:
```python
claude_json_path = os.path.join(home, ".claude.json")
claude_json = {}
if os.path.exists(claude_json_path):
    try:
        with open(claude_json_path, "r", encoding="utf-8") as f:
            claude_json = json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"Warning: Could not read {claude_json_path}: {e}")
```

- [ ] **Step 2: Remove unused import `glob` ([line 3](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L3))**

```python
import glob  # DELETE THIS LINE
```

- [ ] **Step 3: Remove dead variable `proj_settings_path` ([line 23](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L23))**

```python
proj_settings_path = os.path.join(cwd, ".claude", "settings.json")  # DELETE THIS LINE
```

This variable is defined but never read or used anywhere.

- [ ] **Step 4: Fix hardcoded Windows backslash path filter ([line 231](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L231))**

Current:
```python
if not rel_p.startswith(".claude\\plugins") and not rel_p.startswith(".git"):
```

Replace with:
```python
if not rel_p.startswith(os.path.join(".claude", "plugins")) and not rel_p.startswith(".git"):
```

- [ ] **Step 5: Fix CRLF-fragile frontmatter regex ([line 155](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L155))**

Current:
```python
fm = re.match(r"^---\s*\n(.*?)\n---", txt, re.DOTALL)
```

Replace with:
```python
fm = re.match(r"^---\s*\r?\n(.*?)\r?\n---", txt, re.DOTALL)
```

- [ ] **Step 6: Fix `latest_ver` mixing types ([lines 242-248](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L242-L248))**

Current:
```python
latest_ver = "unknown"
try:
    req = urllib.request.Request("https://downloads.claude.ai/claude-code-releases/latest", headers={"User-Agent": "Claude-Code-Doctor"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        latest_ver = resp.read().decode("utf-8").strip()
except Exception as e:
    latest_ver = f"Lookup failed: {e}"
```

Replace with:
```python
latest_ver = "unknown"
latest_ver_error = None
try:
    req = urllib.request.Request("https://downloads.claude.ai/claude-code-releases/latest", headers={"User-Agent": "Claude-Code-Doctor"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        latest_ver = resp.read().decode("utf-8").strip()
except Exception as e:
    latest_ver_error = str(e)
```

And add `"latest_version_error": latest_ver_error` to the `summary_data` dict at [line 265](file:///D:/AryokPunya/Magang/insight/_doctor_analysis.py#L265).

- [ ] **Step 7: Verify**

Run: `python _doctor_analysis.py`
Expected: Script completes without crash. `_doctor_summary.json` written.

- [ ] **Step 8: Commit**

```bash
git add _doctor_analysis.py
git commit -m "fix: doctor_analysis crash, dead code, and cross-platform path handling"
```

---

### Task 2: Fix `_doctor_scanner.py` — Platform Portability & Unused Code

**Files:**
- Modify: [`_doctor_scanner.py`](file:///D:/AryokPunya/Magang/insight/_doctor_scanner.py)

**Interfaces:**
- Consumes: `~/.claude.json`, system PATH, Claude CLI
- Produces: JSON report to stdout (unchanged format)

- [ ] **Step 1: Remove unused imports ([lines 3, 7](file:///D:/AryokPunya/Magang/insight/_doctor_scanner.py#L3)). Add `import shutil`**

Remove:
```python
import glob        # line 3
from datetime import datetime  # line 7
```

Add after remaining imports:
```python
import shutil
```

- [ ] **Step 2: Replace Windows-only `where` with `shutil.which` ([lines 26-30](file:///D:/AryokPunya/Magang/insight/_doctor_scanner.py#L26-L30))**

Current:
```python
try:
    which_out = subprocess.check_output(["where", "claude"], text=True, stderr=subprocess.DEVNULL)
    which_claude = [line.strip() for line in which_out.strip().splitlines() if line.strip()]
except Exception as e:
    which_claude = []
```

Replace with:
```python
claude_path = shutil.which("claude")
which_claude = [claude_path] if claude_path else []
```

- [ ] **Step 3: Add `timeout=10` to subprocess calls ([lines 34, 315](file:///D:/AryokPunya/Magang/insight/_doctor_scanner.py#L34))**

Line 34 — add `timeout=10`:
```python
npm_prefix = subprocess.check_output(["npm", "-g", "config", "get", "prefix"], text=True, stderr=subprocess.DEVNULL, timeout=10).strip()
```

Line 315 — add `timeout=10`:
```python
ver_out = subprocess.check_output(["claude", "--version"], text=True, stderr=subprocess.DEVNULL, timeout=10)
```

- [ ] **Step 4: Verify**

Run: `python _doctor_scanner.py`
Expected: JSON output printed between delimiters without errors.

- [ ] **Step 5: Commit**

```bash
git add _doctor_scanner.py
git commit -m "fix: scanner cross-platform portability, unused imports, subprocess timeouts"
```

---

### Task 3: Fix `replace_child.py` — Path Skip & Replacement Order Bugs

**Files:**
- Modify: [`replace_child.py`](file:///D:/AryokPunya/Magang/insight/replace_child.py)

**Interfaces:**
- Consumes: `.claude/plugins/insightify/skills/**/*.md`
- Produces: Updated markdown files with `[OUT_DIR]/` prefixed paths

- [ ] **Step 1: Fix Windows path normalization on skip logic ([lines 6-8](file:///D:/AryokPunya/Magang/insight/replace_child.py#L6-L8))**

Current:
```python
for file in files:
    if file == '.claude/plugins/insightify/skills/insightify/SKILL.md':
        continue
```

Replace with:
```python
skip_path = os.path.normpath('.claude/plugins/insightify/skills/insightify/SKILL.md')
for file in files:
    if os.path.normpath(file) == skip_path:
        continue
```

- [ ] **Step 2: Fix replacement ordering — longer patterns first ([lines 16-24](file:///D:/AryokPunya/Magang/insight/replace_child.py#L16-L24))**

Current:
```python
    replacements = [
        ('.insightify/', '[OUT_DIR]/.insightify/'),
        ('docs/', '[OUT_DIR]/docs/'),
        ('knowledge-base/', '[OUT_DIR]/knowledge-base/'),
        ('package.json', '[OUT_DIR]/package.json'),
        ('.vitepress/', '[OUT_DIR]/.vitepress/'),
        ('./docs/', '[OUT_DIR]/docs/'),
        ('./knowledge-base/', '[OUT_DIR]/knowledge-base/')
    ]
```

Replace with (longer/more specific patterns MUST come first):
```python
    replacements = [
        # Longer, more specific patterns first to prevent substring collision
        ('./.insightify/', '[OUT_DIR]/.insightify/'),
        ('./docs/', '[OUT_DIR]/docs/'),
        ('./knowledge-base/', '[OUT_DIR]/knowledge-base/'),
        # Then shorter patterns
        ('.insightify/', '[OUT_DIR]/.insightify/'),
        ('.vitepress/', '[OUT_DIR]/.vitepress/'),
        ('knowledge-base/', '[OUT_DIR]/knowledge-base/'),
        ('docs/', '[OUT_DIR]/docs/'),
        ('package.json', '[OUT_DIR]/package.json'),
    ]
```

- [ ] **Step 3: Add feedback for skipped files ([after line 35](file:///D:/AryokPunya/Magang/insight/replace_child.py#L35))**

Add an `else` clause after the `if content != original_content:` block:
```python
    else:
        print(f"No changes: {file}")
```

- [ ] **Step 4: Verify**

Run: `python replace_child.py`
Expected: Status for each file. No `./[OUT_DIR]/docs/` corruption.

- [ ] **Step 5: Commit**

```bash
git add replace_child.py
git commit -m "fix: replace_child path normalization and replacement order bug"
```

---

### Task 4: Fix Congen Scripts — ESM Conflict, CRLF, Code Duplication

**Files:**
- Rename: [`ingest-script.js`](file:///D:/AryokPunya/Magang/insight/projects/congen/ingest-script.js) → `ingest-script.cjs`
- Rename: [`build-frontmatter.js`](file:///D:/AryokPunya/Magang/insight/projects/congen/build-frontmatter.js) → `build-frontmatter.cjs`
- Modify: [`package.json`](file:///D:/AryokPunya/Magang/insight/projects/congen/package.json)

**Interfaces:**
- `ingest-script.cjs`: Reads `repo/**`, writes `.insightify/sources/*.md`
- `build-frontmatter.cjs`: Reads/writes `docs/*.md` frontmatter
- `package.json`: npm scripts

- [ ] **Step 1: Rename JS files to `.cjs`**

```bash
cd D:\AryokPunya\Magang\insight\projects\congen
git mv ingest-script.js ingest-script.cjs
git mv build-frontmatter.js build-frontmatter.cjs
```

- [ ] **Step 2: Fix `parseCode` raw code duplication in `ingest-script.cjs` ([line 32](file:///D:/AryokPunya/Magang/insight/projects/congen/ingest-script.js#L32))**

Current:
```javascript
  return comments.join('\n\n') || codeString;
```

Replace with:
```javascript
  return comments.join('\n\n');
```

The raw source is already included under `## Raw Source` at line 52 — returning `codeString` as fallback duplicates the entire file.

- [ ] **Step 3: Add directory creation in `ingest-script.cjs` (before [line 38](file:///D:/AryokPunya/Magang/insight/projects/congen/ingest-script.js#L38))**

Add before the `for` loop:
```javascript
const sourcesDir = path.join(process.cwd(), '.insightify/sources');
fs.mkdirSync(sourcesDir, { recursive: true });
```

- [ ] **Step 4: Fix CRLF regex in `build-frontmatter.cjs` ([line 14](file:///D:/AryokPunya/Magang/insight/projects/congen/build-frontmatter.js#L14))**

Current:
```javascript
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
```

Replace with:
```javascript
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
```

- [ ] **Step 5: Wire scripts into `package.json` ([lines 7-11](file:///D:/AryokPunya/Magang/insight/projects/congen/package.json#L7-L11))**

Current:
```json
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
```

Replace with:
```json
  "scripts": {
    "ingest": "node ingest-script.cjs",
    "docs:prebuild": "node build-frontmatter.cjs",
    "docs:dev": "vitepress dev docs",
    "docs:build": "npm run docs:prebuild && vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
```

- [ ] **Step 6: Verify**

```bash
cd D:\AryokPunya\Magang\insight\projects\congen
node build-frontmatter.cjs
```
Expected: `✓` for each doc file. No "SKIP (no frontmatter)" on Windows.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: ESM/CJS conflict, CRLF regex, code duplication in congen scripts"
```

---

### Task 5: Fix `render-build.mjs` — Hardcoded Absolute Path

**Files:**
- Modify: [`render-build.mjs`](file:///D:/AryokPunya/Magang/insight/insights/tm/.insightify/render-build.mjs)

**Interfaces:**
- Consumes: `.insightify/knowledge/`, `docs/`, plugin templates
- Produces: `index.html`, `knowledge-base.md`

- [ ] **Step 1: Replace hardcoded path ([line 6](file:///D:/AryokPunya/Magang/insight/insights/tm/.insightify/render-build.mjs#L6))**

Current:
```javascript
const PLUGIN = 'C:/Users/ThinkPad/.claude/plugins/cache/aorysan/insightify/4.0.0/skills/builder/templates';
```

Replace with:
```javascript
const PLUGIN = process.env.INSIGHTIFY_TEMPLATES_DIR
  || path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    '.claude', 'plugins', 'cache', 'aorysan', 'insightify', '4.0.0',
    'skills', 'builder', 'templates'
  );
```

- [ ] **Step 2: Add existence check after PLUGIN definition**

Add after the `PLUGIN` constant:
```javascript
if (!fs.existsSync(PLUGIN)) {
  console.error(`❌ Template directory not found: ${PLUGIN}`);
  console.error('Set INSIGHTIFY_TEMPLATES_DIR environment variable to override.');
  process.exit(1);
}
```

- [ ] **Step 3: Verify**

```bash
cd D:\AryokPunya\Magang\insight\insights\tm\.insightify
node render-build.mjs
```
Expected: Runs successfully or prints clear error with the path it tried.

- [ ] **Step 4: Commit**

```bash
git add insights/tm/.insightify/render-build.mjs
git commit -m "fix: replace hardcoded template path with dynamic resolution"
```

---

## Phase 2: Major Issues & Standardization (🟠)

### Task 6: Fix `.gitignore` Encoding & Workspace Cleanup

**Files:**
- Overwrite: [`.gitignore`](file:///D:/AryokPunya/Magang/insight/.gitignore)
- Delete: `test.txt`, `task-5-review-ascii.md`, `diff-utf8.md`, `tests_diff.txt`

- [ ] **Step 1: Overwrite `.gitignore` as proper UTF-8**

```gitignore
# Dependencies
node_modules/
**/node_modules/

# Insightify pipeline intermediates
.insightify/
**/.insightify/

# Worktrees
.worktrees/

# Python cache
*.pyc
__pycache__/

# OS files
.DS_Store
Thumbs.db

# Generated artifacts
_doctor_summary.json
```

- [ ] **Step 2: Delete scratch files**

```powershell
Remove-Item D:\AryokPunya\Magang\insight\test.txt -ErrorAction SilentlyContinue
Remove-Item D:\AryokPunya\Magang\insight\task-5-review-ascii.md -ErrorAction SilentlyContinue
Remove-Item D:\AryokPunya\Magang\insight\diff-utf8.md -ErrorAction SilentlyContinue
Remove-Item D:\AryokPunya\Magang\insight\tests_diff.txt -ErrorAction SilentlyContinue
```

- [ ] **Step 3: Verify encoding**

```powershell
[byte[]]$bytes = [System.IO.File]::ReadAllBytes("D:\AryokPunya\Magang\insight\.gitignore")
$bytes[0..2]
```
Expected: First byte should be `35` (`#` in ASCII), NOT `255, 254` (UTF-16LE BOM).

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git rm --cached test.txt task-5-review-ascii.md diff-utf8.md tests_diff.txt 2>nul
git commit -m "fix: re-encode gitignore to UTF-8, clean up scratch files"
```

---

### Task 7: Standardize TrasMart & Update Config

**Files:**
- Modify: 9 doc files in [`projects/trasmart/docs/`](file:///D:/AryokPunya/Magang/insight/projects/trasmart/docs)
- Create: `projects/trasmart/docs/public/icon.png`
- Modify: [`insightify.config.json`](file:///D:/AryokPunya/Magang/insight/insightify.config.json)

- [ ] **Step 1: Add YAML frontmatter to all 9 trasmart doc pages**

Prepend to each file:

| File | `title` | `description` | `audience` |
|---|---|---|---|
| `guide/introduction.md` | What is TrasMart? | Introduction to the TrasMart smart waste-recycling platform | all |
| `guide/getting-started.md` | Getting Started | Developer setup and onboarding for TrasMart | developers |
| `guide/architecture.md` | Architecture | System architecture overview for TrasMart | developers |
| `web/routing.md` | Routing & Middleware | Next.js App Router routing and middleware | developers |
| `web/auth.md` | Authentication | Supabase SSR authentication architecture | developers |
| `web/api-reference.md` | API & RPCs | REST API endpoints and Supabase RPCs | developers |
| `web/development.md` | Development Guide | Coding standards and development guidelines | developers |
| `iot/firmware.md` | ESP32 Firmware | IoT machine firmware documentation | developers |
| `iot/machine-flow.md` | Machine Interaction Flow | Step-by-step machine recycling workflow | all |

Format for each:
```markdown
---
title: "<title>"
description: "<description>"
audience: "<audience>"
---

<existing content starting from # heading>
```

- [ ] **Step 2: Create placeholder icon**

Create `projects/trasmart/docs/public/icon.png` — a valid 1x1 transparent PNG to prevent 404.

- [ ] **Step 3: Update `insightify.config.json`**

Replace entire contents with:
```json
{
  "version": "4.0.0",
  "projects": [
    { "name": "congen", "sources": ["projects/congen"], "outDir": "insights/congen" },
    { "name": "trasmart", "sources": ["projects/trasmart"], "outDir": "insights/tm" },
    { "name": "hoyo", "sources": ["projects/hoyo"], "outDir": "insights/hoyo" }
  ]
}
```

- [ ] **Step 4: Verify VitePress build**

```bash
cd D:\AryokPunya\Magang\insight\projects\trasmart
npx vitepress build docs
```
Expected: Build succeeds. No broken favicon warning.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: standardize trasmart docs frontmatter, add icon, update config"
```

---

### Task 8: Enable Local Search in Hoyo VitePress

**Files:**
- Modify: [`config.js`](file:///D:/AryokPunya/Magang/insight/projects/hoyo/docs/.vitepress/config.js)

- [ ] **Step 1: Add search config ([after line 52](file:///D:/AryokPunya/Magang/insight/projects/hoyo/docs/.vitepress/config.js#L52))**

Current ([lines 50-53](file:///D:/AryokPunya/Magang/insight/projects/hoyo/docs/.vitepress/config.js#L50-L53)):
```javascript
    outline: [2, 3],
    lastUpdated: true,
    socialLinks: []
  }
```

Replace with:
```javascript
    outline: [2, 3],
    lastUpdated: true,
    socialLinks: [],
    search: {
      provider: 'local'
    }
  }
```

- [ ] **Step 2: Verify**

```bash
cd D:\AryokPunya\Magang\insight\projects\hoyo
npx vitepress build docs
```
Expected: Build succeeds with search index generated.

- [ ] **Step 3: Commit**

```bash
git add projects/hoyo/docs/.vitepress/config.js
git commit -m "feat: enable local search in hoyo VitePress config"
```

---

## Issue Coverage Matrix

| ID | Issue | Task | Status |
|---|---|---|---|
| C1 | Broken HTML in `index.html` | — | ⏳ Root cause in plugin `build-html.mjs` |
| C2 | `render-build.mjs` hardcoded path | Task 5 | ✅ |
| C3 | `_doctor_analysis.py` crash | Task 1 | ✅ |
| C4 | `replace_child.py` skip failure | Task 3 | ✅ |
| C5 | `replace_child.py` order corruption | Task 3 | ✅ |
| C6 | `ingest-script.js` code duplication | Task 4 | ✅ |
| M1 | ESM/CommonJS conflict | Task 4 | ✅ |
| M2 | CRLF regex failure | Task 4 | ✅ |
| M3 | `.gitignore` UTF-16LE | Task 6 | ✅ |
| M4 | Windows-only `where` command | Task 2 | ✅ |
| M5 | Hardcoded `\\` in path filter | Task 1 | ✅ |
| M6 | Duplicate doctor script code | — | ⏳ Deferred (refactor) |
| M7 | Duplicate knowledge directories | — | ⏳ Deferred (arch decision) |
| M8 | TrasMart incomplete artifacts | Task 7 | 🔶 Partial |
| M9 | TrasMart missing frontmatter | Task 7 | ✅ |
| M10 | TrasMart missing `icon.png` | Task 7 | ✅ |
| M11 | `knowledge-base.md` double headers | — | ⏳ Root cause in plugin |
| M12 | Incomplete config | Task 7 | ✅ |
| m1-m5 | Unused imports, dead vars, timeouts | Tasks 1, 2 | ✅ |
| m6-m8 | Replace script improvements | Task 3 | ✅ |
| m9-m10 | Dir creation, heading normalization | Task 4 | ✅ |
| m12-m13 | VitePress config inconsistency | Task 8 | ✅ |
| e7 | Workspace scratch cleanup | Task 6 | ✅ |
| e8 | Enable search in hoyo | Task 8 | ✅ |

> **Deferred:** M6 (merge doctor scripts) and M7 (deduplicate knowledge dirs) need architectural decisions → separate follow-up plan.

> **Plugin-level:** C1 (broken HTML) and M11 (double headers) require changes to `.claude/plugins/insightify/skills/builder/templates/build-html.mjs` — outside this workspace spec scope.
