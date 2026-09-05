# Instructions: `implement-checkout-run-command`

**Plan:** `implement-checkouts-run`

**Iteration Id:** `implement-checkout-run-command`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-checkouts-run/instructions/implement-checkout-run-command__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-checkout-run-command`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-checkout-run-command`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement `art-workspace checkout run <command...> [-c <PATTERN...>] [-A, --all]` end-to-end, following the `runPull` pattern: `checkout` command group with `run` subcommand, usage guard (require `-c` or `--all`), checkout resolution via `getCheckoutsByPattern`, per-checkout execution with pending → success/failure operation logging, and Checkout Report + Operations Report presentation.

## Mandatory Reading

- ::READ `$PROJECT/_backlog/4-next/plan-implement-checkouts-run/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$PROJECT/src/index.ts` (Source) — Commander wiring; add the `checkout` group here.
- ::READ `$PROJECT/src/commands/pull/runPull.ts` (Source) — Reference implementation pattern (hydrate → usage guard → resolve → concurrency loop → reports).
- ::READ `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts` (Source) — Per-checkout operation helper pattern (pending → success/failure).
- ::READ `$PROJECT/src/private/store/createCheckoutStore.ts` (Source) — `getCheckoutsByPattern` API.
- ::READ `$PROJECT/src/private/operations/types.ts` (Source) — Operation types to extend with `CheckoutRun*`.
- ::READ `$PROJECT/src/private/commands/operations/createPullPending.ts` (Source) — Operation factory pattern.
- ::READ `$PROJECT/architecture/commands.md` (Knowledge) — Command Arguments conventions (`--checkouts`, `--all`).
- ::READ `$PROJECT/architecture/_pseudo.md` (Knowledge) — Pseudo-code contract.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

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

- Step 1 / 8 — Wire `checkout` group + `run` subcommand + handler skeleton
- Step 2 / 8 — Commit `wire-checkout-run-command`
- Step 3 / 8 — Add operation types + factories + reporting
- Step 4 / 8 — Commit `add-checkout-run-operations-and-reporting`
- Step 5 / 8 — Implement execution (spawn helper + `doCheckoutRun`)
- Step 6 / 8 — Commit `implement-checkout-run-execution`
- Step 7 / 8 — Add tests
- Step 8 / 8 — Commit `test-checkout-run-command`

## Steps

### Step `1 / 8` — Wire `checkout` group + `run` subcommand + handler skeleton

In `$PROJECT/src/index.ts`:

1. Add the import:

   ```ts
   import { runCheckoutRun } from './commands/checkout/runCheckoutRun';
   ```

2. Add the `checkout` command group with the `run` subcommand (after the `sync` command block):

   ```ts
   program
     .command('checkout')
     .description('Checkout operations')
     .command('run')
     .description('Run a command in selected checkouts')
     .argument('<command...>', 'command to run')
     .option(
       '-c, --checkouts <PATTERN...>',
       'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
     )
     .option('-A, --all', 'Apply to all checkouts')
     .action(async (command: string[], options: { checkouts?: string[]; all?: boolean }) => {
       const root = process.cwd();
       logger(createOperationPending('boot'));
       const config = await loadWorkspaceConfig(root);
       const store = createCheckoutStore();
       const log = createOperationsLog(logger);
       const ctx = createWorkspaceContext(config, store, log);

       await runCheckoutRun(ctx, { command, checkouts: options.checkouts, all: options.all });
     });
   ```

3. Create `$PROJECT/src/commands/checkout/runCheckoutRun.ts` with the handler skeleton, mirroring `runPull`:

   ```ts
   import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
   import { createOperationPending } from '../../private/context/operations/createOperationPending';
   import { presentCheckoutReport } from '../../private/present/presentCheckoutReport';
   import { presentOperationsReport } from '../../private/present/presentOperationsReport';
   import { loadCheckoutRecords } from '../../private/resources/checkout/loadCheckoutRecords';
   import { loadRepositoryRecords } from '../../private/resources/repository/loadRepositoryRecords';
   import { hydrateStoreFromRecords } from '../../private/store/hydrateStoreFromRecords';
   import { scanAllCheckoutsStates } from '../../private/store/scanAllCheckoutsStates';

   export async function runCheckoutRun(
     ctx: WorkspaceContext,
     options: { command: string[]; checkouts?: string[]; all?: boolean } = {},
   ): Promise<void> {
     const repos = await loadRepositoryRecords(ctx);
     const records = await loadCheckoutRecords(ctx, repos);
     hydrateStoreFromRecords(ctx.config, ctx.store, records);

     ctx.log.log(createOperationPending('command', ['checkout', 'run', options.command]));

     await scanAllCheckoutsStates(ctx);

     if (!options.all && (!options.checkouts || options.checkouts.length === 0)) {
       console.error('No checkouts matched.');
       console.error(
         `Usage: Use \`art-workspace checkout run [options] -c <pattern>\` or \`art-workspace checkout run [options] --all\` if you want to run the command in all checkouts.`,
       );
       return;
     }

     const checkouts = options.all
       ? ctx.store.getAllCheckouts()
       : ctx.store.getCheckoutsByPattern(options.checkouts ?? []);

     presentCheckoutReport(ctx.config, checkouts);
     presentOperationsReport(ctx.log);
   }
   ```

   The handler resolves the target checkouts and presents the Checkout Report. The per-checkout execution loop is added in Step 3; the spawn in Step 5.

**Expected outcome:** `checkout run` appears in the CLI help; running it with `-c` or `--all` resolves checkouts and presents the Checkout Report; running it with neither prints the usage message and exits.

---

#### Commit: `wire-checkout-run-command`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(checkouts-run): Wire checkout run command group and subcommand.

- Create `checkout` group with `run` subcommand in `src/index.ts`.
- Add `.argument('<command...>')`, `.option('-c, --checkouts <PATTERN...>')`, `.option('-A, --all')`.
- Create `runCheckoutRun` handler skeleton: hydrate store, usage guard (require -c or --all), resolve checkouts, present Checkout Report.
```

