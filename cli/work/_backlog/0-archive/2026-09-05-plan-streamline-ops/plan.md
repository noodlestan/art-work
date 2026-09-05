# Plan: Streamline Operation Types and Factories

**ID:** `streamline-ops`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Rename the operation-kind factories to `create*Operation` (e.g. `createPullOperation`), move the generic factories (`createGenericOperation`, `createOperationSuccess`, `createOperationFailure`) into `src/private/operations/`, delete `src/private/context/operations/`, and reduce the operation types to one concrete pending type per kind plus generic success/failure derived from the pending instance.

**Description:** Today each operation kind declares three types (`PullPending`, `PullSuccess`, `PullFailure`, …) and three factories (`createPullPending`, `createPullSuccess`, `createPullFailure`, …) that repeat the same shape, and the generic factories live in `src/private/context/operations/`. Refactor so the pending instance is the single concrete type per operation; `createOperationSuccess(pending)` and `createOperationFailure(pending, error)` become generic — they clone the pending's data and set `outcome: 'success'` or `outcome: 'failure'` (+ error), removing the per-kind success/failure types and factories. Rename the pending factories to `create*Operation` and move all generic factories into `src/private/operations/`; delete `src/private/context/operations/`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Rename the operation-kind factories to `create*Operation`, move the generic factories into `src/private/operations/` (`createGenericOperation`, `createOperationSuccess`, `createOperationFailure`), delete `src/private/context/operations/`, and reduce the operation type surface: one concrete pending type per operation kind plus generic success/failure derived from the pending instance. Add `finishedTs`/`timing()` to the operation base type and present all fields in the Operations Report (checkout, middle-truncated message, ms).

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
::READ `architecture/operations-log.md` (Design) — Operation log and operation kinds; must stay current after the refactor.
::READ `architecture/_pseudo.md` (Pseudo-code) — Operation kinds and factories listed; must stay current after the refactor.

## Scope

Refactor `$PROJECT/src/private/operations/types.ts` (fewer types), rename the operation-kind factories in `$PROJECT/src/private/commands/operations/` to `create*Operation`, move the generic factories (`createGenericOperation`, `createOperationSuccess`, `createOperationFailure`) into `$PROJECT/src/private/operations/`, delete `$PROJECT/src/private/context/operations/`, then update all callers and tests. Finally, add `finishedTs`/`timing()` to the operation base type and present all fields in the Operations Report (checkout column, middle-truncated message, ms column).

## Work

### Next

Delegate the `READY` iteration `streamline-operation-factories` (instructions written at `./plan-streamline-ops/instructions/streamline-operation-factories.md`).

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

If any of these fail, resolve the issue before proceeding with implementation.

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

| Iteration / Instructions                  | Status  |
| ----------------------------------------- | ------- |
| Iteration: Streamline Operation Factories | `READY` |

### Iteration: Streamline Operation Factories

**Id:** `streamline-operation-factories`

**Status:** `READY`

**Purpose:** Rename the operation-kind factories to `create*Operation`, move the generic factories into `src/private/operations/`, delete `src/private/context/operations/`, and reduce the operation types to pending + generic success/failure.

**Description:** Rename `createPullPending` → `createPullOperation`, `createPushPending` → `createPushOperation`, `createClonePending` → `createCloneOperation`, `createBranchPending` → `createBranchOperation`, `createLinkedPending` → `createLinkedOperation`, `createPublishPending` → `createPublishOperation`, `createUnlinkPending` → `createUnlinkOperation`. Move `createOperationPending` → `createGenericOperation` and add `createOperationSuccess`/`createOperationFailure` in `src/private/operations/`. Delete `src/private/context/operations/`. Collapse the per-kind success/failure types into generic success/failure derived from the pending instance. Update all callers and tests. Present all fields in the Operations Report (checkout, truncated message, ms).

**Instructions:** `./plan-streamline-ops/instructions/streamline-operation-factories.md`

**Changes:**

- Change the operation contract in `src/private/operations/types.ts`: add `finishedTs?: Date` and `timing: () => number` to `OperationBase`. `timing()` returns the delta `finishedTs.getTime() - ts.getTime()`, or `NaN` when no `finishedTs` exists yet (pending). Every factory implements `timing()`; the generic success/failure factories set `finishedTs: new Date()` when they resolve the pending.

  ```ts
  export interface OperationBase {
    operation: string;
    ts: Date; // created when the pending op is logged
    finishedTs?: Date; // set when the op resolves (success/failure)
    checkout?: Checkout;
    outcome: OperationOutcome;
    message: () => string;
    timing: () => number; // finishedTs ? finishedTs.getTime() - ts.getTime() : NaN
  }
  ```

