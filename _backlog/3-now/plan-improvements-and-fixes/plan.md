# Plan: Improvements and Fixes

**ID:** `plan-improvements-and-fixes`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Improve user experience by making command output clearer and more useful.

**Description:** New --output option, improvements to run headers and operation reports, and fixes to checkout scanning, Git state detection, version reporting, and operation logging.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`  | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-building` |

## Summary

Improve user experience by making command output clearer and more useful: new --output option, improvements to run headers and operation reports, and fixes to checkout scanning, Git state detection, version reporting, and operation logging.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                                |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers.     |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                 | Art Work principles, NFRs, milestones.                              |
| Milestone             | `$ART_WORK/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Coordinates this plan as Phase 3 of the Art Work Cli One milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK/_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.

::READ `$ART_WORK/cli/work/architecture/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Improve user experience by making command output clearer and more useful: new --output option, improvements to run headers and operation reports, and fixes to checkout scanning, Git state detection, version reporting, and operation logging.

## Work

### Next

- Delegate the next commit blueprint.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_WORK` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

Additionally verify the CLI from a global installation and from the local development environment. All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions         | Status  |
| -------------------------------- | ------- |
| Iteration: Bug Fixes             | `DONE`  |
| Iteration: Improve Test Coverage | `DONE`  |
| Iteration: Refactor Helpers      | `DONE`  |
| Iteration: Improve Feedback      | `READY` |
| Iteration: Add Output Option     | `READY` |

### Iteration: Bug Fixes

**Id:** `bug-fixes`

**Status:** `DONE`

**Purpose:** Fix existing bugs that affect checkout operations and state detection.

**Description:** Fix Pull/Push/Sync matching and scanning, stale operation state, Git state detection without .git, operation logging, and remaining valid bugs from the BUGS table.

**Changes:**

- Fix Pull/Push/Sync to only scan the matched checkouts and to always execute pull/push on the workspace regardless of ahead/behind count.
- Fix `sanity --auto` to sync (pull and push) instead of only pushing.
- Add `-w, --workspace` option to apply commands on the workspace along with checkouts.
- Fix stale reports after a successful push for Pull, Push, Sync, and Sanity (auto).
- Update `ScanCheckoutState` to detect `hasGitDir`, report a `no git` state, and bypass Git checks when `.git` is absent.

**Dependencies:**

- None.

#### Commits:

| ID                              | Repository / Checkout / Branch      | Policy       | Hash       | Status     |
| ------------------------------- | ----------------------------------- | ------------ | ---------- | ---------- |
| `fix-checkout-matching`         | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `6d2cfacd` | `COMMITED` |
| `match-workspace-checkouts-arg` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `39d7766e` | `COMMITED` |
| `fix-inherited-checkout-state`  | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `fa61ceea` | `AUTHORED` |

##### Commit: `fix-checkout-matching`

**Changes:**

- Fix Pull/Push/Sync ALWAYS execute pull/push on workspace regardles of ahead/behind count. (Note `sanity --auto` doesn't.)
- Restrict Pull/Push/Sync scanning to only the matched checkouts.
- Fix `sanity --auto` only pushes, should pull as well, i.e., should do `sync` instead of just `push`.

**Message:**

```text
fix(art-work-cli): Scan the matched checkouts only; Update scans.
```

##### Commit: `match-workspace-checkouts-arg`

**Changes:**

- Currently, `-c` checks only against checkout names and locations. Add `-w, --workspace` option to also apply command on workspace.

**Message:**

```text
build(art-work-cli): Add option to match workspace along with checkouts.
```

##### Commit: `fix-inherited-checkout-state`

**Bug:**

- Scenario: `checkouts/.vscode` exists but is not a checkout: it does not contain a `.git` directory.
- What happens: Scan reports git status of a parent directory. Example: workspace root.
- Expected: Reported as extraneous with a "no git" state.

**Fix:**

- Update `ScanCheckoutState`:
  - Add `hasGitDir` detection, reports `no git` state.
  - Add `createGitDirState(hasGit)` before other state checks.
  - Bypass Git checks when `.git` is not present, preventing state inherited from a parent directory.

**Message:**

```text
fix(art-work--cli): Skip git checks when no .git is present.
```

### Iteration: Improve Test Coverage

**Id:** `improve-test-coverage`

**Status:** `DONE`

**Purpose:** Improve test coverage for checkout scanning, state detection, and operations.

**Description:** Add tests for scanWorkspaceCheckout, scan states, scan utilities, and operations. Use makeCheckoutMock in command tests and new git test helpers across remaining test suites.

**Changes:**

- Use `makeCheckoutMock` in command tests.
- Use new git test helpers across remaining test suites.
- Add tests for scan states, scan utilities, and operations.
- Add tests for `scanWorkspaceCheckout`.

**Dependencies:**

- None.

#### Commits:

| ID                                     | Repository / Checkout / Branch      | Policy       | Hash      | Status     |
| -------------------------------------- | ----------------------------------- | ------------ | --------- | ---------- |
| `use-checkout-mock-commands`           | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `1f93cba` | `COMMITED` |
| `use-git-helpers-remaining-suites`     | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `9cd6160` | `COMMITED` |
| `add-scan-states-utilities-operations` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `7d73f1f` | `COMMITED` |
| `add-scan-workspace-checkout`          | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `f8df230` | `COMMITED` |

##### Commit: `use-checkout-mock-commands`

**Changes:**

- Use `makeCheckoutMock` in command tests.

**Message:**

```text
test(art-work-cli): Use makeCheckoutMock in command tests.
```

##### Commit: `use-git-helpers-remaining-suites`

**Changes:**

- Use new git test helpers across remaining test suites.

**Message:**

```text
test(art-work-cli): Use new git test helpers across remaining test suites.
```

##### Commit: `add-scan-states-utilities-operations`

**Changes:**

- Add tests for scan states, scan utilities, and operations.

**Message:**

```text
test(art-work-cli): Add tests for scan states, scan utilities, and operations.
```

##### Commit: `add-scan-workspace-checkout`

**Changes:**

- Add tests for `scanWorkspaceCheckout`.

**Message:**

```text
test(art-work-cli): Add tests for scanWorkspaceCheckout.
```

### Iteration: Refactor Helpers

**Id:** `refactor-helpers`

**Status:** `DONE`

**Purpose:** Refactor test helpers and remove factory re-exports.

**Description:** Consolidate git test helpers, use primitive args in git helpers, and remove factory re-exports from scan/types.ts.

**Changes:**

- Consolidate git test helpers.
- Use primitive args in git helpers and add missing tests.
- Remove factory re-exports from scan/types.ts.

**Dependencies:**

- None.

#### Commits:

| ID                             | Repository / Checkout / Branch      | Policy       | Hash      | Status     |
| ------------------------------ | ----------------------------------- | ------------ | --------- | ---------- |
| `consolidate-git-test-helpers` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `d48a29a` | `COMMITED` |
| `primitive-args-git-helpers`   | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `38ee2ce` | `COMMITED` |
| `remove-factory-reexports`     | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | `c9fa170` | `COMMITED` |

##### Commit: `consolidate-git-test-helpers`

**Changes:**

- Consolidate git test helpers.

**Message:**

```text
refactor(cli/work): Consolidate git test helpers.
```

##### Commit: `primitive-args-git-helpers`

**Changes:**

- Use primitive args in git helpers and add missing tests.

**Message:**

```text
refactor(art-work-cli): Use primitive args in git helpers and add missing tests.
```

##### Commit: `remove-factory-reexports`

**Changes:**

- Remove factory re-exports from scan/types.ts.

**Message:**

```text
refactor(art-work-cli): Remove factory re-exports from scan/types.ts.
```

### Iteration: Improve Feedback

**Id:** `improve-feedback`

**Status:** `READY`

**Purpose:** Make command feedback clearer and more useful.

**Description:** Replace the hardcoded CLI version with the package version.Improve operation reports to handle workspace, repo, and checkout properly.

**Changes:**

1. Replace the hardcoded CLI version with the package version.

2. Operation reports

Examples of reports

```
Operations Report:
    repo  checkout  operation  message      ms
