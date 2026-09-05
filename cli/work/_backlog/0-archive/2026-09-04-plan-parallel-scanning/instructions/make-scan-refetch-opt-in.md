# Instructions: `make-scan-refetch-opt-in`

**Plan:** `parallel-scanning`

**Iteration Id:** `make-scan-refetch-opt-in`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-parallel-scanning/instructions/make-scan-refetch-opt-in__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `make-scan-refetch-opt-in`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `make-scan-refetch-opt-in`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make the network `remoteFetch` during scanning opt-in via a `refetch` flag. Cheap pre-scan passes stay local (no network fetch), while post-side-effect scans in pull/push/sync/sanity refresh with `refetch: true`. Rename the workspace command helpers to a `do-` prefix, add `syncWorkspaceCheckout`, and rename `pushCleanCheckouts` to `syncCheckouts`.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/index.md` — how the CLI is structured and how `WorkspaceContext`, `CheckoutStore`, and reports fit together.
- architecture: `$PROJECT/architecture/context-model.md` — `WorkspaceContext`, `CheckoutStore`, and checkout scan types.
- architecture: `$PROJECT/architecture/commands.md` — designed behaviour and BDD for `sanity`, `pull`, `push`, `sync`.
- architecture: `$PROJECT/architecture/_pseudo.md` — pseudo-code contract for the scan and git inspection.

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

- Step 1 / 15 — Add `refetch?: boolean` to `scanCheckoutState`
- Step 2 / 15 — Add `refetch?: boolean` to `scanAllCheckoutsStates`
- Step 3 / 15 — Add `refetch?: boolean` to `scanWorkspaceCheckout`
- Step 4 / 15 — Re-scan with `refetch: true` in `doPullCheckout`/`doPushCheckout`
- Step 5 / 15 — Add tests for cheap-vs-refetch scan behaviour
- Step 6 / 15 — Commit `thread-refetch-through-scan`
- Step 7 / 15 — Rename workspace helpers to `do-` prefix and add `syncWorkspaceCheckout`
- Step 8 / 15 — Rename `pushCleanCheckouts` to `syncCheckouts`
- Step 9 / 15 — Update tests for renamed helpers
- Step 10 / 15 — Commit `rename-workspace-command-helpers`
- Step 11 / 15 — Update `runPull` (pre-scan stays cheap)
- Step 12 / 15 — Update `runPush` (drop pre-push pull)
- Step 13 / 15 — Update `runSync` (use `checkout` directly)
- Step 14 / 15 — Update runner tests
- Step 15 / 15 — Commit `refetch-after-side-effects`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 15` — Add `refetch?: boolean` to `scanCheckoutState`

In `$PROJECT/src/private/scan/scanCheckoutState.ts`:

- Change the signature to accept an optional `refetch` flag (default `false`):

```ts
export async function scanCheckoutState(
	ctx: WorkspaceContext,
	checkout: Checkout,
	refetch = false,
): Promise<Checkout> {
```

- Add the `remoteFetch` import.
- Inside the `if (remote && branch !== '-' && branch !== 'HEAD')` block, when `refetch` is true run the network fetch before the cheap count:

```ts
remoteBranch = await getRemoteBranch(checkout.path);
if (refetch) await remoteFetch(checkout.path);
const { ahead: aheadCount, behind: behindCount } = await getBehindAheadCount(
  checkout.path,
  remoteBranch,
);
ahead = aheadCount;
behind = behindCount;
```

Expected outcome: scanning is cheap by default; the network fetch runs only when `refetch` is true.

### Step `2 / 15` — Add `refetch?: boolean` to `scanAllCheckoutsStates`

In `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`:

- Change the signature to `scanAllCheckoutsStates(ctx: WorkspaceContext, refetch = false)`.
- Pass `refetch` through to each `scanCheckoutState(ctx, checkout, refetch)` call inside the concurrency callback.

Expected outcome: `scanAllCheckoutsStates` forwards the flag to every checkout scan.

### Step `3 / 15` — Add `refetch?: boolean` to `scanWorkspaceCheckout`

In `$PROJECT/src/private/commands/workspaces/scanWorkspaceCheckout.ts`:

- Change the signature to `scanWorkspaceCheckout(ctx: WorkspaceContext, refetch = false)`.
- Pass `refetch` through to `scanCheckoutState(ctx, workspaceCheckout, refetch)`.

Expected outcome: the workspace-root scan also defaults cheap and supports `refetch`.

### Step `4 / 15` — Re-scan with `refetch: true` in `doPullCheckout`/`doPushCheckout`

In `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts` and `$PROJECT/src/private/commands/checkouts/doPushCheckout.ts`:

- Change the post-side-effect re-scan from `scanCheckoutState(ctx, checkout)` to `scanCheckoutState(ctx, checkout, true)` so a checkout is re-scanned with a network refresh after being pulled/pushed.

Expected outcome: `doPullCheckout`/`doPushCheckout` refresh the checkout state after the side effect.

### Step `5 / 15` — Add tests for cheap-vs-refetch scan behaviour

In `$PROJECT/src/private/scan/scanCheckoutState.test.ts`, add a test (using the existing temp-dir/init-git helpers) that:

