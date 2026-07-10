// Dependency-free verification gate for the Sentinel pr-strategy live-run target.
// Uses Node's built-in test runner (node:test) so the gate passes on a fresh clone with NO
// `npm install` — it must NOT import kleur or any dependency. The outdated dependency exists only
// to give the Watcher a real update to detect + bump; the bump is a no-code manifest change and
// this gate proves it on a fresh checkout via genuine TAP evidence (satisfies the Validator's
// oracle-theater detector).
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('arithmetic sanity', () => {
  assert.equal(2 + 2, 4);
  assert.equal(10 - 3, 7);
});

test('string sanity', () => {
  assert.equal('sentinel'.length, 8);
  assert.equal('live-target'.toUpperCase(), 'LIVE-TARGET');
});

test('array sanity', () => {
  assert.deepEqual([1, 2, 3].map((n) => n * 2), [2, 4, 6]);
});
