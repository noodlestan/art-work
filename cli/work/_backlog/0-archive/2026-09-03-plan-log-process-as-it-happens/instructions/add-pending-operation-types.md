# Instructions: `add-pending-operation-types`

**Plan:** `log-process-as-it-happens`

**Iteration Id:** `add-pending-operation-types`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-log-process-as-it-happens/instructions/add-pending-operation-types__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-pending-operation-types`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-pending-operation-types`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Extend the operation type model with a `pending` outcome and per-operation pending types so operations can be logged before they complete, and rename the `branch created` operation to `branch`.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/operations-log.md` — OperationsLog and Operation semantics. Read-only reference; do not edit it in place.
- architecture: `$PROJECT/architecture/_pseudo.md` — Operation kinds.
- architecture: `$PROJECT/architecture/commands.md` — Designed behaviour and BDD scenarios for the branch operation.
- architecture: `$PROJECT/architecture/index.md` — Execution Model and OperationsLog.

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

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 6 — Add pending outcome and pending operation types
- Step 2 / 6 — Reorder types and extend the `Operation` union
- Step 3 / 6 — Commit `add-pending-operation-types`
- Step 4 / 6 — Rename `branch created` to `branch` in code and tests
- Step 5 / 6 — Mirror the rename in architecture knowledge docs
- Step 6 / 6 — Commit `rename-branch-created`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Add pending outcome and pending operation types

Edit `$PROJECT/src/private/operations/types.ts`:

- Change `OperationOutcome` to `'pending' | 'success' | 'failure'`.
- Add `OperationPending extends OperationBase { outcome: 'pending' }`.
- Add a per-operation pending type for each kind, carrying the same kind-specific fields as the matching success/failure types:
  - `ClonePending extends OperationPending { operation: 'clone'; location: string }`
  - `PushPending extends OperationPending { operation: 'push'; branch: string }`
  - `PullPending extends OperationPending { operation: 'pull'; branch: string }`
  - `PublishPending extends OperationPending { operation: 'publish'; package: string; version: string }`
  - `BranchPending extends OperationPending { operation: 'branch'; branch: string }`
  - `LinkedPending extends OperationPending { operation: 'linked'; package: string; target: string }`
  - `UnlinkPending extends OperationPending { operation: 'unlink'; package: string; source: string }`

Expected outcome: the file compiles with the new pending types alongside the existing success/failure types.

### Step `2 / 6` — Reorder types and extend the `Operation` union

In the same `$PROJECT/src/private/operations/types.ts`:

- Reorder the type declarations so each kind's `Pending`, `Success`, and `Failure` types are grouped together, matching the order used in the `Operation` union export.
- Extend the `Operation` union so each kind lists `Pending | Success | Failure`, e.g. `| ClonePending | CloneSuccess | CloneFailure`.

Expected outcome: the `Operation` union covers all three outcomes for every kind, in a consistent order.

### Step `3 / 6` — Commit `add-pending-operation-types`

---

#### Commit: `add-pending-operation-types`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): add pending operation types.

- Add `pending` outcome and `OperationPending` with per-operation pending types.
- Reorder operation types to match the `Operation` union export.
- Extend the `Operation` union with `Pending | Success | Failure` per kind.
```

### Step `4 / 6` — Rename `branch created` to `branch` in code and tests

Rename the `branch created` operation string to `branch` across the package, excluding `_backlog`:

- `$PROJECT/src/private/operations/types.ts` — `BranchSuccess` and `BranchFailure` `operation` fields.
- `$PROJECT/src/private/commands/operations/createBranchSuccess.ts` — the `operation` value.
- `$PROJECT/src/private/commands/operations/createBranchFailure.ts` — the `operation` value.
- `$PROJECT/src/commands/branch/runBranch.test.ts` — the three `branch created` assertions.

Expected outcome: no `branch created` string remains in `$PROJECT/src/`.

### Step `5 / 6` — Mirror the rename in architecture knowledge docs

Update the `branch created` references in the architecture knowledge docs:

- `$PROJECT/architecture/_pseudo.md` — the operation kinds list.
- `$PROJECT/architecture/commands.md` — the branch command procedure and BDD scenarios.
- `$PROJECT/architecture/index.md` — the OperationsLog operation list.
- `$PROJECT/architecture/operations-log.md` — read-only: do NOT edit this file; note the rename in your report instead.

Expected outcome: knowledge docs consistently use `branch`; the read-only `operations-log.md` is untouched.

### Step `6 / 6` — Commit `rename-branch-created`

---

#### Commit: `rename-branch-created`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
renames(workspace-cli): rename branch created operation to branch.

- Rename `branch created` to `branch` in operation types, factories, and tests.
- Mirror the rename in architecture knowledge docs.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/src/private/operations/types.ts` exports `OperationPending` and a pending type per operation kind, and that the `Operation` union includes `Pending | Success | Failure` per kind.
- Verify that no `branch created` string remains in `$PROJECT/src/` and that `architecture/operations-log.md` was not modified.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
