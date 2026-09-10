# Plan: Improvements and Fixes

**ID:** `plan-improvements-and-fixes`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Improve user experience by making command output clearer and more useful.

**Description:** New --quiet option, improvements to run headers and operation reports, and fixes to checkout scanning, Git state detection, version reporting, and operation logging.

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

Make the Art Work Cli executable and operational when installed globally, while preserving local development and monorepo usage. Update the CLI implementation and package metadata as required, and verify both invocation modes.

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

Fixes

Restrict Pull/Push/Sync to scan only matched checkouts.
Fix Pull/Push/Sync reports showing a stale state after a successful push.
Add a hasGitDir check to ScanCheckoutState; when .git is not present, bypass Git checks that can inherit state from the parent directory. Add createGitDirState(hasGit) before anything else.
Replace the hardcoded CLI version with the package version.
Fix operations log showing the repo name instead of checkout. Ensure operations add a checkout where possible; handle clone operation failures where the checkout name is not yet determined rather than logging only the repository name or unknown and bailing out.
Verify whether the remaining bugs in the BUGS table are still valid, including clone edge cases and extraneous items.

Feedback

Present a header on every run containing the version and record location.
Change reports to show separate repo and checkout columns.
Rename the existing checkouts location column to checkout.

Options

Add --mode quiet|verbose to every command.
Add mode: 'quiet' to config defaults.
In quiet mode, do not show pending operations.
Make verbose override the quiet configuration.
Extract a shared function that decorates each command with the --mode argument; do the same for the existing -c, --checkouts argument.

## Work

### Next

- Plan iterations.

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

| Iteration / Instructions    | Status     |
| --------------------------- | ---------- |
| Iteration: Bug Fixes        | `PLANNING` |
| Iteration: Improve Feedback | `PLANNING` |
| Iteration: Add Quiet Option | `PLANNING` |

### Iteration: Bug Fixes

**Id:** `bug-fixes`

**Status:** `PLANNING`

**Purpose:** Fix existing bugs that affect checkout operations and state detection.

**Description:** Fix Pull/Push/Sync scanning, stale operation state, Git state detection without .git, hardcoded version reporting, operation logging, and remaining valid bugs from the BUGS table.

**Instructions:** ./plan-improvements-and-fixes/instructions/bug-fixes.md

**Changes:**

**Dependencies:**

- None.

#### Commits:

| ID        | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| --------- | ----------------------------------- | ------------ | ---- | ------------- |
| `fix-...` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `fix-...`

**Message:**

```text
fix(art-work-cli): ....
```

### Iteration: Improve Feedback

**Id:** `improve-feedback`

**Status:** `PLANNING`

**Purpose:** Make command feedback clearer and more useful.

**Description:** Present a header on every run with version and record location, and improve operation reports to distinguish repo and checkout. Add a path column to checkouts after location, and make location column rows present the location name (no path).

**Instructions:** `./plan-improvements-and-fixes/instructions/improve-feedback.md`

**Changes:**

#### Commits:

| ID        | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| --------- | ----------------------------------- | ------------ | ---- | ------------- |
| `add-...` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `add-...`

**Message:**

```text
build(art-work-cli): Add ...
```

### Iteration: Add Quiet Option

**Id:** `add-quiet-option`

**Status:** `PLANNING`

**Purpose:** Give users control over the amount of command output.

**Description:** Add a `--quiet` option to commands, make quiet mode the configurable default, hide pending operations in quiet mode, and allow verbose output to override the quiet configuration.

**Instructions:** `./plan-improvements-and-fixes/instructions/add-quiet-option.md`

#### Commits:

| ID                                 | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ---------------------------------- | ----------------------------------- | ------------ | ---- | ------------- |
| `fix-checkout-matching`            | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `match-workspace-in-checkouts-arg` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `fix-checkout-stale-reports`       | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `fix-inherited-checkout-state`     | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `report-version`                   | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `log-checkout-name`                | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `fix-checkout-matching`

**Changes:**

- Restrict Pull/Push/Sync scanning to only the matched checkouts.

**Message:**

```text
fix(art-work-cli): Scan the matched checkouts only; Update scans.
```

##### Commit: `match-workspace-in-checkouts-arg`

**Changes:**

- Currently, `-c` checks only against checkout names and locations. Add `-w, --workspace` option to also apply command on workspace.

**Message:**

```text
build(art-work-cli): Add option to match workspace along with checkouts.
```

##### Commit: `fix-checkout-stale-reports`

**Changes:**

- Fix Pull, Push, Sync, and Sanity (auto) stale reports after a successful push.

**Message:**

```text
fix(art-work-cli): Update checkout scans after running pull, push, sync, and sanity commands.
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
fix(art-work-cli): report package version
```

##### Commit: `report-version`

**Changes:**

- Replace the hardcoded CLI version with the package version.

**Message:**

```text
build(art-work-cli): Report CLI version on every run.
```

##### Commit: `log-checkout-name`

**Changes:**

- Fix operations log entries that show the repo name instead of the checkout.
  - Ensure operations add a checkout where it can be determined.
  - Handle clone operation failures where the checkout name has not yet been determined, rather than logging only the repository name or `unknown` and bailing out.

**Message:**

```text
build(art-work-cli): Log checkout name in all operations.
```

---

## Coordination

### Not In Scope

- None

### Evidence

- None

### Findings

- None

### Decisions

- None

### Knowledge to Update

- Incliuded as an iteration.

### Follow Ups

- None identified.

### Feedback

- None.
