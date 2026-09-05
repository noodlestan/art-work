# Plan: Implement Packages Run Command

**ID:** `implement-packages-run`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement `art-workspace packages run <command> [<checkouts...>] [<packages...>]` — run arbitrary commands across packages in selected checkouts.

**Description:** TBD — name, params, and exact behaviour to be decided. The command should accept a shell command and optional filters for checkouts and packages, then execute the command in each matching package directory.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Implement a `packages run` command that runs an arbitrary shell command across packages, with optional checkout and package filters. Exact name, params, and behaviour TBD.

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
::READ `architecture/commands.md` (Design) — TBD — command surface to be designed.
::READ `architecture/_pseudo.md` (Pseudo-code) — TBD — pseudo-code contract to be drafted.
::READ `architecture/context-model.md` (Model) — WorkspaceContext, CheckoutStore, project records. Relevant for Planning Work Item.
::READ `architecture/reports.md` (Reports) — Operations Report format. Relevant for Planning Work Item.

## Scope

Implement `packages run` command in `$PROJECT/src/commands/` with checkout location filtering, package matching, command execution, operation logging, and commander wiring. Exact scope TBD.

## Work

### Next

Refine the first `DRAFT` iteration: `implement-packages-command`.

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

| Iteration / Instructions                 | Status  |
| ---------------------------------------- | ------- |
| Iteration: Implement Run Package Command | `DRAFT` |

### Iteration: Implement Run Package Command

**Id:** `implement-packages-command`

**Status:** `DRAFT`

**Purpose:** Implement `art-workspace packages run <command> [<checkouts...>] [<packages...>]` end-to-end.

**Description:** TBD — command name, parameters, and exact behaviour to be decided. The command will need to resolve checkouts, resolve packages within them, and execute the given command in each matching package directory.

**Instructions:** TBD

**Changes:**

- Wire checkout locations argument to the new command in `src/index.ts`.
- Resolve packages per checkout with location filtering.
- Implement command execution step (TBD — spawn, cwd, output capture).
- Add operation factories and reporting.
- Write tests.

**Dependencies:**

- `plan-scope-commands-to-checkouts` — checkout location filtering pattern.
- `plan-implement-checkouts-run` — checkout-level command execution (may share infrastructure).

#### Commits:

| ID                                             | Repository / Checkout / Branch  | Policy       | Status    |
| ---------------------------------------------- | ------------------------------- | ------------ | --------- |
| `wire-checkout-locations-to-run-command`       | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `PENDING` |
| `resolve-packages-per-checkout`                | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `PENDING` |
| `implement-packages-command`                   | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `PENDING` |
| `add-package-command-operations-and-reporting` | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `PENDING` |
| `test-package-command`                         | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `PENDING` |

##### Commit: `wire-checkout-locations-to-run-command`

**Message:**

```
build(packages-run): wire checkout locations argument to packages run command

- TBD — exact command name and signature to be decided
- Accept optional checkout locations and package filters
- Location values are checkout locations relative to config.checkouts.path
```

##### Commit: `resolve-packages-per-checkout`

**Message:**

```
build(packages-run): resolve packages per checkout with location filtering

- TBD — package matching strategy to be decided
- Filter checkouts by location when provided
- Load project graph per checkout and collect packages
- Apply package filter if provided
```

##### Commit: `implement-packages-command`

**Message:**

```
build(packages-run): implement command execution step

- TBD — spawn strategy, cwd, output capture, error handling
- Execute command in each matching package directory
- Skip packages that fail to resolve
```

##### Commit: `add-package-command-operations-and-reporting`

**Message:**

```
build(packages-run): add operation factories and reporting

- TBD — operation types and report format
- Log command execution outcomes per package
- Present Checkout Report and Operations Report
```

##### Commit: `test-package-command`

**Message:**

```
test(packages-run): add package command tests

- TBD — test scenarios to be defined
- No it.todo() remaining
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- TBD.

### Decisions

- TBD.

### Knowledge to Update

- `architecture/commands.md` — document the new `packages run` command.

### Follow Ups

- None.

### Feedback

- None.
