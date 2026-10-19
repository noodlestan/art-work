# Instructions: `refetch-control-and-sync-fix`

**Plan:** `parallel-scanning`

**Iteration Id:** `refetch-control-and-sync-fix`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-parallel-scanning/instructions/refetch-control-and-sync-fix__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `refetch-control-and-sync-fix`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `refetch-control-and-sync-fix`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

1. Thread the `refetch` flag through `scanAllCheckoutsStates` so callers can opt into fresh ahead/behind data.
2. Add `--refetch` option to the `sanity` command, passing it to both `scanAllCheckoutsStates` and `scanWorkspaceCheckout`.
3. Fix the stale-`checkout` bug in `runSync` where the push decision uses the pre-pull checkout instead of the post-pull result.
4. Remove the redundant `scanWorkspaceCheckout` call before `syncWorkspaceCheckout` in `runSync`.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/cli/workspace/architecture/index.md` — how the CLI is structured and how `WorkspaceContext`, `CheckoutStore`, and reports fit together.
- architecture: `$PROJECT/cli/workspace/architecture/context-model.md` — `WorkspaceContext`, `CheckoutStore`, and checkout scan types.
- architecture: `$PROJECT/cli/workspace/architecture/commands.md` — designed behaviour and BDD for `sanity`, `pull`, `push`, `sync`.
- architecture: `$PROJECT/cli/workspace/architecture/_pseudo.md` — pseudo-code contract for the scan and processing loops.

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

- Step 1 / 7 — Add `refetch` parameter to `scanAllCheckoutsStates`
- Step 2 / 7 — Commit `add-refetch-to-scan-all`
- Step 3 / 7 — Add `--refetch` option to `sanity` command
- Step 4 / 7 — Commit `add-refetch-to-sanity`
- Step 5 / 7 — Fix `runSync` stale checkout and remove redundant workspace scan
- Step 6 / 7 — Commit `fix-sync-stale-checkout`
- Step 7 / 7 — Update tests and commit `cover-refetch-and-sync-fix`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 7` — Add `refetch` parameter to `scanAllCheckoutsStates`

In `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`:

- Add an optional `refetch = false` parameter to the function signature.
- Forward the `refetch` parameter to the `scanCheckoutState` call inside the loop.

Current signature:

```ts
export async function scanAllCheckoutsStates(ctx: WorkspaceContext): Promise<void>;
```

New signature:

```ts
export async function scanAllCheckoutsStates(ctx: WorkspaceContext, refetch = false): Promise<void>;
```

Inside the `runWithConcurrency` call, change:

```ts
await scanCheckoutState(ctx, checkout);
```

to:

```ts
await scanCheckoutState(ctx, checkout, refetch);
```

Expected outcome: `scanAllCheckoutsStates` accepts and forwards `refetch`; all existing callers (which pass no second arg) continue to scan cheap.

### Step `2 / 7` — Commit `add-refetch-to-scan-all`

---

#### Commit: `add-refetch-to-scan-all`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Add refetch parameter to scanAllCheckoutsStates.

- Add optional `refetch` parameter (default `false`) and forward to `scanCheckoutState`.
```

**Stage:** `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`

### Step `3 / 7` — Add `--refetch` option to `sanity` command

In `$PROJECT/src/commands/sanity/runSanity.ts`:

- Change the `options` parameter type from `{ auto: boolean }` to `{ auto: boolean; refetch?: boolean }`.
- Pass `options.refetch` to `scanAllCheckoutsStates(ctx, options.refetch)`.
- Pass `options.refetch` to `scanWorkspaceCheckout(ctx, options.refetch)`.

The workspace refetch happens **before** auto operations (consistent with the checkout pre-scan pattern). If `--refetch` is set and auto mode pulls the workspace, `doPullWorkspaceCheckout` will refetch again internally — this redundancy is acceptable.

In `$PROJECT/src/index.ts` (or wherever the sanity command is registered), add the `--refetch` flag to the sanity command's option parsing. The flag should be a boolean that defaults to `false`. Look for how `--auto` is parsed and add `--refetch` similarly.

Expected outcome: `sanity --refetch` produces accurate ahead/behind data for both checkouts and workspace in the report.

### Step `4 / 7` — Commit `add-refetch-to-sanity`

---

#### Commit: `add-refetch-to-sanity`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Add --refetch option to sanity command.

- Pass `refetch` to `scanAllCheckoutsStates` and `scanWorkspaceCheckout` when `--refetch` is set.
- Workspace refetch happens before auto operations, consistent with checkout pre-scan pattern.
```

