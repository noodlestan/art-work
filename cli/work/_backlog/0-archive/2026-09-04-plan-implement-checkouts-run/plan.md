# Plan: Implement Checkouts Run Command

**ID:** `implement-checkouts-run`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement `art-workspace checkout run <command...> [-c, --checkouts <PATTERN...>] [-A, --all]` — run arbitrary commands across selected checkouts.

**Description:** Add a `checkout` command group with a single `run` subcommand. `run` accepts a variadic `<command...>` positional and requires either `-c, --checkouts <PATTERN...>` or `-A, --all` (per the shared Command Arguments convention). Resolves matching checkouts via `getCheckoutsByPattern`, executes the command in each matching checkout directory, logs operations, and presents reports.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Implement `checkout run <command...> [-c <PATTERN...>] [-A, --all]` — execute an arbitrary shell command in each checkout matching the `--checkouts` patterns, or in all checkouts with `--all`. Either `-c` or `--all` must be provided; if neither, a usage message is printed and the command exits without running. Reuses `getCheckoutsByPattern` from the store and follows the standardised command declaration conventions.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                            |
| --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `_roadmap/_architect.md`                                           | Workspace principles, NFRs, milestones.                         |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-workspace-cli-one/milestone.md` | Coordinates this plan within the Workspace CLI One milestone.   |
| Plan                  | `$PROJECT/_backlog/3-now/plan-scope-commands-to-checkouts/plan.md` | Delivered scope decisions this plan builds on.                  |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/commands.md` (Design) — Command surface; add `checkout run` under the shared `### Command Arguments` section. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Add `checkout run` pseudo-code. Relevant for Planning Work Item.
::READ `architecture/context-model.md` (Model) — WorkspaceContext, CheckoutStore, `getCheckoutsByPattern`. Relevant for Planning Work Item.
::READ `architecture/reports.md` (Reports) — Operations Report format. Relevant for Planning Work Item.

## Scope

Implement `checkout run` in `$PROJECT/src/commands/` — create the `checkout` command group with a single `run` subcommand; wire in `src/index.ts`; resolve checkouts via `getCheckoutsByPattern` (or all with `--all`); execute the command per checkout with operation logging; present reports; update knowledge.

## Work

### Next

Delegate the `READY` iterations: `implement-checkout-run-command`, `update-commands-knowledge`.

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

| Iteration / Instructions                  | Status |
| ----------------------------------------- | ------ |
| Iteration: Implement Checkout Run Command | `DONE` |
| Iteration: Update Commands Knowledge      | `DONE` |

### Iteration: Implement Checkout Run Command

**Id:** `implement-checkout-run-command`

**Status:** `DONE`

**Purpose:** Implement `art-workspace checkout run <command...> [-c <PATTERN...>] [-A, --all]` end-to-end, following the `runPull` pattern.

**Description:** Create the `checkout` command group with a single `run` subcommand. `run` accepts a variadic `<command...>` positional and requires `-c, --checkouts <PATTERN...>` or `-A, --all` (usage message when neither). Resolve checkouts via `ctx.store.getCheckoutsByPattern(checkouts)` or `getAllCheckouts()`. Execute the command in each matching checkout directory via spawn with `cwd` = checkout path. Log pending → success/failure operations per checkout. Present Checkout Report + Operations Report.

**Instructions:** `./plan-implement-checkouts-run/instructions/implement-checkout-run-command.md`

**Report:** `./plan-implement-checkouts-run/instructions/implement-checkout-run-command__report.md`

**Changes:**

- Create the `checkout` command group in `src/index.ts` with a single `run` subcommand: `.argument('<command...>', 'command to run')`, `.option('-c, --checkouts <PATTERN...>', 'checkout location patterns')`, `.option('-A, --all', 'Apply to all checkouts')`.
- Add `src/commands/checkout/runCheckoutRun.ts` implementing the handler following the `runPull` pattern: load records + hydrate store → log command pending → `scanAllCheckoutsStates` → usage guard (require `-c` or `--all`, print usage message when neither) → resolve checkouts (`--all` → `getAllCheckouts()`, else `getCheckoutsByPattern`) → `runWithConcurrency(4)` per-checkout execution → present Checkout Report + Operations Report.
- Add operation types `CheckoutRunPending`/`CheckoutRunSuccess`/`CheckoutRunFailure` (`operation: 'run'`, `command` field) to `src/private/operations/types.ts` and factories `createCheckoutRunPending`/`createCheckoutRunSuccess`/`createCheckoutRunFailure` in `src/private/commands/operations/`.
- Add `src/private/commands/checkouts/doCheckoutRun.ts` per-checkout helper (pending → spawn → success/failure), mirroring `doPullCheckout`.
- Add `src/private/exec/runCommandInDirectory.ts` — spawn helper with `cwd` = checkout path, capture output and exit code, reject on non-zero exit. Reusable by the future `package run` command.
- Skip uncloned checkouts (`scan.exists === false`) with a failure operation, consistent with `branch`.
- Add tests: pattern filtering, `--all`, usage guard (neither `-c` nor `--all`), execution success/failure, no-match warning, uncloned checkout, inner-flag `--` convention.

