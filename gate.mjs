// Hermetic verification gate for the Sentinel breaking-change acceptance fixture.
//
// Run as `node --test gate.mjs` (see package.json) so it emits real node:test TAP evidence
// ("ok N", "# pass N") — the Validator's oracle-theater detector requires genuine test evidence to
// mark a gate landable, and this is real: it dynamically imports the (Patcher-adapted) source and
// asserts its behavior.
//
// Design goals (must hold for BOTH Sentinel's local Validator gate AND the GitHub Actions `test`
// required check on a cold-cache runner):
//   * NO registry, NO npm install, NO lockfile, NO cache dependency — @sentinel-fixture/break is
//     unpublished by construction (hermetic S3 strategy: no public npm publish).
//   * Resolve the dependency from a VENDORED tarball matching the version DECLARED in package.json,
//     extracting it into node_modules the way npm would (npm tarballs wrap contents in package/).
//   * A real assertion that FAILS when the source has not been adapted to the installed version
//     (e.g. a leftover `greet` import against the renamed-to-`greeting` 0.2.0 export).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const spec = pkg.dependencies?.['@sentinel-fixture/break'];
if (typeof spec !== 'string') {
  console.error('GATE FAIL: @sentinel-fixture/break is not declared in dependencies');
  process.exit(1);
}
// Strip any semver range prefix the Patcher may write (^, ~, >=, spaces) to get the exact version.
const version = spec.replace(/^[\^~>=<\s]+/, '').trim();
const tarball = join(root, 'vendor', `sentinel-fixture-break-${version}.tgz`);
if (!existsSync(tarball)) {
  console.error(`GATE FAIL: no vendored tarball for version ${version} (${tarball})`);
  process.exit(1);
}
// Extract the exact published tarball into node_modules/@sentinel-fixture/break (--strip-components=1
// drops the leading package/ dir npm pack adds). Deterministic, offline, cache-free. Runs at module
// load — before the test body's dynamic import resolves the dependency.
const dest = join(root, 'node_modules', '@sentinel-fixture', 'break');
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
execFileSync('tar', ['-xzf', tarball, '-C', dest, '--strip-components=1']);

test(`@sentinel-fixture/break@${version}: render() returns "hi world"`, async () => {
  const { render } = await import('./src/app.mjs');
  assert.equal(render(), 'hi world');
});
