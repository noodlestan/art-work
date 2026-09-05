# Plan: Fix Pull Push Bugs

**ID:** `fix-pull-push-bugs`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Fix behind detection bugs (false positives and false negatives) in pull/sync/sanity, fix workspace state detection, and extend pull/push/sync logic to the workspace root.

**Description:** Three related fixes: (1) behind detection is unreliable — shows behind on clean checkouts and misses behind on dirty ones, (2) workspace report shows "unknown project" incorrectly, (3) pull/push/sync commands don't apply their logic to the workspace root (only sanity --auto does).

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Fix unreliable behind detection, incorrect workspace state reporting, and missing workspace-root pull/push/sync support across the workspace CLI.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                            |
| --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `_roadmap/_architect.md`                                           | Workspace principles, NFRs, milestones.                         |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-workspace-cli-one/milestone.md` | Coordinates this plan within the Workspace CLI One milestone.   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/commands.md` (Design) — Command behaviour and BDD scenarios. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Pseudo-code contracts. Relevant for Planning Work Item.
::READ `$PACKAGE/_backlog/3-now/plan-fix-pull-push-bugs/plan__bugs.md` (Bugs) — Bug scenarios and evidence. Relevant for Planning Work Item.

## Scope

Fix behind detection in `src/private/git/` and `src/private/scan/`. Fix workspace state detection. Extend pull/push/sync to workspace root. Affects `pull`, `push`, `sync`, and `sanity` commands.

## Work

### Next

All iterations are DONE. Plan complete.

### Blockers

- None.

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

If any of these fail, resolve the issue before proceeding with implementation.

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

## Items:

| Iteration / Instructions                   | Status |
| ------------------------------------------ | ------ |
| Iteration: Fix Pull Push False Evaluations | `DONE` |
| Iteration: Fix Workspace State Detection   | `DONE` |
| Iteration: Sync Workspace Too              | `DONE` |

### Iteration: Fix Pull Push False Evaluations

**Id:** `fix-pull-push-false-evaluations`

**Status:** `DONE`

**Purpose:** Fix the behind detection system so it accurately reports behind/ahead state on all checkouts, eliminating both false positives (behind when clean) and false negatives (not behind when actually behind).

**Description:** Investigate and fix the root cause of unreliable behind detection in `getBehindCount`, `getRemoteBranch`, and `scanCheckoutState`. Update existing tests to cover both false positive and false negative scenarios. The fix should resolve bugs `pull-behind-false-positive` and `pull-behind-false-negative`.

**Instructions:** `./plan-fix-pull-push-bugs/instructions/fix-pull-push-false-evaluations.md`

**Changes:**

- Investigate false negative: trace why behind count doesn't show when checkout IS behind (priority: early in step sequence).
- Investigate false positive: trace why behind count shows when checkout is NOT behind.
- Fix root cause in `getBehindCount.ts`, `getRemoteBranch.ts`, or `scanCheckoutState.ts`.
- Update existing tests to cover both scenarios — add assertions to existing test cases where the use case is already exercised (happy path). Only add new test scenarios if absolutely necessary.
- Commit fix and tests.
- Update knowledge (`architecture/commands.md`, `architecture/_pseudo.md`) if the fix changes function signatures or command behaviour. Commit knowledge changes only if needed.

**Dependencies:**

- None.

**Report:** `./plan-fix-pull-push-bugs/instructions/fix-pull-push-false-evaluations__report.md`

#### Commits:

| ID                     | Repository / Checkout / Branch      | Policy   | Hash    | Status      |
| ---------------------- | ----------------------------------- | -------- | ------- | ----------- |
| `fix-behind-detection` | Workspace CLI / `$PROJECT` / `main` | `NOPUSH` | 06b98b9 | `COMMITTED` |

##### Commit: `fix-behind-detection`

**Repository:** Workspace CLI

**Message:**

```
fix(workspace-cli): fix behind detection false positives and false negatives.

- Fix root cause in `getBehindCount`, `getRemoteBranch`, `scanCheckoutState`.
- Update existing tests to cover both false positive and false negative scenarios.
```

##### Commit: `update-behind-knowledge`

**Status:** SKIPPED — no contract changes needed.

**Message:**

```
arch(workspace-cli): update behind detection knowledge.

- Update `architecture/commands.md` and `architecture/_pseudo.md` if signatures or command behaviour changed.
```

### Iteration: Fix Workspace State Detection

**Id:** `fix-workspace-state-detection`

**Status:** `DONE`

**Purpose:** Fix the workspace report showing "unknown project" incorrectly and improve workspace state presentation.