**Dependencies:**

- `plan-scope-commands-to-checkouts` — provides `getCheckoutsByPattern` and the `--checkouts`/`--all` conventions.

#### Commits:

| ID                                          | Repository / Checkout / Branch      | Policy       | Hash      | Status      |
| ------------------------------------------- | ----------------------------------- | ------------ | --------- | ----------- |
| `wire-checkout-run-command`                 | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `4542672` | `COMMITTED` |
| `add-checkout-run-operations-and-reporting` | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `20574b7` | `COMMITTED` |
| `implement-checkout-run-execution`          | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `c91fc08` | `COMMITTED` |
| `test-checkout-run-command`                 | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `b443cc5` | `COMMITTED` |

##### Commit: `wire-checkout-run-command`

**Hash:** `4542672`

**Message:**

```
build(checkouts-run): Wire checkout run command group and subcommand.

- Create `checkout` group with `run` subcommand in `src/index.ts`.
- Add `.argument('<command...>')`, `.option('-c, --checkouts <PATTERN...>')`, `.option('-A, --all')`.
- Create `runCheckoutRun` handler skeleton: hydrate store, usage guard (require -c or --all), resolve checkouts, present Checkout Report.
```

##### Commit: `add-checkout-run-operations-and-reporting`

**Hash:** `20574b7`

**Message:**

```
build(checkouts-run): Add checkout run operations and reporting.

- Add CheckoutRunPending/Success/Failure operation types and factories.
- Wire per-checkout pending -> success/failure logging and Operations Report presentation into the handler.
```

##### Commit: `implement-checkout-run-execution`

**Hash:** `c91fc08`

**Message:**

```
build(checkouts-run): Implement checkout run execution step.

- Add runCommandInDirectory exec helper (spawn with cwd = checkout path).
- Execute the command per checkout via doCheckoutRun, using the operation factories.
- Skip uncloned checkouts with a failure operation.
```

##### Commit: `test-checkout-run-command`

**Hash:** `b443cc5`

**Message:**

```
test(checkouts-run): add checkout run command tests.

- Test pattern filtering via getCheckoutsByPattern.
- Test --all and the usage guard (neither -c nor --all).
- Test execution success and failure per checkout.
- Test no-match warning, uncloned checkout, and inner-flag `--` convention.
```

### Iteration: Update Commands Knowledge

**Id:** `update-commands-knowledge`

**Status:** `DONE`

**Purpose:** Capture the `checkout run` command in the architecture knowledge so the command surface and pseudo-code stay current.

**Description:** Add `checkout run` to the command surface in `architecture/commands.md` and add its pseudo-code to `architecture/_pseudo.md`, following the same pattern as the scope plan's `update-commands-knowledge` iteration.

**Instructions:** `./plan-implement-checkouts-run/instructions/update-commands-knowledge.md`

**Report:** `./plan-implement-checkouts-run/instructions/update-commands-knowledge__report.md`

**Changes:**

- Add `checkout run <command...> [-c <PATTERN...>] [-A, --all]` to the command surface table in `architecture/commands.md`.
- Add a `## Checkout Run` section documenting: usage, `--checkouts`/`--all` requirement (reference the shared `### Command Arguments` section), the `--` convention for inner flags (e.g. `checkout run npm run ci -- --filter x`), and BDD scenarios (pattern filtering, `--all`, usage guard, execution success/failure, uncloned checkout).
- Add `checkout run` pseudo-code to `architecture/_pseudo.md` following the `pull`/`push`/`sync` pseudo pattern (hydrate → usage guard → resolve → per-checkout loop → present reports).
- Add `runCommandInDirectory` and `doCheckoutRun` to the auxiliary functions section of `architecture/_pseudo.md`.

**Dependencies:**

- `implement-checkout-run-command` — the implementation must be complete before documenting it.

#### Commits:

| ID                              | Repository / Checkout / Branch      | Policy       | Hash      | Status      |
| ------------------------------- | ----------------------------------- | ------------ | --------- | ----------- |
| `document-checkout-run-command` | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `ce2eba4` | `COMMITTED` |

##### Commit: `document-checkout-run-command`

**Hash:** `ce2eba4`

