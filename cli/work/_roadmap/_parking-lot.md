# Parking Lot: Art Work Roadmap

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in milestones if applicable).

## Parking Lot

### ACTIONABLE

- None.

### PENDING

- **Cache scan results / reduce redundant re-scans** — follow-up from `plan-log-process-as-it-happens`: `runSync` re-scans each pulled+pushed checkout up to 3× (initial + after pull + after push) plus workspace re-scans; consider caching scan results and/or batching the fetch (fetch batching is now handled by `plan-parallel-scanning`; the repeated re-scan is not).
- **Extract Git-ignore filtering into a reusable filesystem service** — follow-up from `plan-discover-records`: reuse gitignore-aware filtering outside record discovery if future commands need it.
- **Injectable Presentation** — Testing command usage of presentation layer requires setup mocking or assertion on presenters. Consider refactoring presentation to make it injectable. Configuration and the strategy pattern would go a long way here.

### BLOCKERS

- None.
