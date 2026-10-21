# Instructions: `output-pending-operations`

**Plan:** `log-process-as-it-happens`

**Iteration Id:** `output-pending-operations`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-log-process-as-it-happens/instructions/output-pending-operations__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `output-pending-operations`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `output-pending-operations`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make every command emit a `pending` operation before starting its side effect, so a `doing:` line streams immediately via the live logger wired in `src/index.ts`. Thread `ctx` through the scan and load functions so they log their own pending/failure operations, and extract pure git helpers so the do\* orchestrators own scanning and store updates. Emit a `command` pending operation at the start of every run command.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/operations-log.md` — OperationsLog and Operation semantics. Read-only reference; do not edit it in place.
- architecture: `$PROJECT/architecture/reports.md` — Operations Report format.

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

- Step 1 / 4 — Add `create*Pending` factories for each command operation kind
- Step 2 / 4 — Emit a pending operation before each command's side effect
- Step 3 / 4 — Add tests for pending emission
- Step 4 / 4 — Commit `emit-pending-operations`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 4` — Add `create*Pending` factories for each command operation kind

Create pending factory functions in `$PROJECT/src/private/commands/operations/`, mirroring the existing success/failure factories (e.g. `createPullSuccess.ts`):

- `createPullPending.ts` — returns a `PullPending` (`operation: 'pull'`, `branch`, `outcome: 'pending'`).
- `createPushPending.ts` — returns a `PushPending` (`operation: 'push'`, `branch`, `outcome: 'pending'`).
- `createBranchPending.ts` — returns a `BranchPending` (`operation: 'branch'`, `branch`, `outcome: 'pending'`).
- `createClonePending.ts` — returns a `ClonePending` (`operation: 'clone'`, `location`, `outcome: 'pending'`).
- `createLinkedPending.ts` — returns a `LinkedPending` (`operation: 'linked'`, `package`, `target`, `outcome: 'pending'`).
- `createUnlinkPending.ts` — returns an `UnlinkPending` (`operation: 'unlink'`, `package`, `source`, `outcome: 'pending'`).
- `createPublishPending.ts` — returns a `PublishPending` (`operation: 'publish'`, `package`, `version`, `outcome: 'pending'`).

Each factory takes the same kind-specific fields as its matching success/failure factory, sets `ts: new Date()`, `checkout`, and a `message()` returning a terse `doing:` detail (e.g. `from origin/${branch}` for pull, `to origin/${branch}` for push).

Expected outcome: a pending factory exists for every command operation kind, typed against the pending types in `$PROJECT/src/private/operations/types.ts`.

### Step `2 / 4` — Emit a pending operation before each command's side effect

In each command handler, log the pending operation immediately before the side effect runs:

- `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts` — call `ctx.log.log(createPullPending(checkout, checkout.record.branch))` before `pullCheckout`.
- `$PROJECT/src/private/commands/checkouts/doPushCheckout.ts` — call `ctx.log.log(createPushPending(checkout, checkout.record.branch))` before `git.push`.
- `$PROJECT/src/private/commands/checkouts/doBranchCheckout.ts` — call `ctx.log.log(createBranchPending(checkout, branch))` before the branch side effect.
- `$PROJECT/src/private/commands/workspaces/pullWorkspaceCheckout.ts` — call `ctx.log.log(createPullPending(workspace, workspace.record.branch))` before `git.pull`.
- `$PROJECT/src/private/commands/workspaces/pushWorkspaceCheckout.ts` — call `ctx.log.log(createPushPending(workspace, workspace.record.branch))` before `git.push`.
- `$PROJECT/src/private/commands/doClone.ts` — call `ctx.log.log(createClonePending(...))` before the clone side effect.
- `$PROJECT/src/commands/link/runLink.ts` — call `ctx.log.log(createLinkedPending(...))` before linking.
- `$PROJECT/src/commands/unlink/runUnlink.ts` — call `ctx.log.log(createUnlinkPending(...))` before unlinking.
- `$PROJECT/src/commands/publish/runPublish.ts` — call `ctx.log.log(createPublishPending(...))` before publishing.

Where a command handler does not currently receive `ctx` (e.g. `runLink`, `runUnlink`, `runPublish`), thread the operations log through so the pending operation can be emitted. Keep the change minimal and consistent with how `pull`/`push`/`sync` already receive `ctx`.

Expected outcome: issuing any command prints a `doing:` line immediately, before the side effect completes.

### Step `3 / 4` — Add tests for pending emission

- Add a simple test for at least one pending factory (e.g. `createPullPending`) asserting the `outcome`, `operation`, and `message()`.
- Add a test verifying that a command handler logs a pending operation before the side effect (e.g. `doPullCheckout` emits a pending pull before pulling).

Expected outcome: new tests pass; keep them very simple.

### Step `4 / 4` — Commit `emit-pending-operations`

---

#### Commit: `emit-pending-operations`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): emit pending operations before starting commands.

- Add `create*Pending` factories and log a pending operation before each command's side effect.
- Wire pending emission in pull/push/sync/branch/clone command handlers.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that a pending factory exists for each command operation kind and that each command handler logs a pending operation before its side effect.
- Verify that issuing a command prints a `doing:` line immediately.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
