import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('reviewer SKILL.md Business Alignment references real Planner filenames', () => {
  const content = fs.readFileSync(path.join(__dirname, 'SKILL.md'), 'utf-8');
  assert.ok(!content.includes('user-journeys.md'), 'stale filename user-journeys.md must not appear');
  assert.ok(!content.includes('state-management.md'), 'stale filename state-management.md must not appear');
  assert.ok(!content.includes('data-models.md'), 'stale filename data-models.md must not appear');
  assert.ok(content.includes('features-and-journeys.md'), 'must reference real filename features-and-journeys.md');
  assert.ok(content.includes('state-and-data.md'), 'must reference real filename state-and-data.md');
  assert.ok(content.includes('`features-and-journeys.md`'), 'must format `features-and-journeys.md` with backticks');
  assert.ok(content.includes('`state-and-data.md`'), 'must format `state-and-data.md` with backticks');
  assert.ok(content.includes('`business-policies.md`'), 'must format `business-policies.md` with backticks');
  assert.ok(
    content.includes('whichever of these the detected archetype produces per Planner Phase 0'),
    'must include archetype-conditional phrasing'
  );
});

test('review-criteria.md Business Alignment references real Planner filenames', () => {
  const content = fs.readFileSync(path.join(__dirname, 'references', 'review-criteria.md'), 'utf-8');
  assert.ok(!content.includes('user-journeys.md'), 'stale filename user-journeys.md must not appear');
  assert.ok(!content.includes('state-management.md'), 'stale filename state-management.md must not appear');
  assert.ok(!content.includes('data-models.md'), 'stale filename data-models.md must not appear');
  assert.ok(content.includes('features-and-journeys.md'), 'must reference real filename features-and-journeys.md');
  assert.ok(content.includes('state-and-data.md'), 'must reference real filename state-and-data.md');
  assert.ok(content.includes('`features-and-journeys.md`'), 'must format `features-and-journeys.md` with backticks');
  assert.ok(content.includes('`state-and-data.md`'), 'must format `state-and-data.md` with backticks');
  assert.ok(content.includes('`business-policies.md`'), 'must format `business-policies.md` with backticks');
  assert.ok(
    content.includes('whichever of these the detected archetype produces per Planner Phase 0'),
    'must include archetype-conditional phrasing'
  );
});
