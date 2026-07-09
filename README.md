# sentinel-live-target — breaking-change acceptance fixture

Disposable target for the Sentinel **breaking-change compatibility-patch acceptance**
(`sentinel_breaking_change_patch_acceptance_run`). It proves Sentinel's load-bearing capability:
the Patcher editing **source code** to adapt to a breaking dependency bump — the thing that
distinguishes Sentinel from Dependabot/Renovate.

## The fixture

- **Dependency `@sentinel-fixture/break`** (hermetic S3 strategy — not published to public npm;
  shipped as vendored tarballs under `vendor/`):
  - `0.1.0` — exports `greet(name)`.
  - `0.2.0` — that export is **renamed** to `greeting(name)`; the signature and behavior are
    unchanged. A small, mechanical, well-documented rename (the intended low-severity reachable
    case), but still a breaking change that requires a source edit.
- **`src/app.mjs`** imports and calls `greet`, so a bump to `0.2.0` breaks it unless both the import
  specifier and the call site are renamed to `greeting`.
- **`gate.mjs`** (`npm test`) is a real hermetic gate: it extracts the vendored tarball matching the
  version declared in `package.json`, dynamically imports `src/app.mjs`, and asserts `render()`.
  It needs no registry, no `npm install`, and no npm cache — so it passes identically for Sentinel's
  local Validator gate and the GitHub Actions `test` required check.

## Expected Sentinel behavior

A live pr-strategy run should: detect `0.1.0 → 0.2.0`, bump `package.json`, **adapt `src/app.mjs`**
(rename `greet` → `greeting` at the import and the call site), run the gate green, and auto-merge.
SUCCESS = the merged/routed PR diff contains BOTH the manifest bump AND the source adaptation.