- Sets up a working repo with a remote `origin` (bare) and pushes, then pushes an additional commit from a second clone so the working repo's local tracking ref is stale.
- Asserts that `scanCheckoutState(ctx, checkout)` (default, `refetch` false) reports `behind: 0` (no network fetch), while `scanCheckoutState(ctx, checkout, true)` reports `behind: 1` (fetch refreshes the tracking ref).

Expected outcome: the opt-in refetch behaviour is covered.

### Step `6 / 15` — Commit `thread-refetch-through-scan`

---

#### Commit: `thread-refetch-through-scan`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Make ahead/behind remote fetch opt-in via refetch flag.

- Add optional `refetch` to `scanCheckoutState`, `scanAllCheckoutsStates`, and `scanWorkspaceCheckout`.
- Cheap local count by default; network fetch only when `refetch: true`.
```

**Stage:** `$PROJECT/src/private/scan/scanCheckoutState.ts`, `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`, `$PROJECT/src/private/commands/workspaces/scanWorkspaceCheckout.ts`, `$PROJECT/src/private/commands/checkouts/doPullCheckout.ts`, `$PROJECT/src/private/commands/checkouts/doPushCheckout.ts`, `$PROJECT/src/private/scan/scanCheckoutState.test.ts`

### Step `7 / 15` — Rename workspace helpers to `do-` prefix and add `syncWorkspaceCheckout`

In `$PROJECT/src/private/commands/workspaces/`:

- Rename `pullWorkspaceCheckout.ts` → `doPullWorkspaceCheckout.ts`; rename the function `pullWorkspaceCheckout` → `doPullWorkspaceCheckout`. Inside, change the re-scan to `scanCheckoutState(ctx, workspace, true)`.
- Rename `pushWorkspaceCheckout.ts` → `doPushWorkspaceCheckout.ts`; rename the function `pushWorkspaceCheckout` → `doPushWorkspaceCheckout`. Inside, change the re-scan to `scanCheckoutState(ctx, workspace, true)`.
- Add `syncWorkspaceCheckout.ts` exporting `syncWorkspaceCheckout(ctx)` that pulls then pushes the workspace root, then re-scans with `scanCheckoutState(ctx, workspace, true)` and sets `ctx.workspace` (mirror the `doPullWorkspaceCheckout`/`doPushWorkspaceCheckout` logging and failure handling; use `createPullPending`/`createPullSuccess`/`createPullFailure` and `createPushPending`/`createPushSuccess`/`createPushFailure`).
- Update all call sites to the new names:
  - `$PROJECT/src/commands/pull/runPull.ts` — import/use `doPullWorkspaceCheckout`.
  - `$PROJECT/src/commands/push/runPush.ts` — import/use `doPushWorkspaceCheckout`.
  - `$PROJECT/src/commands/sync/runSync.ts` — import/use `syncWorkspaceCheckout` (replacing the separate `pullWorkspaceCheckout` + `pushWorkspaceCheckout` calls).
  - `$PROJECT/src/commands/sanity/runSanity.ts` — import/use `doPullWorkspaceCheckout`.
- Rename the test files `pullWorkspaceCheckout.test.ts` → `doPullWorkspaceCheckout.test.ts` and `pushWorkspaceCheckout.test.ts` → `doPushWorkspaceCheckout.test.ts`, updating the imported function names.

Expected outcome: the workspace command helpers are `do-`-prefixed, a `syncWorkspaceCheckout` exists, and no references to the old `pullWorkspaceCheckout`/`pushWorkspaceCheckout` names remain in the package (excluding `_backlog`).

### Step `8 / 15` — Rename `pushCleanCheckouts` to `syncCheckouts`

- Rename `$PROJECT/src/commands/sanity/private/pushCleanCheckouts.ts` → `syncCheckouts.ts`; rename the function `pushCleanCheckouts` → `syncCheckouts`.
- Update the import in `$PROJECT/src/commands/sanity/runSanity.ts`.
- Rename `$PROJECT/src/commands/sanity/private/pushCleanCheckouts.test.ts` → `syncCheckouts.test.ts`, updating the imported function name.

Expected outcome: `syncCheckouts` replaces `pushCleanCheckouts` with no remaining references in the package (excluding `_backlog`).

### Step `9 / 15` — Update tests for renamed helpers

- Update `doPullWorkspaceCheckout.test.ts`, `doPushWorkspaceCheckout.test.ts`, and `syncCheckouts.test.ts` so they exercise the renamed functions.
- Add a `syncWorkspaceCheckout` test that verifies the workspace root is pulled then pushed and re-scanned with `refetch` (a `pull` operation followed by a `push` operation is logged, and `ctx.workspace` is updated).

Expected outcome: all renamed helpers are covered by tests.

### Step `10 / 15` — Commit `rename-workspace-command-helpers`

---

#### Commit: `rename-workspace-command-helpers`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(workspace-cli): Rename workspace command helpers and add sync helper.

- Rename `pullWorkspaceCheckout`/`pushWorkspaceCheckout` to `do-` prefix.
- Add `syncWorkspaceCheckout`; rename `pushCleanCheckouts` to `syncCheckouts`.
```