**Description:** The workspace report uses a normal checkout structure but the workspace root has `repo: undefined`, which triggers the "unknown project" issue. Filter out inapplicable issues and convert the workspace output from table to a list of fields.

**Instructions:** `./plan-fix-pull-push-bugs/instructions/fix-workspace-state-detection.md`

**Changes:**

- In `workspace.scan?.issues().join`, filter out "unknown project" (and other inapplicable issues).
- Convert workspace output from table to list of fields: remote, path, branch, issues.
- Add/update tests for workspace state detection.

**Dependencies:**

- `fix-pull-push-false-evaluations` — should land after the behind detection fix.

**Report:** `./plan-fix-pull-push-bugs/instructions/fix-workspace-state-detection__report.md`

#### Commits:

| ID                              | Repository / Checkout / Branch      | Policy   | Hash    | Status      |
| ------------------------------- | ----------------------------------- | -------- | ------- | ----------- |
| `fix-workspace-state-detection` | Workspace CLI / `$PROJECT` / `main` | `NOPUSH` | 23c5ed2 | `COMMITTED` |

##### Commit: `fix-workspace-state-detection`

**Repository:** Workspace CLI

**Message:**

```
fix(workspace-cli): fix workspace state detection and presentation.

- Filter inapplicable issues (e.g. "unknown project") in workspace scan.
- Convert workspace output from table to field list (remote, path, branch, issues).
- Add/update tests for workspace state detection.
```

### Iteration: Sync Workspace Too

**Id:** `sync-workspace-too`

**Status:** `DONE`

**Purpose:** Make pull, push, sync, and sanity --auto all apply their pull/push logic to the workspace root consistently.

**Description:** Currently only `sanity --auto` handles the workspace root (via `pullWorkspaceCheckout`). The `pull`, `push`, and `sync` commands only operate on store checkouts. All four commands should apply their pull/push logic to the workspace root as well.

**Instructions:** `./plan-fix-pull-push-bugs/instructions/sync-workspace-too.md`

**Changes:**

- Extend `runPull`, `runPush`, `runSync` to scan and operate on the workspace root (like `runSanity` does).
- Reuse or extract the workspace root scan/operation logic from `runSanity` into a shared helper.
- Add/update tests covering workspace root pull/push/sync for all commands.

**Dependencies:**

- `fix-workspace-state-detection` — workspace state detection should be fixed first.

**Report:** `./plan-fix-pull-push-bugs/instructions/sync-workspace-too__report.md`

#### Commits:

| ID                   | Repository / Checkout / Branch      | Policy   | Hash    | Status      |
| -------------------- | ----------------------------------- | -------- | ------- | ----------- |
| `sync-workspace-too` | Workspace CLI / `$PROJECT` / `main` | `NOPUSH` | 090a69b | `COMMITTED` |

##### Commit: `sync-workspace-too`

**Repository:** Workspace CLI

**Message:**

```
build(workspace-cli): apply pull/push/sync logic to the workspace root.

- Extend `runPull`, `runPush`, `runSync` to operate on the workspace root.
- Extract shared workspace root scan/operation logic from `runSanity`.
- Add/update tests covering workspace root pull/push/sync for all commands.
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- Workspace root sync: extracted shared `scanWorkspaceCheckout`/`pushWorkspaceCheckout` helpers; extended `pull`, `push`, `sync` to operate on the workspace root. (Commit `090a69b`)

- Behind detection root cause: `getBehindCount` computed against stale local tracking ref; fix fetches before counting. (Commit `06b98b9`)
- Workspace state detection: filtered inapplicable issues ("unknown project", "no remote", "wrong remote") and converted workspace output to field list (remote, path, branch, issues). (Commit `23c5ed2`)

### Findings

- The parking lot items "Fix behind count not showing" and "Fix workspace report shows 'unknown project'" are captured by this plan.
- The pull/push/sync commands and sanity --auto share the same scan flow via `scanAllCheckoutsStates` and `scanCheckoutState`. Fixing the scan fixes all commands.
- Behind detection fix: `getBehindCount` now runs `git fetch origin <branch>` before computing the count; falls back to local ref on fetch failure.

### Decisions

- None.

### Knowledge to Update

- None.

### Follow Ups

- `getBehindCount` now fetches per branch on every scan, slowing `sanity`/`pull`/`sync`. Consider fetching once per remote, or making the fetch opt-in / cached with a TTL.
- Make `sanity`/`pull`/`push`/`sync` process checkouts in parallel to reduce wall-clock time.

### Feedback

- None.
