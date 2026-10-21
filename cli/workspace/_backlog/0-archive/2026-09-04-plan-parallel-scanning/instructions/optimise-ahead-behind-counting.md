# Instructions: `optimise-ahead-behind-counting`

**Plan:** `parallel-scanning`

**Iteration Id:** `optimise-ahead-behind-counting`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-parallel-scanning/instructions/optimise-ahead-behind-counting__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `optimise-ahead-behind-counting`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `optimise-ahead-behind-counting`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Cut the per-checkout git subprocess and network-fetch cost of ahead/behind counting, which dominates scan latency. Ahead/behind counting is split into an expensive network fetch (`remoteFetch`, once per checkout) and a cheap local count (`getBehindAheadCount`, single `rev-list`). `scanCheckoutState` uses the cheap local count. The expensive fetch is added here but only invoked when a caller opts in via `refetch` (next iteration).

## How It Works

Today `scanCheckoutState` computes ahead with `getUnpushedCount` (a `git status` + a `rev-list`) and behind with `getBehindCount` (a per-branch network `git fetch('origin', branch)` + a `rev-list`). Both are replaced by one helper that yields both counts in a single local inspection.

`getBehindAheadCount(dir, remoteBranch)`:

- If `remoteBranch` is `null` (new branch with no remote counterpart): `ahead` = commits not reachable from any origin remote (`git rev-list --count HEAD --not --remotes=origin`), `behind` = `0`.
- Otherwise: run one `git rev-list --left-right --count <remoteBranch>...HEAD` and parse the two numbers. For `origin/main...HEAD`, the output is `<behind> <ahead>` (left = commits only in the remote, right = commits only in HEAD).
- On any failure (including an unreachable remote), return `{ ahead: 0, behind: 0 }` so the scan reflects the last-known state instead of failing.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/index.md` — how the CLI is structured and how scan/git helpers fit together.
- architecture: `$PROJECT/architecture/context-model.md` — `WorkspaceContext`, `CheckoutStore`, and checkout scan types.
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

- Step 1 / 8 — Add `getBehindAheadCount` helper
- Step 2 / 8 — Add `remoteFetch` helper
- Step 3 / 8 — Commit `add-remote-fetch-and-ahead-behind-count`
- Step 4 / 8 — Update `scanCheckoutState` to use `getBehindAheadCount`
- Step 5 / 8 — Delete `getUnpushedCount` and `getBehindCount`
- Step 6 / 8 — Commit `use-combined-ahead-behind-in-scan`
- Step 7 / 8 — Update tests for the combined counting path
- Step 8 / 8 — Commit `cover-ahead-behind-counting`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 8` — Add `getBehindAheadCount` helper

Create `$PROJECT/src/private/git/getBehindAheadCount.ts`:

```ts
import simpleGit from 'simple-git';

export interface AheadBehind {
  ahead: number;
  behind: number;
}

export async function getBehindAheadCount(
  dir: string,
  remoteBranch: string | null,
): Promise<AheadBehind> {
  const git = simpleGit(dir);
  try {
    if (!remoteBranch) {
      const ahead = await git.raw(['rev-list', '--count', 'HEAD', '--not', '--remotes=origin']);
      return { ahead: Number.parseInt(ahead.trim(), 10) || 0, behind: 0 };
    }
    const counts = await git.raw(['rev-list', '--left-right', '--count', `${remoteBranch}...HEAD`]);
    const [behind, ahead] = counts.trim().split(/\s+/).map(Number);
    return { ahead, behind };
  } catch {
    // Remote unreachable / command failed: fall back to last-known state.
    return { ahead: 0, behind: 0 };
  }
}
```

Expected outcome: `$PROJECT/src/private/git/getBehindAheadCount.ts` exports `getBehindAheadCount` and `AheadBehind` and compiles.

### Step `2 / 8` — Add `remoteFetch` helper

Create `$PROJECT/src/private/git/remoteFetch.ts`:

```ts
import simpleGit from 'simple-git';

export async function remoteFetch(dir: string): Promise<void> {
  const git = simpleGit(dir);
  try {
    await git.fetch('origin');
  } catch {
    // Remote unreachable: swallow so the cheap count still reflects last-known state.
  }
}
```

Expected outcome: `$PROJECT/src/private/git/remoteFetch.ts` exports `remoteFetch` and compiles.

### Step `3 / 8` — Commit `add-remote-fetch-and-ahead-behind-count`

---

#### Commit: `add-remote-fetch-and-ahead-behind-count`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Add remote fetch and combined ahead/behind count helpers.

