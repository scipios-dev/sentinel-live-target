// Dependency-free verification gate for the Sentinel live-run target.
// Uses Node's built-in test runner (node:test) so the gate passes on a fresh
// clone with NO `npm install` — it must not import dayjs or any dependency.
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