**Stage:** `$PROJECT/src/commands/sanity/runSanity.ts`, `$PROJECT/src/index.ts` (or wherever sanity CLI options are parsed)

### Step `5 / 7` — Fix `runSync` stale checkout and remove redundant workspace scan

In `$PROJECT/src/commands/sync/runSync.ts`:

**Fix 1 — Stale checkout bug:**

Current code:

```ts
await runWithConcurrency(ctx.store.getAllCheckouts(), 4, async checkout => {
  if (checkout.scan?.can?.('pull')) {
    if (checkout.scan.should?.('pull')) await doPullCheckout(ctx, checkout);
    if (checkout.scan?.can?.('push') && checkout.scan.should?.('push')) {
      await doPushCheckout(ctx, checkout);
    }
  }
});
```

Change to:

```ts
await runWithConcurrency(ctx.store.getAllCheckouts(), 4, async checkout => {
  if (checkout.scan?.can?.('pull')) {
    const pulled = checkout.scan.should?.('pull') ? await doPullCheckout(ctx, checkout) : checkout;
    if (pulled?.scan?.can?.('push') && pulled.scan.should?.('push')) {
      await doPushCheckout(ctx, pulled);
    }
  }
});
```

Key changes:

- Capture `doPullCheckout` return value as `pulled` (or fall back to original `checkout` if pull was not needed).
- Use `pulled` for the `can('push')` / `should('push')` checks and for `doPushCheckout`.
- Note: `doPullCheckout` returns `null` on failure — in that case, skip the push (the `pulled?.scan?.can?.('push')` guard handles this).

**Fix 2 — Remove redundant workspace scan:**

Current code:

```ts
await scanWorkspaceCheckout(ctx);
await syncWorkspaceCheckout(ctx);
```

Change to:

```ts
await syncWorkspaceCheckout(ctx);
```

`syncWorkspaceCheckout` already calls `scanCheckoutState(ctx, workspace, true)` at the end, so the pre-scan is redundant.

Expected outcome: `runSync` uses post-pull checkout state for push decisions; workspace is scanned only once (inside `syncWorkspaceCheckout`).

### Step `6 / 7` — Commit `fix-sync-stale-checkout`

---

#### Commit: `fix-sync-stale-checkout`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
fix(workspace-cli): Fix stale checkout in sync and remove redundant workspace scan.

- Capture `doPullCheckout` return value and use it for the push decision.
- Remove redundant `scanWorkspaceCheckout` before `syncWorkspaceCheckout` in `runSync`.
```

**Stage:** `$PROJECT/src/commands/sync/runSync.ts`

### Step `7 / 7` — Update tests and commit `cover-refetch-and-sync-fix`

In `$PROJECT/src/private/store/scanAllCheckoutsStates.test.ts`:

- Add a test that `scanAllCheckoutsStates` with `refetch: true` passes the flag through to `scanCheckoutState` (verify via mock or spy).

In `$PROJECT/src/commands/sanity/runSanity.test.ts`:

- Add a test for `sanity --refetch` that verifies `scanAllCheckoutsStates` and `scanWorkspaceCheckout` are called with `refetch: true`.

In `$PROJECT/src/commands/sync/runSync.test.ts`:

- Update the test that verifies sync pulls then pushes: confirm that the push decision uses the post-pull checkout state (the checkout returned by `doPullCheckout`).
- Verify that when `doPullCheckout` returns `null` (failure), the push is skipped.

Expected outcome: all new paths are covered; all 250+ tests pass.

---

#### Commit: `cover-refetch-and-sync-fix`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test(workspace-cli): Cover refetch parameter and fixed sync behaviour.

- Test `scanAllCheckoutsStates` with `refetch: true`.
- Test `sanity --refetch` produces accurate ahead/behind.
- Test `runSync` uses post-pull checkout for push decision.
```

**Stage:** `$PROJECT/src/private/store/scanAllCheckoutsStates.test.ts`, `$PROJECT/src/commands/sanity/runSanity.test.ts`, `$PROJECT/src/commands/sync/runSync.test.ts` (and any other test files changed)

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `scanAllCheckoutsStates` accepts `refetch` parameter and forwards it to `scanCheckoutState`.
- Verify that `sanity --refetch` passes `refetch: true` to both `scanAllCheckoutsStates` and `scanWorkspaceCheckout`.
- Verify that `runSync` captures `doPullCheckout` return value and uses it for push decisions.
- Verify that `runSync` no longer calls `scanWorkspaceCheckout` before `syncWorkspaceCheckout`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
