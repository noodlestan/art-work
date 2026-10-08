# Parking Lot: Art Work Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work), **FOLLOW-UPS** (not in scope). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in plans if applicable).

## Parking Lot

### PENDING FEATURES

None current.

### ACTIONABLE

- **Cache scan results / reduce redundant re-scans** — follow-up from `plan-log-process-as-it-happens`: `runSync` re-scans each pulled+pushed checkout up to 3× (initial + after pull + after push) plus workspace re-scans; consider caching scan results and/or batching the fetch (fetch batching is now handled by `plan-parallel-scanning`; the repeated re-scan is not).
- **Extract Git-ignore filtering into a reusable filesystem service** — follow-up from `plan-discover-records`: reuse gitignore-aware filtering outside record discovery if future commands need it.

### PENDING

- **Injectable Presentation** — Testing command usage of presentation layer requires setup mocking or assertion on presenters. Consider refactoring presentation to make it injectable. Configuration and the strategy pattern would go a long way here.
- **Investigate `$WORKSPACE/.agents/domains/changelogs/`** — separate domain for changelog management. Should be dependency of engineering domain (like plans). Own structures, agent modes (if any), skills. `write-changelog` skill already exists — may need expansion. Changelogs generated from completed plans in backlogs. Example: `_backlog/1-done/`.

### BLOCKER

- None current.

### FOLLOW-UPS (not in scope)

- Evaluate turbo remote caching for cross-repo builds.
- Archive the legacy `noodlestan/eslint-config` repo after its package is consumed via npm.
