# Plan: Art Work Cli — Unlink Command

**ID:** `implement-unlink`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement `art-workspace unlink <location> <package> [<target>]` for `@art-work/cli`.

**Description:** Remove a package symlink created by `link` and restore the published version with `npm install`, replacing the stub at `src/commands/unlink/runUnlink.ts`. Params mirror `link`; default target is the workspace root `node_modules/`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Implement the unlink command to remove package symlinks and restore published versions via npm install.

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
::READ `architecture/commands.md` (Design) — Designed behaviour and BDD scenarios for Unlink. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — Pseudo-code contract for unlink command. Relevant for Planning Work Item.
::READ `architecture/context-model.md` (Model) — WorkspaceContext, CheckoutStore, project records. Relevant for Planning Work Item.
::READ `architecture/reports.md` (Reports) — Operations Report format. Relevant for Planning Work Item.

## Scope

Implement unlink command in `$PROJECT/src/commands/unlink/` with tests, symlink removal, npm install restore, operation factories, and commander wiring.

## Work

### Next

Delegate the first `DRAFT` iteration: `implement-unlink-command`.

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

| Iteration / Instructions            | Status  |
| ----------------------------------- | ------- |
| Iteration: Implement Unlink Command | `DRAFT` |

### Iteration: Implement Unlink Command

**Id:** `implement-unlink-command`

**Status:** `DRAFT`

**Purpose:** Implement `art-workspace unlink <location> <package> [<target>]` end-to-end, tests first.

**Description:** Implement the full unlink command with source checkout resolution, package resolution, symlink removal, npm install restore, operation logging, and commander wiring. Reuses resolution helpers from the link command.

**Instructions:** `./plan-implement-unlink/instructions/implement-unlink-command.md`

**Changes:**

- Resolve source checkout by `<location>`; resolve package via existing `readProjectRecords` + `findPackage` (reuse the `link` command resolution).
- Resolve `linkTarget` per pseudo; only remove when the entry is a symlink (npm-installed or absent → skip, no operation).
- Run `npm install` in the target dir after removing the symlink.
- Add `createUnlinkSuccess` / `createUnlinkFailure` operation factories in `src/private/operations/`; log outcomes; present Operations Report.
- Wire `<location> <package> [<target>]` args in `src/index.ts`.
- Write tests first — no `it.todo()` left at the end.

**Dependencies:**

- `plan-implement-link` — depends on the same package/target resolution helpers; avoid duplicating resolution logic across slices.

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

- Depends on the same package/target resolution helpers as `link` — avoid duplicating resolution logic across slices.

### Feedback

- None.
