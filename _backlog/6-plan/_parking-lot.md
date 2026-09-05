# Parking Lot: Workspace CLI Planning

This file is a temp tracker and parking lot. Column convention: **ACTIONABLE** / **PENDING** / **BLOCKER** / **FOLLOW-UPS** (not in scope). No done items here — completed work is recorded in `_backlog/`.

## Parking Lot

### ACTIONABLE

- **Restructure `repo` into repos management** — `repos add <path>`, `repos discover <path>`, `repos clone <remote>`, `repo remove <name>`. Rationale: the current `repo` command loads a project graph and lists package states — read-only reporting that belongs to the package domain, not repo management. Repo should manage the manifest: discover, add, remove.
- **Relocate the current `repo` listing to `packages list` / `packages status`** — the project-graph → package.json → npm info reporting moves to the package group. Rationale: keeps `repo` management-only; the listing is package-state reporting. Decide the group name (`package` vs `packages`) before implementing.
- **Replace flat `clone` with `checkouts clone`** — `checkout clone [--all] [-c, --checkouts <PATTERN...>]`; noop unless `--all` or `--checkouts` given. Rationale: today's `clone` conflates manifest-clone with a no-arg status mode; nesting splits concerns. NOTE: no-arg mode should output no op made + usage. It should also take --location argument (applied to all checkouts matched).
- **`checkouts remove -c, --checkouts <patterns...>`** — remove matching checkout records; `--wipe` deletes the actual checkouts; safe-stop at uncommitted/behind; `--force` overrides. Shares the safe-stop logic with `repos remove` — extract one shared helper.
- **`repos remove -r, --repos <patterns...>`** — remove matching repos records and all its checkout records; `--wipe` deletes actual checkouts; safe-stop at uncommitted/behind; `--force` overrides.

### PENDING

- **`package publish`** — move flat `publish` under the package group. Note: `publish` also pushes first — spans repo+package concerns; decide whether the push stays inside publish or becomes a separate step.
- **`package link` / `package unlink` / `package links`** — move flat link/unlink/links under the package group (future).
- **Nest `pull`/`push`/`sync`/`branch` under `checkout`** — they operate on checkouts; future, not in current plans.

### BLOCKER

- None current.

### FOLLOW-UPS (not in scope)

- None.
