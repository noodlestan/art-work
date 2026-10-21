# Plan: Log Process as it Happens

**ID:** `log-process-as-it-happens`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Stream operations through the operations log as they happen, so pending operations show immediately as `...doing: {operation} {repo} {details}` before they complete.

**Description:** Introduce a `pending` outcome and per-operation pending types, rename `branch created` to `branch`, extract a shared `makeOperationLogLine` presenter with ⏳/🟢/🔴 rendering, pass a live logger into `createOperationsLog`, and wire it in `src/index.ts`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Add `pending` operations to the type model, stream them live through the operations log, and present `doing:` lines as operations are issued (before they complete), while keeping completed/failed reporting intact.

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
::READ `architecture/operations-log.md` (Model) — OperationsLog and Operation semantics. Read-only reference; do not edit. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Operation kinds. Relevant for Planning Work Item.
::READ `architecture/commands.md` (Design) — Designed behaviour and BDD scenarios for the branch operation. Relevant for Planning Work Item.
::READ `architecture/reports.md` (Reports) — Operations Report format. Relevant for Planning Work Item.

## Scope

Update the operation type model and logging/presentation in `$PROJECT/src/private/` and `$PROJECT/src/index.ts`, and rename `branch created` to `branch` across the package (excluding `_backlog`).

## Work

### Next

Plan complete; all iterations `DONE`.

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

| Iteration / Instructions                  | Status |
| ----------------------------------------- | ------ |
| Iteration: Add Pending Operation Types    | `DONE` |
| Iteration: Stream Pending Operations Live | `DONE` |
| Iteration: Output Pending Operations      | `DONE` |
| Iteration: Scoped Record Paths            | `DONE` |

### Iteration: Add Pending Operation Types

**Id:** `add-pending-operation-types`

**Status:** `DONE`

**Purpose:** Extend the operation type model with a `pending` outcome and per-operation pending types so operations can be logged before they complete.

**Description:** Add `pending` to `OperationOutcome`; introduce `OperationPending` and a pending variant for each operation kind; rename `branch created` to `branch`; reorder types to match the export order; extend the `Operation` union with all pending types.

**Instructions:** `./plan-log-process-as-it-happens/instructions/add-pending-operation-types.md`

**Report:** `./plan-log-process-as-it-happens/instructions/add-pending-operation-types__report.md`

**Changes:**

- In `src/private/operations/types.ts`, change `OperationOutcome` to `'pending' | 'success' | 'failure'`.
- Add `OperationPending extends OperationBase { outcome: 'pending' }`, then a per-operation pending type (e.g. `ClonePending extends OperationPending { operation: 'clone'; location: string }`) for each kind — clone, push, pull, publish, branch, linked, unlink — carrying the same kind-specific fields as the matching success/failure types.
- Rename `branch created` to `branch` everywhere in the package, excluding `_backlog`: `types.ts`, `createBranchSuccess.ts`, `createBranchFailure.ts`, `runBranch.test.ts`, and the `architecture/` knowledge docs (`_pseudo.md`, `commands.md`, `index.md`, `operations-log.md` — note the latter is read-only and must be mirrored rather than edited).
- Reorder the type declarations in `types.ts` to match the order used in the `Operation` union export.
- Extend the `Operation` union so each kind lists `Pending | Success | Failure` (e.g. `| ClonePending | CloneSuccess | CloneFailure`).

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch                                | Policy       | Hash      | Status      |
| ----------------------------- | ------------------------------------------------------------- | ------------ | --------- | ----------- |
| `add-pending-operation-types` | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | `19cd900` | `COMMITTED` |
| `rename-branch-created`       | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | `6058533` | `COMMITTED` |

##### Commit: `add-pending-operation-types`

**Repository:** Workspace CLI

**Hash:** `19cd900`

**Status:** `COMMITTED`

**Message:**

```
build(workspace-cli): add pending operation types.

- Add `pending` outcome and `OperationPending` with per-operation pending types.
- Reorder operation types to match the `Operation` union export.
- Extend the `Operation` union with `Pending | Success | Failure` per kind.
```

##### Commit: `rename-branch-created`

**Repository:** Workspace CLI

**Hash:** `6058533`

**Status:** `COMMITTED`

**Message:**

```
renames(workspace-cli): rename branch created operation to branch.

- Rename `branch created` to `branch` in operation types, factories, and tests.
- Mirror the rename in architecture knowledge docs.
```

### Iteration: Stream Pending Operations Live

**Id:** `stream-pending-operations-live`

**Status:** `DONE`

**Purpose:** Stream pending operations through the logger as they are issued, and present a `doing:` line for each.

**Description:** Pass a logger into `createOperationsLog`; when a `pending` operation is logged, call the logger and do not append it to the store; extract a shared `makeOperationLogLine` presenter handling ⏳/🟢/🔴; wire a live logger in `src/index.ts`.

**Instructions:** `./plan-log-process-as-it-happens/instructions/stream-pending-operations-live.md`

**Report:** `./plan-log-process-as-it-happens/instructions/stream-pending-operations-live__report.md`

