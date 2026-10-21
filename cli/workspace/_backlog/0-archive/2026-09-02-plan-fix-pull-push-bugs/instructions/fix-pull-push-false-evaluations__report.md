# Sub-Agent REPORT (#producer)

**Plan:** `fix-pull-push-bugs`

**Iteration Id:** `fix-pull-push-false-evaluations`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Fixed the behind detection system to accurately report behind/ahead state on all checkouts, eliminating both false positives (behind when clean) and false negatives (not behind when actually behind). Resolved bugs `pull-behind-false-positive` and `pull-behind-false-negative`.

**Root cause:** `getBehindCount` computed `git rev-list --count HEAD..origin/<branch>` against the **local** `origin/<branch>` tracking reference, which is only updated by `git fetch`. Neither `scanAllCheckoutsStates` nor the `pull`/`sync`/`sanity` commands ran `git fetch` before scanning. This produced:

- **False negative** — checkout IS behind, but the stale local tracking ref shows `behind = 0`, so no pull is attempted.
- **False positive** — checkout is up to date, but a stale/advanced tracking ref shows `behind > 0`, so an unnecessary pull is attempted.

**Fix:** `getBehindCount` now runs `git fetch origin <branch>` before computing the behind count, so the count reflects the actual remote state. If the remote is unreachable (fetch fails), it falls back to the local tracking reference so the scan still reflects the last known state instead of silently reporting clean (preserving the sanity pull-failure flow).

#### Files changed

| File                                     | Change                                                                                                                                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/private/git/getBehindCount.ts`      | Added a `git fetch origin <branch>` before computing `HEAD..<remoteBranch>`; on fetch failure, fall back to the local tracking reference.                                                                             |
| `src/private/git/getBehindCount.test.ts` | Added false-negative (behind on stale tracking ref, no manual fetch) and false-positive (up to date with stale tracking ref) scenarios; kept existing behind / up-to-date / failure cases.                            |
| `src/commands/pull/runPull.test.ts`      | Renamed the behind case to assert pull happens without a prior manual fetch (false-negative regression); added an up-to-date real-origin case that reports no issue and performs no pull (false-positive regression). |
| `src/commands/sync/runSync.test.ts`      | Added a false-negative case asserting sync pulls when behind without a prior fetch.                                                                                                                                   |

### Validation

Ran the full `Verifying Completion` stack from the package directory:

- `npm run lint:fix` — formatting clean
- `npm run lint` — prettier, eslint, `tsc --noEmit` pass
- `npm run build` — passes
- `npm run test` and `npm run ci` — 64 test files / 229 tests pass; no `it.todo()` tests

### Commit

- `06b98b9` `fix(workspace-cli): fix behind detection false positives and false negatives.` — policy `NOPUSH`, created and **not pushed** (no upstream configured).

### Knowledge update (Step 6) — not needed

The fix did not change any function signature (`getBehindCount` remains `(dir: string, remoteBranch: string): Promise<number>`), did not change command behaviour contracts, and did not alter the pseudo-code contract in `architecture/commands.md` or `architecture/_pseudo.md`. Per the instruction's conditional note, commit `update-behind-knowledge` was skipped.

### Bug verification

- **`pull-behind-false-positive` resolved:** a clean checkout up to date with a real origin reports no behind issue and performs no pull (covered in `runPull.test.ts`).
- **`pull-behind-false-negative` resolved:** a genuinely-behind checkout reports "1 commit(s) behind" and pulls, even without a prior manual fetch (covered in `runPull.test.ts`, `runSync.test.ts`, and `getBehindCount.test.ts`).
- `pull`, `sync`, and `sanity --auto` all share the same scan flow (`scanAllCheckoutsStates` → `scanCheckoutState` → `getBehindCount`), so all three benefit from the fix.

## Blockers (if any)

None.

## Feedback

None requested.