---

### Step `3 / 8` — Add operation types + factories + reporting

**3a. Extend the operation types** in `$PROJECT/src/private/operations/types.ts`:

Add after the `Unlink*` interfaces:

```ts
export interface CheckoutRunPending extends OperationPending {
  operation: 'run';
  command: string;
}

export interface CheckoutRunSuccess extends OperationSuccess {
  operation: 'run';
  command: string;
}

export interface CheckoutRunFailure extends OperationFailure {
  operation: 'run';
  command: string;
}
```

Add to the `Operation` union:

```ts
	| CheckoutRunPending
	| CheckoutRunSuccess
	| CheckoutRunFailure
```

**3b. Add the operation factories** in `$PROJECT/src/private/commands/operations/`, following the `createPull*` pattern:

`createCheckoutRunPending.ts`:

```ts
import type { CheckoutRunPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createCheckoutRunPending(checkout: Checkout, command: string): CheckoutRunPending {
  return {
    ts: new Date(),
    checkout,
    outcome: 'pending',
    operation: 'run',
    command,
    message() {
      return command;
    },
  };
}
```

`createCheckoutRunSuccess.ts`:

```ts
import type { CheckoutRunSuccess } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createCheckoutRunSuccess(checkout: Checkout, command: string): CheckoutRunSuccess {
  return {
    ts: new Date(),
    checkout,
    outcome: 'success',
    operation: 'run',
    command,
    message() {
      return command;
    },
  };
}
```

`createCheckoutRunFailure.ts` — mirror `createPullFailure` (extract the reason from the raw error, format the serialized error):

```ts
import type { CheckoutRunFailure } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

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

export function createCheckoutRunFailure(
  checkout: Checkout,
  command: string,
  error: unknown,
): CheckoutRunFailure {
  const rawError = error instanceof Error ? error.message : String(error);

  return {
    ts: new Date(),
    checkout,
    outcome: 'failure',
    operation: 'run',
    command,
    error: rawError,
    message() {
      return `${command} — ${extractReason(rawError)}`;
    },
    errorSerialized() {
      return `CheckoutRunError: ${checkout.repo?.name} — ${command}\n\n${formatRawError(rawError)}`;
    },
  };
}
```

**3c. Add the per-checkout helper** `$PROJECT/src/private/commands/checkouts/doCheckoutRun.ts`, mirroring `doPullCheckout`:

```ts
import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import type { Checkout } from '../../store/createCheckout';
import { createCheckoutRunFailure } from '../operations/createCheckoutRunFailure';
import { createCheckoutRunPending } from '../operations/createCheckoutRunPending';
import { createCheckoutRunSuccess } from '../operations/createCheckoutRunSuccess';

export async function doCheckoutRun(
  ctx: WorkspaceContext,
  checkout: Checkout,
  command: string[],
): Promise<Checkout | null> {
  const commandLine = command.join(' ');

  if (!checkout.scan?.state('exists').exists) {
    const op = createCheckoutRunFailure(checkout, commandLine, new Error('checkout not cloned'));
    ctx.log.log(op);
    return null;
  }

  try {
    ctx.log.log(createCheckoutRunPending(checkout, commandLine));
    // Execution placeholder: resolve the checkout. The real spawn is added in Step 5.
    ctx.log.log(createCheckoutRunSuccess(checkout, commandLine));
    return checkout;
  } catch (error) {
    const op = createCheckoutRunFailure(checkout, commandLine, error);
    ctx.log.log(op);
    return null;
  }
}
```

