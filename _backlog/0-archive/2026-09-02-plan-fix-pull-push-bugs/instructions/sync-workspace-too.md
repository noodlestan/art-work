# Instructions: `sync-workspace-too`

**Plan:** `fix-pull-push-bugs`

**Iteration Id:** `sync-workspace-too`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-fix-pull-push-bugs/instructions/sync-workspace-too__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `sync-workspace-too`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `sync-workspace-too`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make `pull`, `push`, `sync`, and `sanity --auto` all apply their pull/push logic to the workspace root consistently, so the workspace root is kept in sync like any other checkout.

## Mandatory Reading

- Bugs: `$PROJECT/_backlog/3-now/plan-fix-pull-push-bugs/plan__bugs.md` — bug scenarios and evidence.
- Architecture: `$PROJECT/architecture/commands.md` — command behaviour and BDD scenarios.
- Pseudo-code: `$PROJECT/architecture/_pseudo.md` — pseudo-code contracts.
- Briefing: `$PROJECT/_roadmap/_architect.md` — workspace principles and NFRs.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

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

Extend `pull`, `push`, and `sync` to scan and operate on the workspace root (like `sanity --auto` does), reusing or extracting the workspace root scan/operation logic from `runSanity` into a shared helper.

- Step 1 / 4 — Extract shared workspace root logic
- Step 2 / 4 — Extend pull/push/sync to the workspace root
- Step 3 / 4 — Add/update tests
- Step 4 / 4 — Commit `sync-workspace-too`

## Steps

### Step `1 / 4` — Extract shared workspace root logic

**Goal:** Factor the workspace root scan/operation logic out of `runSanity` so it can be reused by `pull`, `push`, and `sync`.

**Preparatory instructions:**

Read the current command flows:

- `$PROJECT/src/commands/sanity/runSanity.ts`
- `$PROJECT/src/commands/pull/runPull.ts`
- `$PROJECT/src/commands/push/runPush.ts`
- `$PROJECT/src/commands/sync/runSync.ts`
- `$PROJECT/src/private/commands/workspaces/pullWorkspaceCheckout.ts`
- `$PROJECT/src/private/scan/scanCheckoutState.ts`

**Detailed execution instructions:**

1. In `runSanity.ts`, the workspace root is scanned via `scanCheckoutState` on a checkout created with `createCheckout(ctx.config, '.', undefined, 'main', 'Workspace')` and stored on `ctx.workspace`. The pull is performed by `pullWorkspaceCheckout(ctx)`.
2. Extract this workspace-root scan + operation logic into a shared helper (e.g. under `$PROJECT/src/private/commands/workspaces/`) that can be called by `pull`, `push`, `sync`, and `sanity`.
3. The helper should scan the workspace root, set `ctx.workspace`, and expose the pull (and push, where applicable) operations on the workspace root.
4. Keep `runSanity` behaviour unchanged (it should still present the workspace report and run `pushCleanCheckouts`).

**Expected outcome:** A shared helper exists that `runSanity` uses and that `pull`/`push`/`sync` can call.

### Step `2 / 4` — Extend pull/push/sync to the workspace root

**Goal:** Make `pull`, `push`, and `sync` operate on the workspace root like `sanity --auto` does.

**Detailed execution instructions:**

1. In `$PROJECT/src/commands/pull/runPull.ts`, after scanning store checkouts, also scan the workspace root and pull it when it is behind and clean (mirroring `pullWorkspaceCheckout`).
2. In `$PROJECT/src/commands/push/runPush.ts`, also scan the workspace root and push it when it is ahead and clean.
3. In `$PROJECT/src/commands/sync/runSync.ts`, also scan the workspace root and pull/push it as appropriate.
4. Reuse the shared helper from Step 1. Do not duplicate logic.
5. Ensure the workspace root operations log correctly (pull/push success/failure) and that a failure on the workspace root does not stop the other checkout operations.

**Expected outcome:** `pull`, `push`, and `sync` all apply their pull/push logic to the workspace root.

### Step `3 / 4` — Add/update tests

**Goal:** Cover workspace root pull/push/sync for all commands.

**Detailed execution instructions:**

1. In `$PROJECT/src/commands/pull/runPull.test.ts`, add a test that pulls the workspace root when it is behind and clean.
2. In `$PROJECT/src/commands/push/runPush.test.ts`, add a test that pushes the workspace root when it is ahead and clean.
3. In `$PROJECT/src/commands/sync/runSync.test.ts`, add a test that syncs the workspace root.
4. Reuse the `makeWorkspaceRootBehind` pattern from `$PROJECT/src/commands/sanity/runSanity.test.ts` (or extract it to a shared test helper if it is needed in multiple files).
5. Run the focused tests for the changed files before the full suite.

**Expected outcome:** Tests cover workspace root pull/push/sync for all commands and pass.

### Step `4 / 4` — Commit `sync-workspace-too`

---

#### Commit: `sync-workspace-too`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(workspace-cli): apply pull/push/sync logic to the workspace root.

- Extend `runPull`, `runPush`, `runSync` to operate on the workspace root.
- Extract shared workspace root scan/operation logic from `runSanity`.
- Add/update tests covering workspace root pull/push/sync for all commands.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `pull`, `push`, and `sync` all operate on the workspace root, and that `sanity --auto` still works.
- Verify that a workspace root operation failure does not stop other checkout operations.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