- Add `remoteFetch` performing one `git fetch origin` per checkout.
- Add `getBehindAheadCount` reading both counts with a single `rev-list` inspection.
```

**Stage:** `$PROJECT/src/private/git/getBehindAheadCount.ts`, `$PROJECT/src/private/git/remoteFetch.ts` (both new files)

### Step `4 / 8` — Update `scanCheckoutState` to use `getBehindAheadCount`

In `$PROJECT/src/private/scan/scanCheckoutState.ts`:

- Replace the imports of `getBehindCount` and `getUnpushedCount` with `getBehindAheadCount`.
- Inside the `if (remote && branch !== '-' && branch !== 'HEAD')` block, replace the two separate ahead/behind calls with one:

```ts
remoteBranch = await getRemoteBranch(checkout.path);
const { ahead: aheadCount, behind: behindCount } = await getBehindAheadCount(
  checkout.path,
  remoteBranch,
);
ahead = aheadCount;
behind = behindCount;
```

- Remove the `ctx.log.log(createOperationPending('scan-checkout-state-behind', checkout.record.location))` line and the `createOperationPending` import if it is then unused.
- Do **not** call `remoteFetch` here. `remoteFetch` was added in Step 2 and is deliberately left unwired; the next iteration (`make-scan-refetch-opt-in`, Step 1) wires it behind a `refetch` flag — `if (refetch) await remoteFetch(checkout.path)` — and threads that flag through `scanAllCheckoutsStates`, `scanWorkspaceCheckout`, and the `do-` helpers. This step only switches the scan to the cheap combined count.

Expected outcome: `scanCheckoutState` performs a single cheap local inspection for ahead/behind, with no per-branch network fetch.

### Step `5 / 8` — Delete `getUnpushedCount` and `getBehindCount`

- Delete `$PROJECT/src/private/git/getUnpushedCount.ts` and `$PROJECT/src/private/git/getBehindCount.ts`.
- Delete their tests `$PROJECT/src/private/git/getUnpushedCount.test.ts` and `$PROJECT/src/private/git/getBehindCount.test.ts`.
- Grep the package (excluding `_backlog`) for any remaining imports of `getUnpushedCount` or `getBehindCount` and update/remove them.

Expected outcome: no references to `getUnpushedCount` or `getBehindCount` remain in the package (excluding `_backlog`).

### Step `6 / 8` — Commit `use-combined-ahead-behind-in-scan`

---

#### Commit: `use-combined-ahead-behind-in-scan`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(workspace-cli): Count ahead/behind with a single inspection in scan.

- `scanCheckoutState` runs `getBehindAheadCount` in place of the old ahead/behind calls.
- Delete superseded `getUnpushedCount` and `getBehindCount`.
```

**Stage:** `$PROJECT/src/private/scan/scanCheckoutState.ts` (modified); delete `$PROJECT/src/private/git/getUnpushedCount.ts`, `$PROJECT/src/private/git/getBehindCount.ts`, `$PROJECT/src/private/git/getUnpushedCount.test.ts`, `$PROJECT/src/private/git/getBehindCount.test.ts`

### Step `7 / 8` — Update tests for the combined counting path

Create `$PROJECT/src/private/git/getBehindAheadCount.test.ts` using the existing temp-dir/init-git helpers (`makeTempDir`, `initGitRepoTest`, `commitFileTest`, `removeTempDirs`) to cover:

- Both ahead and behind > 0 when the branch has diverged from `origin/main`.
- `ahead > 0, behind = 0` when only ahead.
- `behind > 0, ahead = 0` when only behind (local tracking ref updated).
- `0 / 0` when up to date.
- `{ ahead: 0, behind: 0 }` fallback when the remote is unreachable (no remote / command fails).

In `$PROJECT/src/private/scan/scanCheckoutState.test.ts`, confirm the existing assertions still pass with the combined count (they only assert issues, not counts). Add assertions only if needed to cover the new path.

Expected outcome: combined ahead/behind counting is covered, including the remote-unreachable fallback.

### Step `8 / 8` — Commit `cover-ahead-behind-counting`

---

#### Commit: `cover-ahead-behind-counting`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test(workspace-cli): Cover combined ahead/behind counting and fallbacks.

- Test ahead/behind correctness and the remote-unreachable fallback.
```

**Stage:** `$PROJECT/src/private/git/getBehindAheadCount.test.ts` (new file); `$PROJECT/src/private/scan/scanCheckoutState.test.ts` (only if changed)

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/src/private/git/getBehindAheadCount.ts` and `$PROJECT/src/private/git/remoteFetch.ts` exist and export their functions.
- Verify that `scanCheckoutState` performs exactly one cheap `getBehindAheadCount` inspection (no `git status` + two `rev-list`, no per-branch fetch).
- Verify that `getUnpushedCount` and `getBehindCount` (and their tests) are deleted with no remaining references in the package.
- Verify tests cover both ahead and behind, up-to-date, and the remote-unreachable fallback.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
