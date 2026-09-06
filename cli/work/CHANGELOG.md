# CHANGELOG

## 0.0.19

### Added

- **Checkouts run command:** Run arbitrary commands across selected checkouts with `art-workspace checkouts run <command...> [-c <PATTERN...>] [-A, --all]`.
- **Scoped operations:** Add `--checkouts <PATTERN...>` (shorthand `-c`) to `pull`, `push`, `sync`, and `branch` with exact and wildcard matching against checkout name and location.
- **Scoped records discovery:** Add `records.paths` configuration for additive, base-anchored record scans with per-path `ignored`/`excluded`/`gitignore` options.
- **Live operation logging:** Stream pending operations as `...doing: {operation} {repo} {details}` before they complete, with ⏳/🟢/🔴 rendering.
- **Parallel scanning:** Scan and process checkouts concurrently with bounded concurrency in `sanity`, `pull`, `push`, and `sync`.
- **Opt-in refetch:** Add `--refetch` to `sanity` for fresh ahead/behind data; cheap local counts by default.

### Fixed

- **Sync decision:** Use the post-pull checkout state for the push decision in `sync` (stale-checkout bug).
- **Ahead/behind counting:** Replace per-branch network fetches with a single `remoteFetch` plus one local `rev-list` inspection; remove redundant workspace pre-scan in `sync`.

### Changed

- **Operation model:** Rename operation-kind factories to `create*Operation`; derive success/failure generically from the pending instance; add `finishedTs`/`timing()` to the operation base.
- **Operations report:** Add checkout and timing columns; middle-truncate messages to 50 chars.
- **Command arguments:** Require `-c` or `--all` in `pull`, `push`, `sync`, and `branch`; remove the implicit all-checkouts fallback.
- **Branch command:** Replace the positional `[checkouts...]` argument with the `--checkouts` option.
- **Record discovery:** Drop `included` and RegExp patterns in favour of scoped `paths` scans.
- **Operation rename:** Rename `branch created` operation to `branch`.

### Tested

- **Checkout run:** Pattern filtering, `--all`, usage guard, execution success/failure, uncloned checkout, and inner-flag `--` convention.
- **Pattern matching:** Exact and wildcard matching, deduplication, no-match warnings, and unscoped invocations.
- **Parallel scanning:** Concurrent scanning with deterministic ordering; combined ahead/behind counting and fallbacks.
- **Refetch:** Cheap-vs-refetch scan behaviour and `sanity --refetch`.
- **Operations:** Pending/success/failure log lines and live streaming.

### Documented

- **Architecture:** Update `commands.md`, `_pseudo.md`, `config.md`, `operations-log.md`, and `reports.md` for the new command surface, operation model, and record discovery options.

## 0.0.18

### Added

- **Workspace State:** Show workspace root status in `sanity` report.
- **Sync commands:** Apply pull/push/sync logic to the workspace root in `pull`, `push`, `sync`, and `sanity` commands.

### Fixed

- **Behind detection:** Fix false positives and false negatives by fetching the remote branch before computing the behind count in `getBehindCount`.

## 0.0.17

### Added

- **Record discovery:** Recursively discover `.art` records with configurable filename patterns and record-kind filtering.
- **Checkout record tracking:** Preserve discovered filenames so updates write the original records in place.

### Fixed

- **Repo command:** Resolve checkouts by location when their name does not match.
- **Repo command:** Keep package reports grouped beneath their repository reports and distinguish multiple checkouts of the same repository.

### Changed

- **Configuration:** Move checkout persistence settings to top-level `checkouts` and add configurable `records.pattern` discovery settings.

### Tested

- **Repo command:** Add regression coverage for checkout identification and grouped repository/package reporting.

### Documented

- **Architecture:** Update Art Work Cli knowledge and pseudo-code for dynamic loading and checkout-keyed reporting.

## 0.0.16

### Fixed

- **Clone command:** Scan checkouts before presenting checkout report.
- **Sanity command:** Fix false "extraneous checkout" flag for known checkouts.
- **Scan state:** Fix wrong branch warning for extraneous checkouts with empty record branch.
- **Clone command:** Detect wrong remote in checkout report.
- **Clone command:** Respect record branch when cloning (checkout correct branch after clone).
- **Clone command:** Allow second checkout of same repo at different location.
- **Clone command:** Refuse clone when target directory already exists.
- **Clone command:** Fix custom location producing wrong checkout name and path.

## 0.0.15

### Added

- **Pull command:** Pull from origin for all clean checkouts with `art-workspace pull`.
- **Push command:** Push to origin for all clean checkouts with `art-workspace push`.
- **Sync command:** Pull then push for all clean checkouts with `art-workspace sync`.
- **Workspace status:** Show workspace root status before checkout status in sanity report.
- **Is behind detection:** Detect and display behind state for checkouts.
- **Auto-pull in sanity:** `art-workspace sanity --auto` pulls if behind before pushing.

### Fixed

- **Clone command:** Scan checkouts before presenting checkout report in clone use case.
- **Repo command:** Resolve package paths correctly with fallback logic for inconsistent namespace paths.
- **Repo command:** Skip npm info when package.json is missing or has no version.
- **Repo command:** Suppress stderr in npm info calls to avoid 404 error noise.
- **Repo command:** Resolve checkout names with 4-step resolution (exact match → strip prefix → slug format → location fallback).

### Changed

- **Refactor:** Decouple checkout scan state from stored Checkout type.
- **Refactor:** Model CheckoutScan as operation guards over states.
- **Refactor:** Decouple private layer from WorkspaceContext.
- **Refactor:** Move checkout store updates to scan call sites.

## 0.0.14

### Added

- **Repo command:** List repositories, namespaces, and packages with version and publish state.
- **Sanity report:** Show workspace as first-class checkout before checkouts section.

### Fixed

- **Clone report:** Show checkout list once and only for scanned repos.
- **Repo command:** Resolve package states correctly by fixing namespace record parser for multi-line list format.

## 0.0.13

### Added

- **Branch command:** Create/switch branches across checkouts.

### Fixed

- **Clone command:** Allow multiple checkouts of same repo at different locations.

## 0.0.12

### Added

- **Sanity command:** Check git status across all repos with `--auto` push.
- **Clone command:** Idempotent clone with checkout records.
- **Config:** `defineConfig` and workspace manifest loader.
- **Checkout records:** Persistent checkout state tracking.
