# Instructions: `streamline-operation-factories`

**Plan:** `streamline-ops`

**Iteration Id:** `streamline-operation-factories`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-streamline-ops/instructions/streamline-operation-factories__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `streamline-operation-factories`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `streamline-operation-factories`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Rename the operation-kind factories to `create*Operation` (`createPullOperation`, `createPushOperation`, `createCloneOperation`, `createBranchOperation`, `createLinkedOperation`, `createPublishOperation`, `createUnlinkOperation`), move the generic factories (`createGenericOperation`, `createOperationSuccess`, `createOperationFailure`) into `src/private/operations/`, delete `src/private/context/operations/`, and reduce the operation types to one concrete pending type per kind plus generic success/failure derived from the pending instance. Update all callers and tests. Add `finishedTs`/`timing()` to the operation base type and present all fields in the Operations Report (checkout, middle-truncated message, ms).

## Mandatory Reading

- ::READ `$PROJECT/_backlog/3-now/plan-streamline-ops/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$PROJECT/src/private/operations/types.ts` (Source) — Operation types to reduce.
- ::READ `$PROJECT/src/private/commands/operations/createPullPending.ts` (Source) — Pending factory pattern (renamed to `createPullOperation`).
- ::READ `$PROJECT/src/private/commands/operations/createPullSuccess.ts` (Source) — Per-kind success factory to remove.
- ::READ `$PROJECT/src/private/commands/operations/createPullFailure.ts` (Source) — Per-kind failure factory to remove (error formatting helpers).
- ::READ `$PROJECT/src/private/commands/operations/createCloneFailure.ts` (Source) — Clone failure with no-checkout cases.
- ::READ `$PROJECT/src/private/commands/operations/createBranchSuccess.ts` (Source) — Success factory with optional custom message.
- ::READ `$PROJECT/src/private/context/operations/createOperationPending.ts` (Source) — Moves to `src/private/operations/createGenericOperation.ts`.
- ::READ `$PROJECT/src/private/context/operations/createOperationFailure.ts` (Source) — Deleted; replaced by `createOperationFailure` in `src/private/operations/`.
- ::READ `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts` (Source) — Caller pattern (pending → success/failure).
- ::READ `$PROJECT/src/commands/clone/cloneSpecific.ts` (Source) — Caller with no-checkout clone failures.
- ::READ `$PROJECT/architecture/operations-log.md` (Knowledge) — Operation kinds list; must stay current.
- ::READ `$PROJECT/architecture/_pseudo.md` (Knowledge) — Operation factories list; must stay current.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.
- RULE: If `$PROJECT/src/private/commands/operations/createCheckoutRunPending.ts` exists, absorb the `run` kind (rename to `createCheckoutRunOperation`, derive success/failure generically). If it does NOT exist, Plan: Implement Checkouts Run has not been executed yet — skip the `run` kind; the checkouts-run plan will use the new pattern when executed. Do NOT block on it.

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

- Step 1 / 6 — Change the operation contract (`finishedTs` + `timing()` on `OperationBase`) and add generic factories in `src/private/operations/`
- Step 2 / 6 — Commit `add-generic-operation-factories`
- Step 3 / 6 — Rename operation-kind factories to `create*Operation`; update callers; delete `src/private/context/operations/`; delete per-kind success/failure factories; reduce types; update tests + knowledge
- Step 4 / 6 — Commit `integrate-generic-operation-handling`
- Step 5 / 6 — Present all fields in operation report (truncateMiddle, log line, report headers, tests, knowledge)
- Step 6 / 6 — Commit `present-all-operation-report-fields`

## Steps

### Step `1 / 6` — Change the operation contract and add generic factories in `src/private/operations/`

**1a. Change the operation contract** in `$PROJECT/src/private/operations/types.ts` — add `finishedTs?: Date` and `timing: () => number` to `OperationBase`:

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

**1b. Implement `timing()` in every existing factory** that returns an operation type (the required base method breaks the build until all implement it):