🟢  Ops   ops       branch     created foo  87
```

```
Operations Report:
    repo  checkout  operation  message  ms
🟢  Ops   ops       clone      to ops   0
```

```
Operations Report:
    repo      checkout           operation         message           ms
🟢  Art Lib   art-lib-building   pull              from origin/main  3390
🟢  Art Work  art-work-building  pull              from origin/main  3445
🟢  -         pull               from origin/main  1676
🟢  -         push               to origin/main    1631
```

Currently, workspace operations are off by one.

- Make workspace operations display WORKSPACE in repo column and '-' in checkout column.

#### Commits:

| ID                            | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ----------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `report-version`              | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |
| `fix-repo-op-rows-off-by-one` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `report-version`

**Changes:**

- Replace the hardcoded CLI version with the package version.

**Message:**

```text
build(art-work-cli): Report CLI version on every run.
```

##### Commit: `fix-repo-op-rows-off-by-one`

**Message:**

```text
fix(art-work-cli): Operations report missing repo/checkout labels on repo operation rows.
```

### Iteration: Add Output Option

**Id:** `add-output-option`

**Status:** `READY`

**Purpose:** Give users control over the amount of command output.

**Description:** Add `output.mode` configuration and `--output` option to all commands, makign quiet mode the configured default, hiding pending operations in quiet mode, and making the option override the configuration value.

**Changes:**

- Add `output.mode: 'quiet' | 'verbose'` to config, default `quiet`.
- Add `--output = quiet|verbose` argument to every command.
- Add a logger factory to replace the current basic lambda.

```ts
const logger = (op: Operation) => {
  console.info(makeOperationLogLine(op, { standalone: true }).join(' | '));
};
```

Replaced by (in `src/private/logger`).

```ts
const createLogger = (): LoggerAPI;
interface LoggerAPI {
  log: (op: Operation) => void;
  setOutputMode: (mode: 'quiet' | 'verbose') => void;
};
```

Quiet mode does not show pending operations.

Logger starts with internal `mode` set to undefined and buffers all ops until `setOutputMode()` is called. If the mode is `verbose` it should flush all buffered ops to console and start logging synchronously, if mode is `quiet` it should discard all buffered pending ops, and all future pending ops logged.

Add `program.option('-o, --output', 'One of ');`

Commands should call `setOutputMode(options.output | config.output.mode)` after context is created.

#### Commits:

| ID                  | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `add-output-option` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `add-output-option`

**Message:**

```text
build(art-work-cli): Add `--output` option to all arguments.
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- None.

### Knowledge to Update

- None.

### Follow Ups

- None identified.

### Feedback

- None.
