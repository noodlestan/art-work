# Sub-Agent REPORT (#producer)

**Plan:** `add-config-cache`

**Iteration Id:** `update-config-knowledge`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                                                    | Outcome                                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A reader can author a config and discover the cache-bypass flag from the package README | `## Config` (sample manifest) and `## Options` (`--no-config-cache`) added              |
| Maintainers know where the cache lives and how it is invalidated                        | `### Cache` (where, automatic invalidation, manual bust) added to the config design doc |

#### Files changed

- `cli/work/README.md` — Added `## Config` (with `defineConfig` sample manifest) after `## Installation`, before `## Usage`; added `## Options` (with the `--no-config-cache` entry) after the `### Commands` list, before `## Development`.
- `cli/work/architecture/design/config.md` — Added `### Cache` under `## Overview`, before `## Configuration Structure`, documenting location (`<workspace root>/node_modules/.art-work/` holding `config.bundle.mjs` and `config.cache.json`), automatic invalidation (sha256 per esbuild `metafile.inputs`; changed/missing/unreadable input, missing bundle, unparseable metadata, or `version` mismatch triggers rebuild), and manual bust (`--no-config-cache` or deleting the cache dir).

Documented behaviour verified against `src/config/loadWorkspaceConfig.ts` and its private helpers (`cache.ts`, `findReusableBundlePath.ts`, `readConfigCacheMeta.ts`, `hashConfigInputs.ts`) plus the `--no-config-cache` option in `src/index.ts`. No unit test changes — documentation only.

### Verification

- Final verification checklist: `## Config` after `## Installation` and before `## Usage`; `## Options` after the `### Commands` list and before `## Development`; `### Cache` under `## Overview` before `## Configuration Structure`; documented behaviour matches the loader source.
- `npm run ci` from the Art Work root: lint, build, unit tests (355 passed, 89 files), integration tests (26 passed, 2 files) — all green.
- Commit `298d6dc` `docs(art-work-cli): Document config cache and no-config-cache option.` committed and pushed to `origin/building`.

## Blockers (if any)

None.

## Feedback

No feedback requested.
