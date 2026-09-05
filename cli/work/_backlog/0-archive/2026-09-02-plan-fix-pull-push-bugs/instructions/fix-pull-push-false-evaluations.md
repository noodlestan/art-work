# Instructions: `fix-pull-push-false-evaluations`

**Plan:** `fix-pull-push-bugs`

**Iteration Id:** `fix-pull-push-false-evaluations`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-fix-pull-push-bugs/instructions/fix-pull-push-false-evaluations__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fix-pull-push-false-evaluations`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fix-pull-push-false-evaluations`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Fix the behind detection system so it accurately reports behind/ahead state on all checkouts, eliminating both false positives (behind when clean) and false negatives (not behind when actually behind). Resolve bugs `pull-behind-false-positive` and `pull-behind-false-negative`.

## Mandatory Reading

- Bugs: `$PROJECT/_backlog/3-now/plan-fix-pull-push-bugs/plan__bugs.md` — bug scenarios and evidence for both `pull-behind-false-positive` and `pull-behind-false-negative`.
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

Investigate and fix the root cause of unreliable behind detection in `getBehindCount`, `getRemoteBranch`, and `scanCheckoutState`. Update existing tests to cover both false positive and false negative scenarios. The fix should resolve bugs `pull-behind-false-positive` and `pull-behind-false-negative`.

- Step 1 / 7 — Investigate false negative
- Step 2 / 7 — Investigate false positive
- Step 3 / 7 — Fix root cause
- Step 4 / 7 — Update existing tests
- Step 5 / 7 — Commit `fix-behind-detection`
- Step 6 / 7 — Update knowledge
- Step 7 / 7 — Commit `update-behind-knowledge`

## Steps

### Step `1 / 7` — Investigate false negative

**Goal:** Trace why the behind count does not show when a checkout IS behind, and why `sync` does not attempt a pull.

**Preparatory instructions:**

Read the scan flow end to end before changing anything:

- `$PROJECT/src/private/git/getBehindCount.ts`
- `$PROJECT/src/private/git/getRemoteBranch.ts`
- `$PROJECT/src/private/scan/scanCheckoutState.ts`
- `$PROJECT/src/private/scan/private/createCheckoutScan.ts`
- `$PROJECT/src/private/store/scanAllCheckoutsStates.ts`
- `$PROJECT/src/commands/pull/runPull.ts`
- `$PROJECT/src/commands/sync/runSync.ts`

**Detailed execution instructions:**

1. Confirm the current behaviour: `getBehindCount` runs `git rev-list --count HEAD..<remoteBranch>` where `<remoteBranch>` is the **local** `origin/<branch>` tracking reference returned by `getRemoteBranch`.
2. Note that the local `origin/<branch>` reference is only updated by `git fetch`. Neither `scanAllCheckoutsStates` nor the `pull`/`sync`/`sanity` commands run `git fetch` before scanning.
3. Reproduce the false negative: create a checkout where origin has commits the local branch does not have, WITHOUT running `git fetch` on the checkout, then run `runPull`/`runSync`. Observe that `scanCheckoutState` reports `behind = 0` because the local `origin/<branch>` reference is stale.
4. Record the exact evidence (commands run, observed `sync` state, issues list) in your report.

**Expected outcome:** A clear, evidence-backed explanation of why the behind count is 0 when the checkout is genuinely behind.

### Step `2 / 7` — Investigate false positive

**Goal:** Trace why the behind count shows when a checkout is NOT behind.

**Detailed execution instructions:**

1. Reproduce the false positive: create a checkout that is clean and up to date with origin, but whose local `origin/<branch>` reference is stale/advanced (e.g. a previous fetch advanced it while HEAD was reset or rebased, or the reference was never updated to match the remote).
2. Run `runPull` and observe that `scanCheckoutState` reports `behind > 0` and a pull is attempted even though the checkout is genuinely up to date.
3. Confirm whether `getRemoteBranch` can also return a stale or incorrect tracking branch name in certain git states (e.g. detached HEAD, missing upstream, multiple remotes).
4. Record the exact evidence in your report.