**3d. Wire the loop into the handler** — update `$PROJECT/src/commands/checkout/runCheckoutRun.ts`:

Add imports:

```ts
import { runWithConcurrency } from '../../private/async/runWithConcurrency';
import { doCheckoutRun } from '../../private/commands/checkouts/doCheckoutRun';
```

Replace the report-only tail with the execution loop:

```ts
await runWithConcurrency(checkouts, 4, async checkout => {
  await doCheckoutRun(ctx, checkout, options.command);
});

presentCheckoutReport(ctx.config, checkouts);
presentOperationsReport(ctx.log);
```

**Expected outcome:** `checkout run` logs a pending → success operation per resolved checkout (and a failure operation for uncloned checkouts), and presents the Operations Report. The command is functional end-to-end; the actual spawn is implemented in Step 5.

---

#### Commit: `add-checkout-run-operations-and-reporting`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(checkouts-run): Add checkout run operations and reporting.

- Add CheckoutRunPending/Success/Failure operation types and factories.
- Wire per-checkout pending -> success/failure logging and Operations Report presentation into the handler.
```

---

### Step `5 / 8` — Implement execution (spawn helper + `doCheckoutRun`)

**5a. Add the exec helper** `$PROJECT/src/private/exec/runCommandInDirectory.ts` — reusable by the future `package run` command:

```ts
import { spawn } from 'node:child_process';

export function runCommandInDirectory(dir: string, command: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command;
    const child = spawn(cmd, args, { cwd: dir, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`command exited with code ${code}`));
      }
    });
  });
}
```

**5b. Update `doCheckoutRun`** in `$PROJECT/src/private/commands/checkouts/doCheckoutRun.ts` to run the real command:

Add the import:

```ts
import { runCommandInDirectory } from '../../exec/runCommandInDirectory';
```

Replace the placeholder line:

```ts
// Execution placeholder: resolve the checkout. The real spawn is added in Step 5.
ctx.log.log(createCheckoutRunSuccess(checkout, commandLine));
```

with:

```ts
await runCommandInDirectory(checkout.path, command);
ctx.log.log(createCheckoutRunSuccess(checkout, commandLine));
```

**Expected outcome:** `checkout run` actually executes the command in each checkout directory (live output via inherited stdio), logging success on exit code 0 and failure on non-zero exit or spawn error.

---

#### Commit: `implement-checkout-run-execution`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(checkouts-run): Implement checkout run execution step.

- Add runCommandInDirectory exec helper (spawn with cwd = checkout path).
- Execute the command per checkout via doCheckoutRun, using the operation factories.
- Skip uncloned checkouts with a failure operation.
```

---

### Step `7 / 8` — Add tests

Create `$PROJECT/src/commands/checkout/runCheckoutRun.test.ts`, following the `runPull.test.ts` setup (`createMockCommandContext`, `writeRepoMockRecord`, `writeCheckoutMockRecord`, `makeTempDir`, `removeTempDirs`, `vi.spyOn(console, ...)`).

Cover at minimum:

- **Usage guard** — `runCheckoutRun(ctx, { command: ['touch', 'marker.txt'] })` (neither `-c` nor `--all`) prints the usage message, executes nothing, and logs no run operations.
- **`--all`** — with two cloned checkouts, `{ command, all: true }` runs the command in both; assert a marker file exists in each checkout and a success operation is logged per checkout.
- **Pattern filtering** — with two cloned checkouts, `{ command, checkouts: ['art*'] }` runs only in the matching checkout (assert marker file + operation only for the match).
- **Execution failure** — `{ command: ['sh', '-c', 'exit 1'], all: true }` logs a failure operation per checkout.
- **No-match warning** — `{ command, checkouts: ['nonexistent'] }` warns (`no checkout matches pattern`), executes nothing.
- **Uncloned checkout** — a recorded-but-not-cloned checkout logs a failure operation with message `checkout not cloned`.
- **Inner-flag `--` convention** — verify commander passes inner flags after `--` as part of the command array (e.g. `checkout run npm run ci -- --filter x` → `['npm', 'run', 'ci', '--filter', 'x']`). If direct commander parsing is impractical in the unit test, verify the convention manually via the CLI and note it in the report.

**Expected outcome:** all tests pass; no `it.todo()` remains.

---

#### Commit: `test-checkout-run-command`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test(checkouts-run): add checkout run command tests.

- Test pattern filtering via getCheckoutsByPattern.
- Test --all and the usage guard (neither -c nor --all).
- Test execution success and failure per checkout.
- Test no-match warning, uncloned checkout, and inner-flag `--` convention.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that `checkout run` requires either `-c` or `--all` and prints the usage message when neither is provided.
- Verify that the command executes in the resolved checkouts, logging pending → success/failure operations, and presents the Checkout Report + Operations Report.
- Verify that uncloned checkouts produce a failure operation and do not crash the command.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
