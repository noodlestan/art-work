# Sub-Agent REPORT (#producer)

**Plan:** `add-config-cache`

**Iteration Id:** `add-no-config-cache-flag`

**Outcome:** `COMPLETED`

## Evidence

### Changes

An operator can now force a config recompile for a single invocation: `--no-config-cache` is a program-level option (default `configCache: true`, `false` when passed), threaded from every command action into `loadWorkspaceConfig` via `command.optsWithGlobals()`. With `cache: false` the loader skips the metadata read entirely, always runs `build()` — overwriting `config.bundle.mjs` and `config.cache.json` — then imports the fresh bundle and logs the bypass.

| Goal                                                                     | Outcome                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Declare `--no-config-cache` on the program next to `.version(...)`       | Done — `program.option('--no-config-cache', 'Ignore the config cache and recompile the config')`; commander's `--no-<name>` idiom yields `configCache: true` by default and `false` when passed                          |
| Confirm the flag is accepted where operators expect it                   | Done — commander 12 accepts it both before and after the subcommand (`sanity --no-config-cache`, `--no-config-cache sanity`, after other subcommand options); `enablePositionalOptions()` not needed                     |
| Thread the value into every command action                               | Done — all 11 `loadWorkspaceConfig(root)` call sites in `index.ts` now pass `{ cache: command.optsWithGlobals().configCache !== false }`; no single-argument call site remains                                           |
| `cache: false` bypasses the read path, rebuilds, refreshes, then imports | Done — `loadWorkspaceConfig(rootPath, options?: { cache?: boolean })`; the bypass never calls `findReusableBundlePath`, always calls `compileConfigBundle` (which overwrites bundle + `config.cache.json`), then imports |
| Log the bypass                                                           | Done — `console.info('config: cache bypassed,rebuilt bundle')`; no logger dependency introduced                                                                                                                          |
| Prove the flag with unit tests                                           | Done — default honours a valid cache (no rebuild) while `cache: false` rebuilds; `cache: false` refreshes a stale `config.cache.json`; 355 unit tests pass repo-wide                                                     |
| Prove the cross-process behaviour with integration tests                 | Done — new `test/config.test.ts` with 4 tests; 26 integration tests pass                                                                                                                                                 |

#### Files changed

- `$ART_WORK/cli/work/src/index.ts` — program-level `--no-config-cache` option; every command action now receives the commander `Command` and passes `cache: command.optsWithGlobals().configCache !== false` into `loadWorkspaceConfig` (11 call sites); the `checkouts run` action's shell-command argument was renamed `shellCommand` to free the `command` name for the command object.
- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` — optional `{ cache?: boolean }` second parameter; when `cache === false` the metadata read is skipped, the bundle is always recompiled/overwritten, and the bypass is logged.
- `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts` — two new tests: `GIVEN a valid cache the default honours it and a cache false call rebuilds` (plus bypass log assertion) and `GIVEN the cache option is false a load refreshes the cache metadata`.
- `$ART_WORK/cli/work/test/config.test.ts` — new cross-process suite reusing `setupWorkspace`, `spawnCli`, and the `tempDirs` cleanup (extended with the tracked config-cache dirs): reuse on a second run, edited manifest rebuilds, `--no-config-cache` rebuilds and refreshes `config.cache.json`, and the cache is written under `<workspace root>/node_modules/.art-work/` only — never at the workspace root.

### Verification

| Check                                                                                              | Result                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run ci` from `$ART_WORK` (prettier, eslint, tsc, build, 355 unit tests, 26 integration tests) | PASS                                                                                                                                                                  |
| No `it.todo()` tests remain                                                                        | PASS                                                                                                                                                                  |
| Pre-commit hooks (lefthook: clean, extract, ci) on commit `9548943`                                | PASS                                                                                                                                                                  |
| Every `loadWorkspaceConfig(root)` call site in `index.ts` passes the cache option                  | PASS — 11/11; grep for `loadWorkspaceConfig(root);` returns nothing                                                                                                   |
| `--no-config-cache` accepted where operators expect it                                             | PASS — verified with the built bin: program-level option parses before and after the subcommand; `optsWithGlobals()` reports `configCache: false`                     |
| Second run reuses the cache, an edited manifest rebuilds, `--no-config-cache` forces a rebuild     | PASS — `test/config.test.ts`: `config: reused cached bundle` on run 2, `config: rebuilt bundle` after editing the manifest, bypass + refreshed metadata with the flag |
| No cache artefact at the workspace root                                                            | PASS — `node_modules/.art-work/config.bundle.mjs` and `config.cache.json` exist; no bundle/metadata/legacy file at the root                                           |
| Teardown removes the cache written by each run                                                     | PASS — `tempDirs` cleanup extended with the tracked `<root>/node_modules/.art-work` dirs                                                                              |

### Commits

| Commit    | Message                                                | Policy     | Pushed                  |
| --------- | ------------------------------------------------------ | ---------- | ----------------------- |
| `9548943` | ``build(art-work-cli): Add `--no-config-cache` flag.`` | AUTONOMOUS | Yes — `origin/building` |

## Blockers (if any)

None.

## Feedback

### For the planner

- **Bypass log string kept verbatim.** The instruction specifies `config: cache bypassed,rebuilt bundle` (no space after the comma); implemented exactly as written. If that was a typo, the fix is one character and touches the log line plus two assertions.
- **`checkouts run` name collision.** That action's first argument was already named `command` (the shell command to run). Adding the commander `Command` parameter required renaming the argument to `shellCommand` and passing `command: shellCommand` into `runCheckoutsRun`.
- **"Default honours a valid cache" is not a new test.** The pre-existing `GIVEN a valid cache a second load reuses the bundle without building` already proved it, so the first new unit test proves default-reuse and `cache: false`-rebuild in one flow instead of duplicating coverage.

### For the technical writers

- Iteration `update-config-knowledge` can now document: the program-level `--no-config-cache` flag (usable before or after the subcommand), the `config: cache bypassed,rebuilt bundle` decision log, and `loadWorkspaceConfig`'s optional `{ cache?: boolean }` option on the `/config` authoring surface.

### For the crew

- Integration assertions on `config.cache.json`'s `manifest` field must use `toContain(...)`, not exact equality: the spawned CLI resolves macOS `/var` → `/private/var`, so the recorded path differs from the test's `tempDir` prefix.