**Expected outcome:** A clear, evidence-backed explanation of why the behind count is > 0 when the checkout is genuinely up to date.

### Step `3 / 7` — Fix root cause

**Goal:** Make behind detection accurate for both scenarios.

**Detailed execution instructions:**

1. Based on the investigation, fix the root cause in `getBehindCount.ts`, `getRemoteBranch.ts`, or `scanCheckoutState.ts`. The fix MUST ensure the behind count reflects the actual remote state, not a stale local tracking reference.
2. Prefer the smallest, most targeted change. A common approach is to fetch the remote branch (or the remote) before computing the behind count, or to compute the count against the actual remote ref. Choose the approach that is correct and does not regress the `pull`/`sync`/`sanity` flows.
3. Ensure the fix does not break the `ahead` (unpushed) detection in `getUnpushedCount` or the `can`/`should` logic in `createCheckoutScan`.
4. Do not change command behaviour beyond what is needed to fix behind detection.

**Expected outcome:** `scanCheckoutState` reports the correct behind count for both a genuinely-behind checkout and a genuinely-up-to-date checkout.

### Step `4 / 7` — Update existing tests

**Goal:** Cover both false positive and false negative scenarios, preferring updates to existing tests.

**Detailed execution instructions:**

1. Prefer updating existing test cases where the use case is already exercised (happy path). Only add new test scenarios if absolutely necessary.
2. In `$PROJECT/src/private/git/getBehindCount.test.ts`, ensure the up-to-date case and the behind case both reflect the fix (e.g. the up-to-date case must not require a manual fetch to be accurate).
3. In `$PROJECT/src/commands/pull/runPull.test.ts`, add/update assertions so that:
   - a clean checkout that is up to date with origin reports no issues and performs no pull (false positive regression);
   - a checkout that is behind origin reports "N commit(s) behind" and performs a pull (false negative regression).
4. In `$PROJECT/src/commands/sync/runSync.test.ts`, add/update assertions so that `sync` pulls when behind.
5. Run the focused tests for the changed files before the full suite.

**Expected outcome:** Tests cover both false positive and false negative scenarios and pass.

### Step `5 / 7` — Commit `fix-behind-detection`

---

#### Commit: `fix-behind-detection`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
fix(workspace-cli): fix behind detection false positives and false negatives.

- Fix root cause in `getBehindCount`, `getRemoteBranch`, `scanCheckoutState`.
- Update existing tests to cover both false positive and false negative scenarios.
```

### Step `6 / 7` — Update knowledge

**Goal:** Synchronize knowledge resources with the fix, only if the fix changes function signatures or command behaviour.

**Detailed execution instructions:**

1. Review `$PROJECT/architecture/commands.md` and `$PROJECT/architecture/_pseudo.md`.
2. If the fix changed any function signature, command behaviour, or pseudo-code contract, update the relevant sections to match.
3. If nothing changed in the public contract, skip this step and do not create the knowledge commit.

**Expected outcome:** Knowledge resources are accurate, or no change was needed.

### Step `7 / 7` — Commit `update-behind-knowledge`

---

#### Commit: `update-behind-knowledge`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
arch(workspace-cli): update behind detection knowledge.

- Update `architecture/commands.md` and `architecture/_pseudo.md` if signatures or command behaviour changed.
```

**Note:** This commit is conditional. If Step 6 made no changes, skip this commit and report that it was not needed.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that both bugs `pull-behind-false-positive` and `pull-behind-false-negative` are resolved: a clean up-to-date checkout reports no behind issue, and a genuinely-behind checkout reports "N commit(s) behind" and pulls.
- Verify that `pull`, `sync`, and `sanity --auto` all benefit from the fix (they share the same scan flow).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