- Rename the operation-kind pending factories to `create*Operation` (`createPullOperation`, `createPushOperation`, `createCloneOperation`, `createBranchOperation`, `createLinkedOperation`, `createPublishOperation`, `createUnlinkOperation`).
- Move the generic factories into `src/private/operations/`: `createGenericOperation` (from `createOperationPending`), `createOperationSuccess`, `createOperationFailure`.
- Delete `src/private/context/operations/` (both files).
- Refactor `src/private/operations/types.ts`: keep one concrete pending type per operation kind; success/failure become generic (clone of pending data + outcome, plus `error`/`errorSerialized` on failure).
- Update all callers to the new names and the pending → success/failure pattern.
- Update factory tests; keep message/errorSerialized behaviour identical.
- Update `architecture/operations-log.md` and `architecture/_pseudo.md` knowledge.
- Present all fields in the Operations Report: add `checkout` column (`op.checkout?.record.location`) after `repo`, middle-truncate `message()` to 50 chars via `truncateMiddle`, add `ms` column (`op.timing()`).

**Dependencies:**

- `plan-implement-checkouts-run` — introduces `CheckoutRunPending/Success/Failure` and `createCheckoutRun*` factories; if present at execution time, absorb them (rename to `createCheckoutRunOperation`, derive success/failure generically); if absent, the checkouts-run plan will use the new pattern when executed.

#### Commits:

Three commits, ordered: contract + generic factories first (not purely additive — the generic factories depend on `OperationBase` gaining `finishedTs`/`timing()`), refactor/deletions next, report presentation last.

| ID                                     | Repository / Checkout / Branch      | Policy       | Status     |
| -------------------------------------- | ----------------------------------- | ------------ | ---------- |
| `add-generic-operation-factories`      | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `AUTHORED` |
| `integrate-generic-operation-handling` | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `AUTHORED` |
| `present-all-operation-report-fields`  | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `AUTHORED` |

##### Commit: `add-generic-operation-factories`

**Message:**

```
build(workspace-cli-one): Add generic operation handling to simplify logging.

- Add finishedTs + timing() to OperationBase; implement timing() in all existing factories.
- Add createGenericOperation, createOperationSuccess, createOperationFailure in src/private/operations/.
- Generic factories set finishedTs on resolution; timing() returns the delta or NaN while pending.
```

##### Commit: `integrate-generic-operation-handling`

**Message:**

```
build(workspace-cli-one): Integrate generic operation handling in all operations.

- Rename operation-kind factories to create*Operation.
- Update all callers to the pending -> success/failure pattern.
- Delete src/private/context/operations/ and per-kind success/failure factories.
- Reduce operation types; update tests and knowledge.
```

##### Commit: `present-all-operation-report-fields`

**Message:**

```
build(workspace-cli-one): Present all fields in operation report.

- Add checkout column (op.checkout?.record.location) after repo.
- Middle-truncate message() to 50 chars via truncateMiddle.
- Add ms column (op.timing()).
```

---

## Coordination

### Not In Scope

- No change to report output, operation messages, or the Operations Report format.
- No new operation kinds.

### Evidence

- None.

### Findings

