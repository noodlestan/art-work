# Sub-Agent REPORT (#producer)

**Plan:** `add-config-cache`

**Iteration Id:** `cache-config-by-source-hash`

**Outcome:** `COMPLETED`

## Evidence

### Changes

The config loader now records change-tracking metadata beside the compiled bundle and reuses the cached compilation while every recorded source is unchanged: `build()` runs with `metafile: true`, `config.cache.json` (version, compiledAt, manifest, and a sha256 per bundled input, paths relative to the workspace root) is written next to `config.bundle.mjs`, and the read path validates the metadata, the bundle, and the live hashes before importing the cached bundle and skipping `build()` entirely. Decisions are logged with `console.info` (`config: reused cached bundle` / `config: rebuilt bundle`); cache problems still degrade gracefully (warn + temp-bundle fallback, rebuild on any doubt).

| Goal                                                       | Outcome                                                                                                                                                                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Record change-tracking metadata beside the compiled bundle | Done — `metafile: true` on `build()`; after a successful cache write, `makeConfigCacheMeta` records every `metafile.inputs` entry (path relative to root + sha256) as `config.cache.json` via `resolveMetaPath(rootPath)`         |
| Reuse the cached compilation while sources are unchanged   | Done — `findReusableBundlePath` honours a valid cache; the second load imports the cached bundle and does not call `build()`; `console.info('config: reused cached bundle')`                                                      |
| Invalidate on any changed, missing, or unreadable input    | Done — edited manifest, edited file imported by the manifest, and missing recorded input all rebuild; missing bundle, missing/unparseable metadata, and `version` mismatch also rebuild; `console.info('config: rebuilt bundle')` |
| Prefer content hashes over mtime                           | Done — sha256 of file bytes (`node:crypto`) for every recorded input                                                                                                                                                              |
| Degrade gracefully                                         | Done — unwritable cache still warns and falls back to the temp bundle; metadata read/parse and input-hash failures never throw, they force a rebuild                                                                              |
| Prove the behaviour with unit tests                        | Done — 10 new tests in `loadWorkspaceConfig.test.ts` (17 total in the file); 353 unit tests pass repo-wide                                                                                                                        |

#### Files changed

- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` — slimmed to the orchestrator: default-config short-circuit, reuse-vs-compile decision, legacy cleanup, bundle import.
- `$ART_WORK/cli/work/src/config/cache.ts` — added `CACHE_META_VERSION` and `resolveMetaPath`.
- `$ART_WORK/cli/work/src/config/types.ts` — added `ConfigCacheInput` and `ConfigCacheMeta`.
- `$ART_WORK/cli/work/src/config/private/compileConfigBundle.ts` — new: esbuild build with `metafile: true`, cache write (bundle + metadata), warn + temp fallback, `config: rebuilt bundle` log.
- `$ART_WORK/cli/work/src/config/private/findReusableBundlePath.ts` — new: returns the cached bundle path only when metadata parses at version 1, the bundle exists, and every recorded input still hashes the same.
- `$ART_WORK/cli/work/src/config/private/readConfigCacheMeta.ts` — new: reads, parses, and shape/version-validates `config.cache.json`; missing, unparseable, or mismatched metadata → `null`.
- `$ART_WORK/cli/work/src/config/private/hashConfigInputs.ts` — new: sha256 per input file, paths resolved against the workspace root.
- `$ART_WORK/cli/work/src/config/private/makeConfigCacheMeta.ts` — new: metafile input keys → workspace-root-relative paths (anchored on `realpath`), hashed into the metadata object.
- `$ART_WORK/cli/work/src/config/private/importConfigBundle.ts` — new: imports the bundle and applies `defineConfig`.
- `$ART_WORK/cli/work/src/config/private/removeLegacyBundle.ts` — new: best-effort legacy root-level bundle cleanup, now shared by both paths.
- `$ART_WORK/cli/work/src/config/private/formatError.ts` — new: error formatting extracted for reuse.
- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts` — `esbuild.build` mocked via `vi.mock` (wraps the real build); new tests: valid cache skips build on second load, metadata records a sha256 per input, edited manifest rebuilds and rewrites metadata, edited imported file rebuilds, missing bundle / missing metadata / unparseable metadata / version mismatch / missing recorded input rebuild, manifest bundle failure reports the manifest path.

### Verification

| Check                                                                                              | Result                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run ci` from `$ART_WORK` (prettier, eslint, tsc, build, 353 unit tests, 22 integration tests) | PASS                                                                                                                                                             |
| Coverage thresholds (90/90/75/90)                                                                  | PASS — 96.69% statements, 84.5% branches, 97.5% functions, 97.05% lines                                                                                          |
| No `it.todo()` tests remain                                                                        | PASS                                                                                                                                                             |
| Pre-commit hooks (lefthook: clean, extract, ci) on commit `d68a57f`                                | PASS                                                                                                                                                             |
| Second load against an unchanged manifest does not invoke `esbuild.build`                          | PASS — `GIVEN a valid cache a second load reuses the bundle without building`; in vivo: two `repo` runs in `$WORKSPACE` logged rebuilt then reused               |
| Editing the manifest, or a file it imports, triggers a rebuild                                     | PASS — dedicated unit tests; in vivo: appending to `$WORKSPACE/.art-workspace.mts` logged `config: rebuilt bundle` (file reverted after)                         |
| `config.cache.json` records a sha256 for every file in `metafile.inputs`                           | PASS — asserted per input in tests; in vivo the workspace metadata lists `.art-workspace.mts` and the inlined `node_modules/@art-work/cli/dist/config/index.mjs` |

### Commits

| Commit    | Message                                                                  | Policy     | Pushed                  |
| --------- | ------------------------------------------------------------------------ | ---------- | ----------------------- |
| `d68a57f` | `build(art-work-cli): Reuse compiled config when sources are unchanged.` | AUTONOMOUS | Yes — `origin/building` |

Note: the push also published the delegator's pending local commit `fed0ca5` (`integrate(add-config-cache): Iteration move-config-bundle-to-cache DONE.`), which was already ahead of `origin/building`.

## Blockers (if any)

None.

## Feedback

### For the planner

- **In-process re-import returns the stale module.** After a rebuild, `import()` of the same `config.bundle.mjs` URL returns Node's cached module, so a second load within one process rebuilds and refreshes the metadata but still evaluates the previously imported bundle. The one-shot CLI is unaffected; if long-lived processes or the planned cross-process integration tests ever need it, a content-hash (or `compiledAt`) query on the import URL would fix it — not included here to stay in scope.
- **Metafile paths are realpaths.** esbuild reports `metafile.inputs` anchored on the real (de-symlinked) location, so `makeConfigCacheMeta` anchors the workspace-root-relative conversion on `realpathSync(rootPath)` (matters on hosts where the temp/workdir path contains symlinks, e.g. macOS `/var` → `/private/var`).

### For the technical writers

- The new `### Cache` subsection planned in Iteration: Update Config Knowledge can now state precisely that `config.cache.json` records a sha256 per esbuild `metafile.inputs` entry and that both the decision logs (`config: reused cached bundle` / `config: rebuilt bundle`) exist.

### For the crew

- `esbuild.build` is spied in unit tests via `vi.mock('esbuild', …)` wrapping the real implementation — the pattern to reuse when a future test needs build call counts without losing real bundling.