**Changes:**

- In `src/private/log/createOperationsLog.ts`, accept a `logger: (op: OperationPending) => void` parameter (optional, default no-op so existing callers and test helpers still compile). In `log(operation)`, before pushing: when `operation.outcome === 'pending'`, call `logger(operation)` and return without pushing.
- In `src/private/present/presentOperationsReport.ts`, extract the `rows = operations.map(...)` logic into `makeOperationLogLine(op: Operation): string[]`, rendering `⏳` for `pending`, `🟢` for `success`, `🔴` for `failure` in the leading column, with repo, operation, message columns. Reuse it in `presentOperationsReport`.
- Add simple tests for `makeOperationLogLine` covering all three outcomes (pending, success, failure) and for the logger streaming a pending operation in `createOperationsLog`.
- In `src/index.ts`, build `const logger = (op: OperationPending) => { console.log(makeOperationLogLine(op)) }` and pass it into the command handlers' `createOperationsLog(logger)` so pending operations print `...doing: {operation} {repo} {details}` as they are issued.

**Dependencies:**

- `add-pending-operation-types` — pending types must exist before streaming them.

#### Commits:

| ID                          | Repository / Checkout / Branch                                | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------------------------------------- | ------------ | --------- | ----------- |
| `stream-pending-operations` | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | `6d6458f` | `COMMITTED` |
| `wire-live-logger`          | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | `0b004f7` | `COMMITTED` |

##### Commit: `stream-pending-operations`

**Repository:** Workspace CLI

**Hash:** `6d6458f`

**Status:** `COMMITTED`

**Message:**

```
build(workspace-cli): stream pending operations through the log.

- Add optional logger to `createOperationsLog`; pending operations are logged live and not stored.
- Extract `makeOperationLogLine` with ⏳/🟢/🔴 rendering and reuse in the operations report.
- Add tests for the three outcomes and live streaming.
```

##### Commit: `wire-live-logger`

**Repository:** Workspace CLI

**Hash:** `0b004f7`

**Status:** `COMMITTED`

**Message:**

```
build(workspace-cli): wire live operation logger in index.

- Log pending operations as `doing: {operation} {repo} {details}` via `makeOperationLogLine`.
```

### Iteration: Output Pending Operations

**Id:** `output-pending-operations`

**Status:** `DONE`

**Purpose:** Emit pending operations before starting commands and supporting operations, so `doing:` lines stream immediately and supporting work is visible.

**Description:** Emit pending operations before commands and scans; thread ctx through scan/load so they log their own operations; extract pure git helpers with do\* orchestrators owning scan and store updates.

**Instructions:** `./plan-log-process-as-it-happens/instructions/output-pending-operations.md`

**Report:** `./plan-log-process-as-it-happens/instructions/output-pending-operations__report.md`

**Changes:**

- Make all commands emit a pending operation before starting their side effect (pull, push, sync, branch, clone, link, unlink, publish).
- Emit pending scan operations when scanning a checkout, reporting only pending scans (no success/failure scan operations).

**Dependencies:**

- `stream-pending-operations-live` — pending types, logger, and presenter must exist before emission.

#### Commits:

| ID                        | Repository / Checkout / Branch                                | Policy       | Hash      | Status      |
| ------------------------- | ------------------------------------------------------------- | ------------ | --------- | ----------- |
| `emit-pending-operations` | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | `e6f46ff` | `COMMITTED` |
| `emit-scan-operations`    | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `MANUAL`     | `da9a76d` | `COMMITTED` |

##### Commit: `emit-pending-operations`

**Repository:** Workspace CLI

**Hash:** `e6f46ff`

**Status:** `COMMITTED`

**Message:**

```
build(workspace-cli): emit pending operations before starting commands.

- Add `create*Pending` factories and log a pending operation before each command's side effect.
- Wire pending emission in pull/push/sync/branch/clone command handlers.
```

##### Commit: `emit-scan-operations`

**Repository:** Workspace CLI

**Hash:** `da9a76d`

**Status:** `COMMITTED`

**Message:**

```
build(workspace-cli): Log pending operations; refactor to inject ctx where needed.

- Thread ctx through scan/load functions so they can log their own operations.
- Extract pure git helpers; do* orchestrators own scan and store updates.
- Emit a 'command' pending operation at the start of every run command.
- Add generic operation factories and the makeOperationLogLine presenter.
```

### Iteration: Scoped Record Paths

**Id:** `scoped-record-paths`

**Status:** `DONE`

**Purpose:** Replace the single-glob `included`/`ignored` record discovery with scoped, additive `paths` scans so discovery is fast, predictable, and `included` is no longer needed.

**Description:** Introduce a `paths` array of scoped record scans. Each path carries `base`, `pattern`, `ignored`, `excluded`, and `gitignore`. Normalize `records` (top-level defaults plus `paths`) into an array of independent additive scans, each globbing `join(searchPath, base, pattern)` with `exclude = ignored + excluded` (nested excludes, never the base itself) and optionally applying `git check-ignore` when `gitignore: true`. Drop `included` and RegExp patterns.