- Per-kind pending factories in `$PROJECT/src/private/commands/operations/` (`createPullPending`, `createPushPending`, `createClonePending`, `createBranchPending`, `createLinkedPending`, `createPublishPending`, `createUnlinkPending`).
- Per-kind success/failure factories (`createPullSuccess`, `createPullFailure`, `createPushSuccess`, `createPushFailure`, `createCloneSuccess`, `createCloneFailure`, `createBranchSuccess`, `createBranchFailure`).
- Generic factories in `$PROJECT/src/private/context/operations/` (`createOperationPending`, `createOperationFailure`).

Add to each:

```ts
timing() {
	return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
}
```

**1c. Create the three generic factories** in `$PROJECT/src/private/operations/`:

`createGenericOperation.ts` — moved from `$PROJECT/src/private/context/operations/createOperationPending.ts`, renamed. Keep the body unchanged except the function name, the import path, and the added `timing()`:

```ts
import type { OperationPending } from './types';

export function createGenericOperation(operation: string, data?: unknown): OperationPending {
  // keep the existing body from createOperationPending unchanged, plus timing()
}
```

`createOperationSuccess.ts`:

```ts
import type { OperationPending, OperationSuccess } from './types';

export function createOperationSuccess<T extends OperationPending>(
  pending: T,
  message?: string,
): OperationSuccess {
  return {
    ...pending,
    outcome: 'success',
    finishedTs: new Date(),
    message: message ? () => message : pending.message,
  };
}
```

The pending's data is cloned via spread; `outcome` becomes `'success'`; `finishedTs` captures the resolution time; the pending's `message()` is preserved unless a message override is provided (used by branch success).

`createOperationFailure.ts`:

```ts
import type { OperationFailure, OperationPending } from './types';

function formatRawError(raw: string): string {
  const lines = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  return lines.map(l => '  ' + l).join('\n');
}

function extractReason(raw: string): string {
  const match = raw.match(/\(([^)]+)\)/);
  return match ? match[1] : (raw.split('\n')[0]?.trim() ?? 'unknown error');
}

const errorLabels: Record<string, string> = {
  clone: 'CloneError',
  push: 'PushError',
  pull: 'PullError',
  publish: 'PublishError',
  branch: 'BranchError',
  linked: 'LinkedError',
  unlink: 'UnlinkError',
  run: 'CheckoutRunError',
};

export function createOperationFailure<T extends OperationPending>(
  pending: T,
  error: unknown,
): OperationFailure {
  const rawError = error instanceof Error ? error.message : String(error);
  const label = errorLabels[pending.operation] ?? 'OperationError';

  return {
    ...pending,
    outcome: 'failure',
    finishedTs: new Date(),
    error: rawError,
    message() {
      return extractReason(this.error);
    },
    errorSerialized() {
      return `${label}: ${pending.checkout?.repo?.name} — ${this.message()}\n\n${formatRawError(this.error)}`;
    },
  };
}
```

The pending's data is cloned via spread; `outcome` becomes `'failure'`; `finishedTs` captures the resolution time; `error` is set; `message()` extracts the reason; `errorSerialized()` uses the uniform `${OperationError}: ${repo} — ${message}` format.

**Expected outcome:** the build compiles (all factories implement `timing()`); no callers use the new generic factories yet; the old `createOperationPending`/`createOperationFailure` in `src/private/context/operations/` still exist (deleted in Step 3).

---

### Step `2 / 6` — Commit `add-generic-operation-factories`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli-one): Add generic operation handling to simplify logging.

