# Instructions: `parallelise-checkout-scanning`

**Plan:** `parallel-scanning`

**Iteration Id:** `parallelise-checkout-scanning`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-parallel-scanning/instructions/parallelise-checkout-scanning__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `parallelise-checkout-scanning`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `parallelise-checkout-scanning`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make the per-checkout scan and pull/push/sync processing loops run concurrently with a small bounded concurrency limit, so elapsed time scales with concurrency rather than the number of checkouts. Checkout reports and operations keep their current deterministic ordering by presenting results in original checkout order.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/index.md` — how the CLI is structured and how `WorkspaceContext`, `CheckoutStore`, and reports fit together.
- architecture: `$PROJECT/architecture/context-model.md` — `WorkspaceContext`, `CheckoutStore`, and checkout scan types.
- architecture: `$PROJECT/architecture/commands.md` — designed behaviour and BDD for `sanity`, `pull`, `push`, `sync`.
- architecture: `$PROJECT/architecture/_pseudo.md` — pseudo-code contract for the scan and processing loops.

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

- Step 1 / 9 — Add `runWithConcurrency` bounded-concurrency helper
- Step 2 / 9 — Commit `add-concurrency-helper`
- Step 3 / 9 — Refactor `scanAllCheckoutsStates` to scan concurrently
- Step 4 / 9 — Refactor `runPull` side-effect loop
- Step 5 / 9 — Refactor `runPush`/`pushCleanCheckouts` side-effect loop
- Step 6 / 9 — Refactor `runSync` side-effect loop
- Step 7 / 9 — Commit `parallelise-checkout-scanning`
- Step 8 / 9 — Add concurrent-scanning tests
- Step 9 / 9 — Commit `cover-parallel-scanning`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 9` — Add `runWithConcurrency` bounded-concurrency helper

Create `$PROJECT/src/private/async/runWithConcurrency.ts` with a shared helper that runs an array of async tasks with a bounded concurrency limit while preserving input order:

```ts
export async function runWithConcurrency<T>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      await task(items[i]);
    }
  });
  await Promise.all(workers);
}
```

Use a bounded limit (e.g. `4`) that callers pass in. Tasks are initiated roughly in input order; the helper resolves only after all tasks finish.

Expected outcome: `$PROJECT/src/private/async/runWithConcurrency.ts` exports `runWithConcurrency` and compiles.

### Step `2 / 9` — Commit `add-concurrency-helper`

---

#### Commit: `add-concurrency-helper`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Add bounded-concurrency helper for parallel checkout processing.

- Add `runWithConcurrency` to run tasks with a configurable limit and preserve input order.
```

**Stage:** `$PROJECT/src/private/async/runWithConcurrency.ts` (new file)

### Step `3 / 9` — Refactor `scanAllCheckoutsStates` to scan concurrently

In `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`:

- Replace the sequential `for...of await` loop with `runWithConcurrency` over `ctx.store.getAllCheckouts()`:

```ts
await runWithConcurrency(ctx.store.getAllCheckouts(), 4, async checkout => {
  const updated = await scanCheckoutState(ctx, checkout);
  ctx.store.updateCheckout(updated);
});
```

- `CheckoutStore.updateCheckout` is a `Map.set` on each checkout's distinct `record.location`, so concurrent calls for different checkouts are safe (no shared mutable state across checkouts).

Expected outcome: all checkouts are scanned concurrently; each checkout is updated in the store.

### Step `4 / 9` — Refactor `runPull` side-effect loop

In `$PROJECT/src/commands/pull/runPull.ts`:

- Wrap the per-checkout pull loop body in `runWithConcurrency(ctx.store.getAllCheckouts(), 4, ...)`, keeping the `checkout.scan?.can?.('pull') && checkout.scan.should?.('pull')` guard and the `doPullCheckout(ctx, checkout)` call.

Expected outcome: `runPull` pulls clean-and-behind checkouts concurrently.

### Step `5 / 9` — Refactor `runPush`/`pushCleanCheckouts` side-effect loop

In `$PROJECT/src/commands/push/runPush.ts`:

- Wrap the per-checkout push loop in `runWithConcurrency(...)`, keeping the `can`/`should` guards, the optional pre-push `doPullCheckout`, and `doPushCheckout`. The `current = ctx.store.getCheckoutForLocation(...)` re-read stays as-is (do not change push behaviour in this iteration).

In `$PROJECT/src/commands/sanity/private/pushCleanCheckouts.ts`:

- Wrap the per-checkout loop in `runWithConcurrency(...)`.

Expected outcome: `runPush` and `pushCleanCheckouts` push clean checkouts concurrently.

### Step `6 / 9` — Refactor `runSync` side-effect loop

In `$PROJECT/src/commands/sync/runSync.ts`:

- Wrap the per-checkout pull/push loop in `runWithConcurrency(...)`, keeping the existing `can`/`should` guards and the `current` re-read.

Expected outcome: `runSync` pulls and pushes checkouts concurrently.

### Step `7 / 9` — Commit `parallelise-checkout-scanning`

---

#### Commit: `parallelise-checkout-scanning`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Scan and process checkouts concurrently with bounded concurrency.

- Refactor `scanAllCheckoutsStates` and pull/push/sync loops to use the concurrency helper.
- Keep reports and operations in original checkout order.
- Ensure `updateCheckout` stays safe under concurrency.
```

**Stage:** `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`, `$PROJECT/src/commands/pull/runPull.ts`, `$PROJECT/src/commands/push/runPush.ts`, `$PROJECT/src/commands/sanity/private/pushCleanCheckouts.ts`, `$PROJECT/src/commands/sync/runSync.ts`

### Step `8 / 9` — Add concurrent-scanning tests

In `$PROJECT/src/private/store/scanAllCheckoutsStates.test.ts`:

- Add a test that a store with multiple checkouts (created via `createCheckout`) scans all of them and updates every checkout in the store, while keeping the existing empty-store no-op test.
- If practical, add a test that records the initiation order or completion of concurrent scans remains deterministic (all checkouts scanned; ordering of `getAllCheckouts()` unchanged).

Expected outcome: concurrent scanning is covered (all checkouts scanned, states still correct, ordering deterministic).

### Step `9 / 9` — Commit `cover-parallel-scanning`

---

#### Commit: `cover-parallel-scanning`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test(workspace-cli): Cover concurrent checkout scanning and side effects.

- Test that all checkouts are scanned concurrently with correct states and deterministic ordering.
```

## **Stage:** `$PROJECT/src/private/store/scanAllCheckoutsStates.test.ts`

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/src/private/async/runWithConcurrency.ts` exists and is used by `scanAllCheckoutsStates`, `runPull`, `runPush`, `pushCleanCheckouts`, and `runSync`.
- Verify that `scanAllCheckoutsStates` scans every checkout and updates the store for each, with no shared mutable state across checkouts.
- Verify that checkout report and operation ordering is unchanged (deterministic).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
