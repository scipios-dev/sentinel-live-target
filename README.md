# sentinel-live-target

Disposable, throwaway target repository for exercising [Sentinel](https://github.com/scipios-dev/sentinel)
(agentic dependency maintenance) against a real GitHub remote. Its sole purpose is to receive
automated dependency-bump pull requests from Sentinel's pr-strategy live runs: it ships one
deliberately-outdated **published** dependency (`kleur`, pinned one patch behind latest) and a real,
dependency-free `node:test` verification gate (`verify.js`) that emits genuine TAP evidence — so
Sentinel's Validator can prove the bump on a fresh clone with no `npm install`. Nothing here is
precious; it can be deleted and re-seeded at any time.