- The per-kind success/failure types and factories repeat the same shape across all operation kinds; the pending instance already carries the operation-specific data, so success/failure can be derived generically.
- Success factories today: pull/push/clone success messages match the pending's message; `createBranchSuccess` accepts an optional custom message (`message || '<empty>'`); linked/publish/unlink/generic have NO success factory.
- Failure factories today: `message()` never clones the pending's message — pull/push/branch use `extractReason(error)`, clone prefixes `clone failed on ${repo}: `, generic uses `rawError`. `errorSerialized()` formats differ: `KindError: ${repo} on ${branch} — ${msg}\n\n${fmt}` (pull/push/branch), `CloneError: ${repo} at ${location} — ${msg}\n\n${fmt}` (clone), `Error: ${operation} — ${data} ${msg}\n\n${fmt}` (generic).
- Bugs found: `createCloneFailure` typo `'unknmown'` (should be `'unknown'`); inconsistent factory signatures (pull/push `(checkout, branch, error)`, clone `(checkout?, e?)`, branch `(branch, error, checkout?)`); generic failure has no checkout, message = rawError, embeds JSON data inline.
- Type deviations: per-kind success/failure types duplicate pending fields; `OperationSuccess`/`OperationFailure` don't carry `data`; `CheckoutOp` union is stale (`'clone' | 'push' | 'pull' | 'branch'` — missing publish/linked/unlink/run); `OperationBase.operation` is `string`.
- Generic factory callers: `index.ts` (`createOperationPending('boot')` ×10), `runBranch`/`runLink`/`runRepo`/`runPush`/`runUnlink` (`createOperationPending('command', [...])`), `scanCheckoutState` (`createOperationPending('scan-checkout-state', location)` + generic failure).
- The `CheckoutRun*` kind (from Plan: Implement Checkouts Run) must be absorbed if present: `CheckoutRunPending` stays concrete; its success/failure derive from the generic factories.
- `architecture/operations-log.md` documents kinds `clone, push, publish, branch created, linked, unlink` — stale; must be updated.
- The Operations Report (`presentOperationsReport.ts`) hardcodes the headers `['', 'repo', 'operation', 'message']`; `makeOperationLogLine.ts` hardcodes the repo name (`op.checkout?.repo?.name`) and prints the full `message()` untruncated; there is no checkout or timing column.
- `timing()` needs two timestamps: `ts` (pending creation, already on `OperationBase`) and `finishedTs` (set when the op resolves). A single `ts` + `Date.now()` at render time would include the gap between finishing and rendering; capturing `finishedTs` at resolution gives the true operation duration. Pending ops return `NaN` explicitly.
- `timing()`/`finishedTs` live on `OperationBase` (not only on `OperationSuccess`/`OperationFailure`): success/failure are clones of pending via spread, so a base-type method is inherited automatically — putting it only on success/failure would break the clone invariant and force the generic factories to add it explicitly.
- Commit `add-generic-operation-factories` is NOT purely additive: the generic factories' signatures depend on `OperationBase` gaining `finishedTs`/`timing()`, and adding required `timing()` to the base breaks every existing factory until they implement it. The contract change must land in the same commit as the generic factories.

### Decisions

- Rename the operation-kind pending factories to `create*Operation` (`createPullOperation`, `createPushOperation`, `createCloneOperation`, `createBranchOperation`, `createLinkedOperation`, `createPublishOperation`, `createUnlinkOperation`).
- Move the generic factories into `src/private/operations/`: `createGenericOperation` (from `createOperationPending`), `createOperationSuccess`, `createOperationFailure`; delete `src/private/context/operations/`.
- One concrete pending type per operation kind; success/failure become generic `OperationSuccess`/`OperationFailure` derived from the pending instance (clone data + outcome, plus `error`/`errorSerialized` on failure).
- `createOperationSuccess(pending)` preserves the pending's `message()` unless a message override is provided (branch success messages stay identical).
- `createOperationFailure(pending, error)` normalizes the failure message to `extractReason(error)` and `errorSerialized` to a uniform `${OperationError}: ${repo} — ${message}\n\n${formatted}` format (label map: clone→CloneError, push→PushError, pull→PullError, publish→PublishError, branch→BranchError, linked→LinkedError, unlink→UnlinkError, run→CheckoutRunError).
- `createCloneOperation` accepts `Checkout | undefined` to support no-checkout clone failures.
- Fix the `'unknmown'` typo; update the `CheckoutOp` union to include all kinds.
- Three commits, ordered: contract + generic factories first (not purely additive — the generic factories depend on `OperationBase` gaining `finishedTs`/`timing()`), refactor/deletions next, report presentation last; messages `build(workspace-cli-one): Add generic operation handling to simplify logging.`, `build(workspace-cli-one): Integrate generic operation handling in all operations.`, `build(workspace-cli-one): Present all fields in operation report.`
- `finishedTs?: Date` and `timing: () => number` live on `OperationBase`; `timing()` returns `finishedTs ? finishedTs.getTime() - ts.getTime() : NaN`. Every factory implements `timing()`; the generic success/failure factories set `finishedTs: new Date()` on resolution (inherited via spread).
- Operations Report columns: `['', 'repo', 'checkout', 'operation', 'message', 'ms']`; `checkout` = `op.checkout?.record.location`; `message` middle-truncated to 50 chars via `truncateMiddle(str, limit)` in `src/private/present/private/truncateMiddle.ts`; `ms` = `String(op.timing())`.

### Knowledge to Update

- `architecture/operations-log.md` — operation kinds and factories list.
- `architecture/_pseudo.md` — operation kinds and factories list.
- `architecture/reports.md` — Operations Report columns (repo, checkout, operation, message, ms) and message truncation.

### Follow Ups

- None.

### Feedback

- None.
