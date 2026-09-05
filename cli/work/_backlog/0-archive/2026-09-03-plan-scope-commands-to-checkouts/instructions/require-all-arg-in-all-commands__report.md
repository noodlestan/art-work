# Sub-Agent REPORT (#producer)

**Plan:** `scope-commands-to-checkouts`

**Iteration Id:** `require-all-arg-in-all-commands`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Require `-c <pattern>` or `--all` in `pull`, `push`, `sync`, and `branch`. Remove implicit all-checkouts fallback. Update `-c` description.

#### Files changed

- `src/index.ts` — Updated `-c` description to verbose format with examples; added `-A, --all` option to pull, push, sync, branch; updated action handlers to pass `all` flag.
- `src/commands/pull/runPull.ts` — Updated signature to accept `{ checkouts?: string[]; all?: boolean }`; added validation requiring `-c` or `--all`; removed `getAllCheckouts()` fallback.
- `src/commands/push/runPush.ts` — Updated signature to accept `{ checkouts?: string[]; all?: boolean }`; added validation requiring `-c` or `--all`; removed `getAllCheckouts()` fallback.
- `src/commands/sync/runSync.ts` — Updated signature to accept `{ checkouts?: string[]; all?: boolean }`; added validation requiring `-c` or `--all`; removed `getAllCheckouts()` fallback.
- `src/commands/branch/runBranch.ts` — Updated signature to accept `{ branch: string; checkouts?: string[]; all?: boolean }`; added validation requiring `-c` or `--all`; removed `getAllCheckouts()` fallback.
- `src/commands/pull/runPull.test.ts` — Updated all test calls to use `{ all: true }` instead of relying on implicit fallback.
- `src/commands/push/runPush.test.ts` — Updated all test calls to use `{ all: true }` instead of relying on implicit fallback.
- `src/commands/sync/runSync.test.ts` — Updated all test calls to use `{ all: true }` instead of relying on implicit fallback.
- `src/commands/branch/runBranch.test.ts` — Updated test call to use `{ all: true }` instead of `checkouts: []`.
- `architecture/commands.md` — Updated command surface table with `[--all]`; added `--all` to Command Arguments section; updated pull, push, sync, branch usage lines.
- `architecture/_pseudo.md` — Updated pull, push, sync, branch pseudo-code to include `--all` validation and new branching logic.
- `_backlog/3-now/plan-scope-commands-to-checkouts/plan.md` — Updated iteration status to `WORKING`.

## Blockers (if any)

None.

## Feedback

### For the planner

Instructions were clear and complete. All mandatory reading files were accessible and the steps were well-defined.

### For the technical writers

No issues found.

### For the crew

No issues found.
