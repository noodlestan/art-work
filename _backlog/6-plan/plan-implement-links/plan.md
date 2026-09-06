# Plan: Art Work Cli — Links Command

**ID:** `implement-links`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement `art-workspace links` for `@art-work/cli`.

**Description:** Scan the workspace root `node_modules` and every known repo's project `node_modules` for symlinks (including scoped `@scope/pkg` entries) and present the Symlink Report. Read-only — no operations are logged.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Implement the links command as a read-only scan of symlinks across the workspace, presenting the Symlink Report.

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
::READ `architecture/commands.md` (Design) — Designed behaviour and BDD scenarios for Links. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Pseudo-code contract for links command (incl. `scanNodeModules`). Relevant for Planning Work Item.
::READ `architecture/context-model.md` (Model) — WorkspaceContext, CheckoutStore, project records. Relevant for Planning Work Item.
::READ `architecture/reports.md` (Reports) — Symlink Report format. Relevant for Planning Work Item.

## Scope

Implement links command in `$PROJECT/src/commands/links/` with tests, symlink scanning, report presentation, and commander wiring.

## Work

### Next

Delegate the first `DRAFT` iteration: `implement-links-command`.

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

| Iteration / Instructions           | Status  |
| ---------------------------------- | ------- |
| Iteration: Implement Links Command | `DRAFT` |

### Iteration: Implement Links Command

**Id:** `implement-links-command`

**Status:** `DRAFT`

**Purpose:** Implement `art-workspace links` end-to-end, tests first.

**Description:** Create `src/commands/links/` with `runLinks(ctx)`, implement `scanNodeModules(dir, location)` per the pseudo contract, add `presentSymlinkReport(links)`, wire `links` in `src/index.ts`.

**Instructions:** `./plan-implement-links/instructions/implement-links-command.md`

**Changes:**

- Create `src/commands/links/` with `runLinks(ctx)` following the existing command skeleton.
- Implement `scanNodeModules(dir, location)` per the pseudo contract: handle scoped `@scope/pkg` entries recursively; report each symlink with its location label.
- Add `presentSymlinkReport(links)` following the report presentation patterns in `src/private/present/`.
- Wire `links` in `src/index.ts` (new commander entry, no args).
- Write tests first — no `it.todo()` left at the end.

**Dependencies:**

- None.

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

- Symlink Report presentation is a new report shape; coordinate with the `link`/`unlink` slices so the report stays consistent.

### Feedback

- None.
