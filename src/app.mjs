// Consumer of @sentinel-fixture/break.
//
// At 0.1.0 the package exports `greet`. At 0.2.0 that export is renamed to `greeting` (same
// signature and behavior) — a small, mechanical, well-documented rename. After Sentinel's Patcher
// bumps the dep to 0.2.0 it MUST adapt this module: the import specifier and the call site both
// reference `greet`, which no longer exists. This source adaptation (rename `greet` -> `greeting`
// at the import AND the call site) is the load-bearing capability the acceptance run proves.
import { greet } from '@sentinel-fixture/break';

export function render() {
  return greet('world');
}
