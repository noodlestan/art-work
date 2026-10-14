# Parking Lot: Art Board Cli Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in plans if applicable).

## Parking Lot

### ACTIONABLE

- None.

### PENDING

- **Capture Art Lib dependency surface** — when the Art Lib plan lands, declare the commander wrapper, config, logger, and operations packages as `Package Dependency` records in `_records/package.art`, replacing the TBD runtime dependencies.
- **Confirm Opencode session libraries** — identify the exact Opencode library/SDK used to talk to Opencode sessions and pin it in `_records/package.art`.
- **Scaffold the CLI package** — `package.json`, tsconfig, build config, `LICENSE-MIT`, `src/`, and `test/`, following the `cli/work` package layout and the `CLI Package` + `Package Common` scaffolder skeletons.
- **Write package knowledge** — populate `knowledge/index.md` with overview and command-surface design documents.
- **Publish `@art-board/cli`** — publish ASAP; flip `NPM Package Deployment: Art Board Cli` from `PLANNED` to `DEPLOYED`.

### BLOCKERS

- None.
