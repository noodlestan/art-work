# Parking Lot: Workspace CLI

The high level briefing, principles, requirements are in `_roadmap/_architect.md`. Backlog plans are derived from here.
The plans live in `_backlog/` and contain delegatable instructions.
This file is the tracker and parking lot. Column convention: **ACTIONABLE** / **PENDING** / **BLOCKER** / **FOLLOW-UPS** (not in scope). No done items here — completed work is recorded in `_backlog/`.

## Parking Lot

### PENDING FEATURES

None current.

### ACTIONABLE

- **ScanCheckoutState should not do git checks in dirs without .git** — Some scan heuristics in `cli/workspace/src/private/scan/scanCheckoutState.ts` inherit state from parent dir when `.git` not present. Exampole. Create `hasGitDir` check, bypass others (exactly which?) when `.git` not present. Create `createGitDirState(hasGit)` and add before anything else.
- **Fix `--version` showing stale version** — `npm run workspace -- --version` shows `0.0.9` but package is at `0.0.14`. Investigate why version is not being read from package.json correctly.
- **Verify remaining bugs** — check if other bugs in the BUGS table are still valid (clone edge cases, extraneous items, etc.)
- **Fix operations log shows repo name instead of checkout** — investigate if all operations add a checkout - it's possible that a clone operation failure logs only the repository name or (unnknown) and bails out without determining a loggable checkout name - change report to present 2 columns repo and "checkout" - ALSO: change the checkouts column "location" to be "checkout" as well.
- **Cache scan results / reduce redundant re-scans** — follow-up from `plan-log-process-as-it-happens`: `runSync` re-scans each pulled+pushed checkout up to 3× (initial + after pull + after push) plus workspace re-scans; consider caching scan results and/or batching the fetch (fetch batching is now handled by `plan-parallel-scanning`; the repeated re-scan is not).
- **Apply filename-carrying pattern to other record kinds** — follow-up from `plan-discover-records`: currently only checkout records are mutable and carry a filename; generalize to other record kinds as they become read/write.
- **Extract Git-ignore filtering into a reusable filesystem service** — follow-up from `plan-discover-records`: reuse gitignore-aware filtering outside record discovery if future commands need it.

### PENDING

- **Injectable Presentation** — Testing command usage of presentation layer requires setup mocking or assertion on presenters. Consider refactoring presentation to make it injectable. Configuration and the strategy pattern would go a long way here.

- **Investigate `$WORKSPACE/.agents/domains/changelogs/`** — separate domain for changelog management. Should be dependency of engineering domain (like plans). Own structures, agent modes (if any), skills. `write-changelog` skill already exists — may need expansion. Changelogs generated from completed plans in backlogs. Example: `_backlog/1-done/`.

### BLOCKER

- None current.

### FOLLOW-UPS (not in scope)

- Evaluate turbo remote caching for cross-repo builds.
- Archive the legacy `noodlestan/eslint-config` repo after its package is consumed via npm.