**Message:**

```
knowledge(architecture): Document checkout run command.

- Add checkout run to the command surface in commands.md.
- Document usage, --checkouts/--all behaviour, and the `--` convention for inner flags.
- Add checkout run pseudo-code and exec helpers to _pseudo.md.
```

---

## Coordination

### Not In Scope

- Repo/package group restructuring, `checkout clone`/`checkout remove`, `package run`, moving flat `clone`/`publish`/`link` — parked in `$PROJECT/_backlog/6-plan/_parking-lot.md`.

### Evidence

- Commander 12.1.0 nested-command and option-parsing behavior verified empirically in a scratch project.
- `checkout run` implemented end-to-end and verified via CLI: usage guard (neither `-c` nor `--all`), `--all`, pattern filtering, execution success/failure, uncloned checkout, and inner-flag `--` convention. 269 tests pass; monorepo `npm run ci` green.
- `checkout run` documented in `architecture/commands.md` (Command Surface + `## Checkout Run` section) and `architecture/_pseudo.md` (entry-point route, `run` operation kinds/factories, use-case pseudo, `runCommandInDirectory`/`doCheckoutRun` aux functions).

### Findings

- `runPull` is the reference implementation for this command: hydrate → log command pending → `scanAllCheckoutsStates` → usage guard → resolve (`--all` vs `getCheckoutsByPattern`) → `runWithConcurrency(4)` → per-checkout `doPullCheckout` (pending → success/failure) → present Checkout Report + Operations Report.
- The scope plan's decision (captured in `architecture/commands.md`): either `--checkouts` or `--all` must be provided; if neither, a usage message is printed and the command exits without performing any operation. The earlier draft's "all checkouts when omitted" contradicts this and is corrected here.
- Commander supports nested commands both chained (`.command('checkout').command('run')`) and single-string (`.command('checkout run')`); flat and nested commands coexist.
- A group command alone (`checkout`) prints the group help and exits 1.
- Default parsing is sufficient for `checkout run <command...> [-c, --checkouts <PATTERN...>]`: option after positionals parses; inner flags need `--` (e.g. `checkout run npm run ci -- --filter x`); a quoted command string works; option-before-positionals fails with "missing required argument".
- `passThroughOptions()`/`enablePositionalOptions()` interact subtly with nested parents (the parent greedily consumes positionals before the child parser runs) — avoid unless needed.
- The scope plan's decision to use the named `--checkouts` option (not a positional) directly shapes this command's signature.
- The spawn step (command with `cwd` = checkout path) is reusable by the future `package run` command — extract it to `src/private/exec/runCommandInDirectory.ts`.

### Decisions

- Command is `checkout run` (nested under a new `checkout` group).
- Signature: `checkout run <command...> [-c <PATTERN...>] [-A, --all]` — the command string is the only positional; checkout filtering via `--checkouts` or `--all` (per the shared Command Arguments convention: either must be provided, usage message when neither).
- This plan creates only the `run` subcommand; the `checkout` group scaffolding is minimal (parent + run). Future subcommands (`clone`, `remove`) are separate plans.
- Reuse `ctx.store.getCheckoutsByPattern(checkouts)`; `--all` → `getAllCheckouts()`.
- Commit order: `add-checkout-run-operations-and-reporting` BEFORE `implement-checkout-run-execution` so the execution step uses the operation factories immediately — each commit compiles and is self-contained.
- Execution via spawn with `cwd` = checkout path; per-checkout pending → success/failure operations; skip uncloned checkouts with a failure operation (consistent with `branch`).
- Extract the spawn helper to `src/private/exec/runCommandInDirectory.ts` for reuse by `package run`.
- Default commander parsing; document the `--` convention for inner flags.

### Knowledge to Update

- `architecture/commands.md` — add `checkout run` to the command surface; document under the shared `### Command Arguments` section.
- `architecture/_pseudo.md` — add `checkout run` pseudo-code and the `runCommandInDirectory`/`doCheckoutRun` helpers.

### Follow Ups

- `plan-implement-packages-run` — implement `package run` sharing the exec infra (`src/private/exec/runCommandInDirectory.ts`).
- Repo/package group restructuring parked in `$PROJECT/_backlog/6-plan/_parking-lot.md`.

### Feedback

- Instruction's mandatory-reading path points to `$PROJECT/_backlog/4-next/plan-implement-checkouts-run/plan.md`, but the plan lives in `3-now` — stale path; update to `3-now`.
- Handler signature `options: { command: string[]; ... } = {}` fails `tsc --noEmit` (`Property 'command' is missing in type '{}'`); worker removed the impossible `= {}` default (the caller always passes `command`).
