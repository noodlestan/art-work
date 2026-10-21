# Sub-Agent REPORT (#producer)

**Plan:** `add-config-cache`

**Iteration Id:** `move-config-bundle-to-cache`

**Outcome:** `COMPLETED`

## Evidence

### Changes

The compiled config bundle no longer lands at the workspace root: `loadWorkspaceConfig` now writes the esbuild output to `<workspace root>/node_modules/.art-work/config.bundle.mjs`, degrades gracefully (warn + temp-dir fallback) when the cache directory is unusable, and best-effort removes any legacy root-level `.art-workspace-bundle.mjs`. Unit tests prove the relocation, the legacy cleanup, and the graceful degradation.

| Goal                                                        | Outcome                                                                                                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relocate the compiled bundle into `node_modules/.art-work/` | Done — bundle written via `resolveBundlePath(rootPath)` after `mkdir(resolveCacheDir(rootPath), { recursive: true })`; `import()` loads the cache path                           |
| Stop producing the root-level `.art-workspace-bundle.mjs`   | Done — `TEMP_FILE` removed; only reference left is the best-effort legacy cleanup (`rm(path, { force: true })` inside try/catch)                                                 |
| Degrade gracefully on cache problems                        | Done — cache dir creation/write wrapped in try/catch; on failure `console.warn` names the cache path and the bundle falls back to `join(tmpdir(), 'art-work-config-bundle.mjs')` |
| Prove the relocation with unit tests                        | Done — 3 new tests; `loadWorkspaceConfig.test.ts` now has 7 passing tests                                                                                                        |

#### Files changed

- `$ART_WORK/cli/work/src/config/cache.ts` — new cache location helpers: `CACHE_DIR`, `BUNDLE_FILE`, `META_FILE`, `resolveCacheDir`, `resolveBundlePath`.
- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` — writes the bundle into the cache dir; warns and falls back to a temp bundle when the cache is unusable; removes a legacy root-level `.art-workspace-bundle.mjs` best-effort; imports the resolved bundle path.
- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts` — new tests: bundle lands in the cache and no root-level file remains; a pre-existing legacy root bundle is removed; an un-creatable cache directory warns and still returns a config.

### Verification

| Check                                                                                              | Result                                                                                                         |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run ci` from `$ART_WORK` (prettier, eslint, tsc, build, 343 unit tests, 22 integration tests) | PASS                                                                                                           |
| No `it.todo()` tests remain                                                                        | PASS                                                                                                           |
| Pre-commit hooks (lefthook: clean, extract, ci) on commit `8821977`                                | PASS                                                                                                           |
| No code path writes `.art-workspace-bundle.mjs` at the workspace root                              | PASS — only the guarded legacy-cleanup read/remove references it; test asserts absence after load              |
| Bundle lands under `<workspace root>/node_modules/.art-work/`                                      | PASS — asserted by `GIVEN a successful load it writes the bundle into the cache and skips the root-level file` |
| Unusable cache directory warns and run still completes                                             | PASS — asserted by `WHEN the cache directory cannot be created it warns and still returns a config`            |

### Commits

| Commit    | Message                                                                      | Policy     | Pushed                  |
| --------- | ---------------------------------------------------------------------------- | ---------- | ----------------------- |
| `8821977` | `build(art-work-cli): Move compiled config into \`node_modules/.art-work\`.` | AUTONOMOUS | Yes — `origin/building` |

## Blockers (if any)

None.
