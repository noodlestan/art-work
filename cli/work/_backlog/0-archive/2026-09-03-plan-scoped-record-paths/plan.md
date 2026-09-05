# Plan: Scoped Record Paths

**ID:** `scoped-record-paths`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Replace the single-glob `included`/`ignored` record discovery with scoped, additive `paths` scans so discovery is fast, predictable, and `included` is no longer needed.

**Description:** Introduce a `paths` array of scoped record scans. Each path carries `base`, `pattern`, `ignored`, `excluded`, and `gitignore`. Normalize `records` (top-level defaults plus `paths`) into an array of independent additive scans, each globbing `join(searchPath, base, pattern)` with `exclude = ignored + excluded` (nested excludes, never the base itself) and optionally applying `git check-ignore` when `gitignore: true`. Drop `included` and RegExp patterns.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Replace the single-glob `included`/`ignored` record discovery with scoped, additive `paths` scans. Each scan is anchored to a `base` path, so discovery is fast (no whole-tree recursion for "includes"), predictable, and the `included` option is no longer needed. `included` and RegExp patterns are dropped.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                            |
| --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `_roadmap/_architect.md`                                           | Workspace principles, NFRs, milestones.                         |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-workspace-cli-one/milestone.md` | Coordinates this plan within the Workspace CLI One milestone.   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/config.md` (Design) — The `records` options and discovery logic to update. Relevant for Planning Work Item.

## Scope

Update the `records` config type and record discovery in `$PROJECT/src/config/` and `$PROJECT/src/private/records/`, and document the new options in `$PROJECT/architecture/config.md`.

## Work

### Next

Refine the first `PLANNING` iteration: `scoped-record-paths`.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions       | Status |
| ------------------------------ | ------ |
| Iteration: Scoped Record Paths | `DONE` |

### Iteration: Scoped Record Paths

**Id:** `scoped-record-paths`

**Status:** `DONE`

**Purpose:** Replace the single-glob `included`/`ignored` record discovery with scoped, additive `paths` scans so discovery is fast, predictable, and `included` is no longer needed.

**Description:** Introduce a `paths` array of scoped record scans. Each path carries `base`, `pattern`, `ignored`, `excluded`, and `gitignore`. Normalize `records` (top-level defaults plus `paths`) into an array of independent additive scans, each globbing `join(searchPath, base, pattern)` with `exclude = ignored + excluded` (nested excludes, never the base itself) and optionally applying `git check-ignore` when `gitignore: true`. Drop `included` and RegExp patterns.

**Instructions:** `./plan-scoped-record-paths/instructions/scoped-record-paths.md`

**Changes:**

- Change `WorkspaceConfig['records']` to `Partial<WorkspaceRecordsPath> & { paths?: Partial<WorkspaceRecordsPath>[] }` with `WorkspaceRecordsPath = { base: string; pattern: string | string[]; ignored: string[]; excluded: string[]; gitignore: boolean }`; drop `included` and `dotignored` (replaced by `gitignore: boolean`).
- Add a `normalizeRecordPaths(records)` helper producing fully-resolved path scans: if `paths` is empty, a single path from the top-level defaults (base default `'.'`); otherwise each path inherits top-level defaults overridden by its own fields (`ignored` is a full override; `excluded` merges).
- In `findRecordFiles`, iterate the normalized paths, globbing `join(searchPath, base, pattern)` with `exclude = ignored + excluded` (nested excludes, not the base), optionally applying `git check-ignore` when `gitignore: true`; union and dedupe results.
- Glob each path with the async `glob` (Node `fs/promises`), passing `exclude` as an array of absolute base-anchored patterns.
- Remove `filterByPatterns`, `getIgnoredSet`, `filterBuiltInExcludes`, and the `included`/RegExp machinery.
- Document the new `records` shape and discovery logic in `architecture/config.md` under a new `## Options overview` section.

**Dependencies:**

- None.

#### Commits:

| ID                    | Repository / Checkout / Branch                          | Policy       | Hash      | Status      |
| --------------------- | ------------------------------------------------------- | ------------ | --------- | ----------- |
| `scoped-record-paths` | Workspace CLI / `$PROJECT` / `plan-scoped-record-paths` | `AUTONOMOUS` | `dfbd9d8` | `COMMITTED` |

##### Commit: `scoped-record-paths`

**Repository:** Workspace CLI

**Message:**

```
build(workspace-cli): Introduce config records.paths options for scoped scans.

- Add `paths` array with base/pattern/ignored/excluded/gitignore per scan.
- Normalize records into independent additive scans; drop `included` and RegExp.
- Glob each path with `exclude = ignored + excluded`; apply git check-ignore when enabled.
- Document records options in architecture/config.md.
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- None.

### Knowledge to Update

- `architecture/config.md` — document the new `records` options under `## Options overview`.

### Follow Ups

- None.

### Feedback

- None.
