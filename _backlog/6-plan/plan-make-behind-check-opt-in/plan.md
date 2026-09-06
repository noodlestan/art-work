# Plan: Make Behind Check Opt-in

**ID:** `make-behind-check-opt-in`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Make the expensive per-checkout behind check opt-in via a `--behind` argument to `sanity`, so the default scan avoids the per-checkout network `git fetch`.

**Description:** Add a `--behind` argument to `runSanity`; thread a `checkBehind: boolean` parameter through `scanAllCheckoutsStates` and `scanCheckoutState`; only compute the behind count when `checkBehind` is true. Verify that `pull`/`push`/`sync` do not depend on the behind count having been refreshed, and pass `true` only from `runSanity` when `--behind` is present.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

The behind check (`getBehindCount`) performs a network `git fetch` per checkout, which dominates scan cost. Make it opt-in: `sanity --behind` computes behind counts; the default scan skips them. Confirm `pull`/`push`/`sync` do not rely on the behind count being refreshed.

## Context

### Upstream Work

| Kind                  | Path                                                              | Role                                                            |
| --------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `_roadmap/_architect.md`                                          | Art Work principles, NFRs, milestones.                          |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Coordinates this plan within the Art Work Cli One milestone.    |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/commands.md` (Design) — Designed behaviour and BDD scenarios for sanity, pull, push, sync. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Pseudo-code contract for the scan and git inspection. Relevant for Planning Work Item.

## Scope

Update the sanity command and the scan path in `$PROJECT/src/commands/sanity/`, `$PROJECT/src/private/store/`, and `$PROJECT/src/private/scan/` so the behind check is opt-in.

## Work

### Next

Refine the first `DRAFT` iteration: `make-behind-check-opt-in`.

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

## Items:

| Iteration / Instructions            | Status  |
| ----------------------------------- | ------- |
| Iteration: Make Behind Check Opt-in | `DRAFT` |

### Iteration: Make Behind Check Opt-in

**Id:** `make-behind-check-opt-in`

**Status:** `DRAFT`

**Purpose:** Make the behind check opt-in so the default scan avoids the per-checkout network fetch.

**Description:** Add a `--behind` argument to `runSanity`; thread a `checkBehind: boolean` parameter through `scanAllCheckoutsStates` and `scanCheckoutState`; only compute the behind count when `checkBehind` is true; verify `pull`/`push`/`sync` do not depend on the behind count being refreshed; pass `true` only from `runSanity` when `--behind` is present.

**Instructions:** `./plan-make-behind-check-opt-in/instructions/make-behind-check-opt-in.md`

**Changes:**

- Add a `--behind` argument to the `sanity` command and thread it into `runSanity` options.
- Add a `checkBehind: boolean` parameter to `scanAllCheckoutsStates` and `scanCheckoutState`; only call `getBehindCount` (and emit the `scan-checkout-state-behind` pending operation) when `checkBehind` is true.
- Verify that `pull`/`push`/`sync` do not rely on the behind count having been refreshed: `pull` should always try to pull unless something is going wrong; `push` should just try to push and report if a pull is needed; `sync` should always pull before push. Adjust the scan/`should` gating if any of them depend on a fresh behind count.
- Pass `checkBehind: true` only from `runSanity` when `--behind` is present; all other callers pass `false`.
- Add/update tests covering the default (no behind) and `--behind` scan paths.

**Dependencies:**

- None.

---

## Coordination

### Not In Scope

- None.

### Evidence

- `getBehindCount` (`src/private/git/getBehindCount.ts`) performs a network `git fetch('origin', branch)` per checkout before counting behind, which dominates scan cost.

### Findings

- `scanCheckoutState` (`src/private/scan/scanCheckoutState.ts`) calls `getBehindCount` for every remote checkout, emitting a `scan-checkout-state-behind` pending operation.
- `runPull`/`runPush`/`runSync` gate pull/push on `checkout.scan.should('pull')`/`should('push')`; whether these depend on a fresh behind count must be verified so the opt-in does not change their behaviour.

### Decisions

- None.

### Knowledge to Update

- `architecture/commands.md`, `architecture/_pseudo.md` — document the `--behind` argument and the opt-in behind check.

### Follow Ups

- None.

### Feedback

- None.