**Instructions:** `./plan-log-process-as-it-happens/instructions/scoped-record-paths.md`

**Changes:**

- Change `WorkspaceConfig['records']` to `Partial<WorkspaceRecordsPath> & { paths?: Partial<WorkspaceRecordsPath>[] }` with `WorkspaceRecordsPath = { base: string; pattern: string | string[]; ignored: string[]; excluded: string[]; gitignore: boolean }`; drop `included` and `dotignored` (replaced by `gitignore: boolean`).
- Add a `normalizeRecordPaths(records)` helper producing fully-resolved path scans: if `paths` is empty, a single path from the top-level defaults (base default `'.'`); otherwise each path inherits top-level defaults overridden by its own fields (`ignored` is a full override; `excluded` merges).
- In `findRecordFiles`, iterate the normalized paths, globbing `join(searchPath, base, pattern)` with `exclude = ignored + excluded` (nested excludes, not the base), optionally applying `git check-ignore` when `gitignore: true`; union and dedupe results.
- Update `findCandidateFiles` to accept `base` and `exclude` and pass them to `globSync`.
- Remove `filterByPatterns`, `getIgnoredSet`, `filterBuiltInExcludes`, and the `included`/RegExp machinery.
- Document the new `records` shape and discovery logic in `architecture/config.md` under a new `## Options overview` section.

**Dependencies:**

- None.

#### Commits:

| ID                         | Repository / Checkout / Branch                                | Policy       | Hash  | Status     |
| -------------------------- | ------------------------------------------------------------- | ------------ | ----- | ---------- |
| `scoped-record-paths`      | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | (TBD) | `AUTHORED` |
| `document-records-options` | Workspace CLI / `$PROJECT` / `plan-log-process-as-it-happens` | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `scoped-record-paths`

**Repository:** Workspace CLI

**Message:**

```
build(workspace-cli): introduce scoped record path scans.

- Add `paths` array with base/pattern/ignored/excluded/gitignore per scan.
- Normalize records into independent additive scans; drop `included` and RegExp.
- Glob each path with `exclude = ignored + excluded`; apply git check-ignore when enabled.
```

##### Commit: `document-records-options`

**Repository:** Workspace CLI

**Message:**

```
docs(workspace-cli): document records options in config.md.

- Add `## Options overview` for the new records shape and discovery logic.
- Update the WorkspaceConfig structure example.
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- Iteration `add-pending-operation-types`: `pending` outcome, `OperationPending` and 7 per-operation pending types added; `branch created` renamed to `branch`; `Operation` union extended with `Pending | Success | Failure` per kind. Commits `19cd900`, `6058533`.
- Iteration `stream-pending-operations-live`: optional logger in `createOperationsLog`; `makeOperationLogLine` presenter with ⏳/🟢/🔴; live logger wired in `src/index.ts`. Commits `6d6458f`, `0b004f7`.
- Iteration `output-pending-operations`: 7 `create*Pending` factories added; every command emits a pending operation before its side effect; ctx threaded through scan/load so they log their own operations; pure git helpers extracted with do\* orchestrators owning scan and store updates. Commits `e6f46ff`, `da9a76d`.
- All 245 tests pass; lint and build green.

### Findings

- `createOperationsLog()` is constructed per-command in `src/index.ts` (8 call sites) and in test helpers; the logger param must be optional (or all call sites updated) to keep the build green.
- `architecture/operations-log.md` is read-only — its `operation` enumeration lists `branch created` and must be mirrored in the code/docs, not edited in place.

### Decisions

- None.

### Knowledge to Update

- `architecture/operations-log.md` — add the `pending` outcome to the model (mirrored where read-only constraints apply).
- `architecture/_pseudo.md`, `architecture/commands.md`, `architecture/index.md` — `branch created` → `branch`.
- `architecture/config.md` — document the new `records` options (`paths`, `base`, `pattern`, `ignored`, `excluded`, `gitignore`) under `## Options overview`.

### Follow Ups

- Create the pending operation (with `details`) in each command before the side effect is executed, so every operation streams a `doing:` line immediately — this plan lays the type/log/presenter groundwork; per-command emission is a follow-up.
- Reduce redundant scanning in `pull`/`push`/`sync`: each `scanCheckoutState` spawns ~9 git subprocesses and `getBehindCount` does a network `git fetch` per checkout; `runSync` re-scans each pulled+pushed checkout up to 3× (initial + after pull + after push), plus workspace re-scans. Consider caching scan results and/or batching the fetch.
- Add a `[checkouts...]` argument to `pull`/`push`/`sync` (like `branch`/`repo`) so the operation can be scoped to one or more checkout locations instead of always iterating `getAllCheckouts()`.

### Feedback

- Planner: no deviations from instruction intent; two in-scope adjustments — `console.log` → `console.info` (eslint `no-console`) and `makeOperationLogLine` param typed `OperationBase` (pending types not assignable to the `Operation` union).
- Technical writers: `architecture/operations-log.md` does not yet document `pending` as an outcome or the streaming/logger concept; consider updating.
- Crew: no issues.