**Stage:** `$PROJECT/src/private/commands/workspaces/doPullWorkspaceCheckout.ts`, `$PROJECT/src/private/commands/workspaces/doPushWorkspaceCheckout.ts`, `$PROJECT/src/private/commands/workspaces/syncWorkspaceCheckout.ts` (new), `$PROJECT/src/commands/sanity/private/syncCheckouts.ts`, `$PROJECT/src/commands/sanity/runSanity.ts`, `$PROJECT/src/commands/pull/runPull.ts`, `$PROJECT/src/commands/push/runPush.ts`, `$PROJECT/src/commands/sync/runSync.ts`, plus renamed tests `doPullWorkspaceCheckout.test.ts`, `doPushWorkspaceCheckout.test.ts`, `syncCheckouts.test.ts`, `syncWorkspaceCheckout.test.ts` (new)

### Step `11 / 15` — Update `runPull` (pre-scan stays cheap)

In `$PROJECT/src/commands/pull/runPull.ts`:

- Confirm the pre-scan `scanAllCheckoutsStates(ctx)` and `scanWorkspaceCheckout(ctx)` remain cheap (no `refetch` argument — default false).
- The per-checkout pull re-scan happens inside `doPullCheckout` (`refetch: true`), and the workspace re-scan inside `doPullWorkspaceCheckout` (`refetch: true`). No further change is needed to `runPull`.

Expected outcome: `runPull` scans cheaply up front and refreshes with a network fetch only for the checkouts/workspace it actually pulls.

### Step `12 / 15` — Update `runPush` (drop pre-push pull)

In `$PROJECT/src/commands/push/runPush.ts`:

- Remove the pre-push pull block:

```ts
if (checkout.scan.should?.('pull')) {
  await doPullCheckout(ctx, checkout);
}
```

- Keep the `current` re-read and the `doPushCheckout(ctx, current)` call. `doPushCheckout` re-scans with `refetch: true` after the push.

Expected outcome: `runPush` no longer pulls first; clean-and-ahead checkouts are pushed and then re-scanned with a network refresh.

### Step `13 / 15` — Update `runSync` (use `checkout` directly)

In `$PROJECT/src/commands/sync/runSync.ts`:

- Replace the `current = ctx.store.getCheckoutForLocation(checkout.record.location) ?? checkout` indirection with the `checkout` variable directly, so the push step uses the loop's `checkout`:

```ts
for (const checkout of ctx.store.getAllCheckouts()) {
  if (checkout.scan?.can?.('pull')) {
    if (checkout.scan.should?.('pull')) await doPullCheckout(ctx, checkout);
    if (checkout.scan?.can?.('push') && checkout.scan.should?.('push')) {
      await doPushCheckout(ctx, checkout);
    }
  }
}
```

- The workspace root is handled by `syncWorkspaceCheckout(ctx)` (imported in Step 7), replacing the separate pull/push calls.

Expected outcome: `runSync` pulls and pushes each checkout (re-scanning with `refetch: true` via `doPullCheckout`/`doPushCheckout`) and syncs the workspace root through `syncWorkspaceCheckout`.

### Step `14 / 15` — Update runner tests

- In `$PROJECT/src/commands/push/runPush.test.ts`, remove or rewrite the `tries pull first if behind` scenario so it no longer asserts a `pull` operation before `push` (the pre-push pull is gone).
- In `$PROJECT/src/commands/sync/runSync.test.ts` and `$PROJECT/src/commands/pull/runPull.test.ts`, confirm the renamed workspace helpers and `syncWorkspaceCheckout` are exercised and the existing `pull`/`push` operation assertions still hold.

Expected outcome: runner tests reflect the new refetch/rename behaviour and pass.

### Step `15 / 15` — Commit `refetch-after-side-effects`

---

#### Commit: `refetch-after-side-effects`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Refetch after side effects in pull, push, and sync.

- Keep pre-scan cheap; re-scan affected checkouts with `refetch: true` after pull/push/sync.
- Drop the pre-push pull in `runPush`.
```

**Stage:** `$PROJECT/src/commands/pull/runPull.ts`, `$PROJECT/src/commands/push/runPush.ts`, `$PROJECT/src/commands/sync/runSync.ts` (only if modified), plus updated runner tests

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `scanCheckoutState`, `scanAllCheckoutsStates`, and `scanWorkspaceCheckout` accept `refetch` and default to cheap (no network fetch).
- Verify that `doPullCheckout`, `doPushCheckout`, `doPullWorkspaceCheckout`, `doPushWorkspaceCheckout`, and `syncWorkspaceCheckout` re-scan with `refetch: true`.
- Verify the renames: `pullWorkspaceCheckout`/`pushWorkspaceCheckout` → `do-` prefix, `pushCleanCheckouts` → `syncCheckouts`, and that no old names remain in the package (excluding `_backlog`).
- Verify `runPush` no longer pulls before pushing and `runSync` uses the `checkout` variable directly.
- Verify cheap-vs-refetch behaviour is covered by tests and that `runPush`'s pre-push-pull test was removed/rewritten.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
