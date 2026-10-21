# Report: refetch-control-and-sync-fix

**Iteration Id:** `refetch-control-and-sync-fix`
**Plan:** `parallel-scanning`
**Status:** COMPLETED

## Summary

Completed all 7 steps of the iteration. 3 commits made, all pushed to remote. All 253 tests pass.

## Changes Made

### Step 1 / 7 — Add `refetch` parameter to `scanAllCheckoutsStates`

Already committed in a prior iteration. The function already accepts `refetch = false` and forwards it to `scanCheckoutState`.

### Step 2 / 7 — Commit `add-refetch-to-scan-all`

Already committed prior to this iteration.

### Step 3 / 7 — Add `--refetch` option to `sanity` command

- Modified `runSanity.ts`: changed options type from `{ auto: boolean }` to `{ auto: boolean; refetch?: boolean }`, passed `options.refetch` to both `scanAllCheckoutsStates` and `scanWorkspaceCheckout`.
- Modified `index.ts`: added `--refetch` boolean flag to sanity command option parsing.

### Step 4 / 7 — Commit `add-refetch-to-sanity`

Committed as `7c6b9cc`.

### Step 5 / 7 — Fix `runSync` stale checkout and remove redundant workspace scan

- Modified `runSync.ts`: captured `doPullCheckout` return value as `pulled`, used it for push decision instead of the stale `checkout`.
- Removed redundant `scanWorkspaceCheckout` call before `syncWorkspaceCheckout`.
- Modified `syncWorkspaceCheckout.ts`: made it self-sufficient by creating and scanning the workspace checkout when `ctx.workspace` is absent, enabling the removal of the pre-scan in `runSync`.

### Step 6 / 7 — Commit `fix-sync-stale-checkout`

Committed as `aa0908e`.

### Step 7 / 7 — Update tests

- `scanAllCheckoutsStates.test.ts`: added test verifying `refetch: true` detects remote advances.
- `runSanity.test.ts`: added test verifying `sanity --refetch` produces accurate ahead/behind data.
- `runSync.test.ts`: added test verifying push is skipped when pull fails (bad remote).
- `syncWorkspaceCheckout.test.ts`: updated test for self-sufficient workspace creation behavior.

### Commit `cover-refetch-and-sync-fix`

Committed as `2043c80`.

## Commits

| Hash      | Message                                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| `7c6b9cc` | build(workspace-cli): Add --refetch option to sanity command.                       |
| `aa0908e` | fix(workspace-cli): Fix stale checkout in sync and remove redundant workspace scan. |
| `2043c80` | test(workspace-cli): Cover refetch parameter and fixed sync behaviour.              |

## Verification

- `npm run lint` — pass
- `npm run build` — pass
- `npm run test` — 253 tests pass (66 test files)

## Push

Successfully pushed to `building` branch on remote `github.com:noodlestan/art-domains.git`.

## Blockers

None.
