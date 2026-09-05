# Instructions: `stream-pending-operations-live`

**Plan:** `log-process-as-it-happens`

**Iteration Id:** `stream-pending-operations-live`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-log-process-as-it-happens/instructions/stream-pending-operations-live__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `stream-pending-operations-live`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `stream-pending-operations-live`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Stream pending operations through the operations log as they are issued, present a `doing:` line for each via a shared `makeOperationLogLine` presenter, and wire a live logger in `src/index.ts`.

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

- Step 1 / 6 — Add optional logger to `createOperationsLog`
- Step 2 / 6 — Extract `makeOperationLogLine` and reuse it in the report
- Step 3 / 6 — Add tests for the three outcomes and live streaming
- Step 4 / 6 — Commit `stream-pending-operations`
- Step 5 / 6 — Wire the live logger in `src/index.ts`
- Step 6 / 6 — Commit `wire-live-logger`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Add optional logger to `createOperationsLog`

Edit `$PROJECT/src/private/log/createOperationsLog.ts`:

- Add a parameter `logger: (op: OperationPending) => void` to `createOperationsLog`, optional with a default no-op so existing callers and test helpers still compile.
- In `log(operation: Operation)`, before pushing: when `operation.outcome === 'pending'`, call `logger(operation)` and return without pushing to the store.

Expected outcome: pending operations are streamed to the logger and never stored; completed/failed operations are stored as before.

### Step `2 / 6` — Extract `makeOperationLogLine` and reuse it in the report

Edit `$PROJECT/src/private/present/presentOperationsReport.ts`:

- Extract the `rows = operations.map(...)` logic into an exported `makeOperationLogLine(op: Operation): string[]` function.
- Render the leading column as `⏳` for `pending`, `🟢` for `success`, `🔴` for `failure`; keep the repo, operation, and message columns (`op.checkout?.repo?.name || 'unknown'`, `op.operation`, `op.message()`).
- Reuse `makeOperationLogLine` inside `presentOperationsReport` for the report rows.

Expected outcome: the report renders identically for success/failure, and the presenter is reusable for live lines.

### Step `3 / 6` — Add tests for the three outcomes and live streaming

- Add simple tests for `makeOperationLogLine` covering all three outcomes (pending, success, failure) — assert the leading emoji and the row shape.
- Add a test in `$PROJECT/src/private/log/createOperationsLog.test.ts` verifying that logging a pending operation invokes the logger and does not append it to `all()`.

Expected outcome: new tests pass; keep them very simple.

### Step `4 / 6` — Commit `stream-pending-operations`

---

#### Commit: `stream-pending-operations`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): stream pending operations through the log.

- Add optional logger to `createOperationsLog`; pending operations are logged live and not stored.
- Extract `makeOperationLogLine` with ⏳/🟢/🔴 rendering and reuse in the operations report.
- Add tests for the three outcomes and live streaming.
```

### Step `5 / 6` — Wire the live logger in `src/index.ts`

Edit `$PROJECT/src/index.ts`:

- Build `const logger = (op: OperationPending) => { console.log(makeOperationLogLine(op)) }` (import `OperationPending` from `./private/operations/types` and `makeOperationLogLine` from `./private/present/presentOperationsReport`).
- Pass `logger` into the command handlers' `createOperationsLog(logger)` calls so pending operations print `...doing: {operation} {repo} {details}` as they are issued.

Expected outcome: issuing a pending operation prints a `doing:` line immediately.

### Step `6 / 6` — Commit `wire-live-logger`

---

#### Commit: `wire-live-logger`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): wire live operation logger in index.

- Log pending operations as `doing: {operation} {repo} {details}` via `makeOperationLogLine`.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `createOperationsLog` accepts an optional logger, streams pending operations, and does not store them.
- Verify that `makeOperationLogLine` renders ⏳/🟢/🔴 and is reused by `presentOperationsReport`, with tests covering all three outcomes.
- Verify that `src/index.ts` wires the live logger into the command handlers.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