- Add finishedTs + timing() to OperationBase; implement timing() in all existing factories.
- Add createGenericOperation, createOperationSuccess, createOperationFailure in src/private/operations/.
- Generic factories set finishedTs on resolution; timing() returns the delta or NaN while pending.
```

---

### Step `3 / 6` — Rename factories, update callers, delete old factories, reduce types, update tests + knowledge

**2a. Rename the operation-kind pending factories** in `$PROJECT/src/private/commands/operations/`:

| Old file / function       | New file / function         |
| ------------------------- | --------------------------- |
| `createPullPending.ts`    | `createPullOperation.ts`    |
| `createPushPending.ts`    | `createPushOperation.ts`    |
| `createClonePending.ts`   | `createCloneOperation.ts`   |
| `createBranchPending.ts`  | `createBranchOperation.ts`  |
| `createLinkedPending.ts`  | `createLinkedOperation.ts`  |
| `createPublishPending.ts` | `createPublishOperation.ts` |
| `createUnlinkPending.ts`  | `createUnlinkOperation.ts`  |

Keep the bodies unchanged. Relax `createCloneOperation` to accept `Checkout | undefined` (needed for no-checkout clone failures):

```ts
import type { ClonePending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createCloneOperation(checkout: Checkout | undefined): ClonePending {
  return {
    ts: new Date(),
    checkout,
    outcome: 'pending',
    operation: 'clone',
    location: checkout?.record.location ?? 'unknown',
    message() {
      return checkout ? `to ${checkout.record.location}` : 'clone';
    },
    timing() {
      return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
    },
  };
}
```

If `createCheckoutRunPending.ts` exists, rename it to `createCheckoutRunOperation.ts` the same way.

**2b. Reduce `$PROJECT/src/private/operations/types.ts`:**

- Add `data?: unknown` to `OperationPending`, `OperationSuccess`, and `OperationFailure`.
- Keep the per-kind pending interfaces: `ClonePending`, `PushPending`, `PullPending`, `PublishPending`, `BranchPending`, `LinkedPending`, `UnlinkPending`, `CheckoutRunPending`.
- Remove the per-kind success/failure interfaces: `CloneSuccess`, `CloneFailure`, `PushSuccess`, `PushFailure`, `PullSuccess`, `PullFailure`, `PublishSuccess`, `PublishFailure`, `BranchSuccess`, `BranchFailure`, `LinkedSuccess`, `LinkedFailure`, `UnlinkSuccess`, `UnlinkFailure`, `CheckoutRunSuccess`, `CheckoutRunFailure`.
- Remove `GenericOperationPending`, `GenericOperationSuccess`, `GenericOperationFailure`.
- Update the `Operation` union to: the per-kind pending types + `OperationSuccess` + `OperationFailure`.
- Update the `CheckoutOp` union to include all kinds: `'clone' | 'push' | 'pull' | 'publish' | 'branch' | 'linked' | 'unlink' | 'run'`.

**2c. Update the callers** to the new names and the pending → success/failure pattern:

```ts
const pending = createPullOperation(checkout, checkout.record.branch);
try {
  ctx.log.log(pending);
  await pullCheckout(checkout);
  const updated = await scanCheckoutState(ctx, checkout, true);
  ctx.store.updateCheckout(updated);
  ctx.log.log(createOperationSuccess(pending));
  return updated;
} catch (error) {
  ctx.log.log(createOperationFailure(pending, error));
  return null;
}
```

Apply the pattern to:

- `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts` — pull.
- `$PROJECT/src/private/commands/checkouts/doPushCheckout.ts` — push.
- `$PROJECT/src/private/commands/checkouts/doBranchCheckout.ts` — branch; pass the custom message to `createOperationSuccess`:

  ```ts
  ctx.log.log(
    createOperationSuccess(
      pending,
      outcome === 'created' ? `created ${branch}` : `switched to ${branch}`,
    ),
  );
  ```

  and in the catch: `createOperationFailure(createBranchOperation(checkout, branch), error)` (the checkout is always present here).

- `$PROJECT/src/private/commands/doClone.ts` — clone; note the success uses the rescanned checkout: `createOperationSuccess(createCloneOperation(rescan))`.
- `$PROJECT/src/private/commands/checkouts/doCheckoutRun.ts` — run (only if it exists): `createOperationSuccess(createCheckoutRunOperation(checkout, commandLine))` and `createOperationFailure(createCheckoutRunOperation(checkout, commandLine), error)`.
- `$PROJECT/src/private/commands/workspaces/doPullWorkspaceCheckout.ts` — pull on the workspace.
- `$PROJECT/src/private/commands/workspaces/doPushWorkspaceCheckout.ts` — push on the workspace.
- `$PROJECT/src/private/commands/workspaces/syncWorkspaceCheckout.ts` — pull and push on the workspace.
- `$PROJECT/src/commands/branch/runBranch.ts` — replace `createBranchFailure(branch, 'checkout not cloned', scanned)` with `createOperationFailure(createBranchOperation(scanned, branch), 'checkout not cloned')`.
- `$PROJECT/src/commands/clone/cloneSpecific.ts` — replace the three `createCloneFailure(...)` calls:
  - `createCloneFailure(undefined, 'unknown repo "..."')` → `createOperationFailure(createCloneOperation(undefined), 'unknown repo "..."')`
  - `createCloneFailure(existing, msg)` → `createOperationFailure(createCloneOperation(existing), msg)`
  - `createCloneFailure(undefined, msg)` (directory exists) → `createOperationFailure(createCloneOperation(undefined), msg)`

**2d. Update the generic factory callers** to `createGenericOperation`:

- `$PROJECT/src/index.ts` — `createOperationPending('boot')` → `createGenericOperation('boot')` (×10).
- `$PROJECT/src/commands/branch/runBranch.ts`, `$PROJECT/src/commands/link/runLink.ts`, `$PROJECT/src/commands/publish/runPublish.ts`, `$PROJECT/src/commands/unlink/runUnlink.ts`, `$PROJECT/src/commands/repo/runRepo.ts` — `createOperationPending('command', [...])` → `createGenericOperation('command', [...])`.
- `$PROJECT/src/private/scan/scanCheckoutState.ts` — `createOperationPending('scan-checkout-state', location)` → `createGenericOperation('scan-checkout-state', location)`; the generic failure call `createOperationFailure('scan-checkout-state', error, location)` → `createOperationFailure(createGenericOperation('scan-checkout-state', location), error)`.

**2e. Delete the old files:**

- `$PROJECT/src/private/context/operations/` — the whole directory (`createOperationPending.ts`, `createOperationFailure.ts`).
- Per-kind success/failure factories in `$PROJECT/src/private/commands/operations/`: `createCloneSuccess.ts`, `createCloneFailure.ts`, `createPushSuccess.ts`, `createPushFailure.ts`, `createPullSuccess.ts`, `createPullFailure.ts`, `createBranchSuccess.ts`, `createBranchFailure.ts`, and (if present) `createCheckoutRunSuccess.ts`, `createCheckoutRunFailure.ts`.

Keep the renamed pending factories (`create*Operation.ts`) and the new generic factories in `src/private/operations/`.

**2f. Update tests:**

- Rename `createPullPending.test.ts` → `createPullOperation.test.ts` (and any other pending factory tests).
- Delete per-kind success/failure tests: `createPullSuccess.test.ts`, `createPullFailure.test.ts`, `createPushSuccess.test.ts`, `createPushFailure.test.ts`, `createCloneSuccess.test.ts`, `createCloneFailure.test.ts`, `createBranchSuccess.test.ts`, `createBranchFailure.test.ts`.
- Add `createOperationSuccess.test.ts` covering: message preserved from the pending; message override; `operation` and `outcome` set; pending data cloned (checkout present).
- Add `createOperationFailure.test.ts` covering: `message()` extracts the reason (e.g. `new Error('rejected (not allowed)')` → `'not allowed'`); `errorSerialized()` contains the operation error label (e.g. `PullError`); `operation`, `outcome`, and `error` set; pending data cloned.
- Add `createGenericOperation.test.ts` covering: `operation` and `data` set; `message()` returns `JSON.stringify(data)`.

Follow the existing test setup (`createMockCommandContext`, `makeTempDir`, `removeTempDirs`, `createCheckout`).

**2g. Update knowledge:**

- `$PROJECT/architecture/operations-log.md` — update the `operation` kind list to `clone`, `push`, `pull`, `publish`, `branch`, `linked`, `unlink`, `run`; note that success/failure are derived generically from the pending instance via `createOperationSuccess` / `createOperationFailure`.
- `$PROJECT/architecture/_pseudo.md` — replace the factories bullet with: per-kind operation factories (`createCloneOperation`, `createPushOperation`, `createPullOperation`, `createBranchOperation`, `createLinkedOperation`, `createPublishOperation`, `createUnlinkOperation`, `createCheckoutRunOperation`) plus generic `createGenericOperation(operation, data)` / `createOperationSuccess(pending, message?)` / `createOperationFailure(pending, error)` in `src/private/operations/`.

**Expected outcome:** no references to the removed factories or to `createOperationPending`/`createOperationFailure` (context) remain; `npm run build` passes; report output is unchanged except the documented clone/checkout-run failure message normalization.

---

### Step `4 / 6` — Commit `integrate-generic-operation-handling`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli-one): Integrate generic operation handling in all operations.

- Rename operation-kind factories to create*Operation.
- Update all callers to the pending -> success/failure pattern.
- Delete src/private/context/operations/ and per-kind success/failure factories.
- Reduce operation types; update tests and knowledge.
```

---

### Step `5 / 6` — Present all fields in operation report

**5a. Add `truncateMiddle`** at `$PROJECT/src/private/present/private/truncateMiddle.ts`:

```ts
export function truncateMiddle(str: string, limit: number): string {
  if (str.length <= limit) {
    return str;
  }
  const keep = limit - 3; // room for the "[...]" marker
  const left = Math.ceil(keep / 2);
  const right = Math.floor(keep / 2);
  return `${str.slice(0, left)}[...]${str.slice(str.length - right)}`;
}
```

**5b. Update `$PROJECT/src/private/present/makeOperationLogLine.ts`** — add the `checkout` column after `repo` and the `ms` column at the end:

```ts
return [
  icon,
  op.checkout?.repo?.name,
  op.checkout?.record.location,
  op.operation,
  truncateMiddle(op.message(), 50),
  String(op.timing()),
].filter(Boolean);
```

**5c. Update `$PROJECT/src/private/present/presentOperationsReport.ts`** — headers become `['', 'repo', 'checkout', 'operation', 'message', 'ms']`.

**5d. Update tests:**

- `$PROJECT/src/private/present/presentOperationsReport.test.ts` — assert the new columns: `checkout` shows `op.checkout?.record.location`; `message` is middle-truncated to 50 chars with `[...]`; `ms` shows the `timing()` delta (e.g. `0` for a just-resolved op).
- Add `truncateMiddle.test.ts` covering: short string unchanged; long string truncated with `[...]` in the middle; exact-limit string unchanged.

**5e. Update knowledge:**

- `$PROJECT/architecture/reports.md` — document the Operations Report columns: `repo`, `checkout`, `operation`, `message` (middle-truncated to 50 chars), `ms` (`timing()` delta).

**Expected outcome:** `npm run build` and `npm run test` pass; the report shows all fields.

---

### Step `6 / 6` — Commit `present-all-operation-report-fields`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli-one): Present all fields in operation report.

- Add checkout column (op.checkout?.record.location) after repo.
- Middle-truncate message() to 50 chars via truncateMiddle.
- Add ms column (op.timing()).
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed and pushed according to the commit's policy.
- Verify that `types.ts` keeps one concrete pending type per operation kind plus generic `OperationSuccess`/`OperationFailure`, and that no per-kind success/failure types or `GenericOperation*` types remain.
- Verify that `createOperationSuccess`/`createOperationFailure` are the only success/failure factories and that all callers pass the pending instance.
- Verify that `src/private/context/operations/` no longer exists.
- Verify that `OperationBase` has `finishedTs?: Date` and `timing: () => number`, and that every factory implements `timing()`.
- Verify that the Operations Report shows all fields: `repo`, `checkout`, `operation`, `message` (middle-truncated to 50 chars), `ms` (`timing()` delta).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
