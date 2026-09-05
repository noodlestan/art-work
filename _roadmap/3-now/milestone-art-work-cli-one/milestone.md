# Milestone: Workspace CLI One

**ID:** `workspace-cli-one`

**Status:** `WORKING`

**Template:** `$DOMAINS/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Complete the workspace CLI with remaining commands and infrastructure.

**Description:** This milestone delivers the full workspace CLI command surface and infrastructure across 3 phases: establish the CLI baseline, implement the remaining commands, and consolidate the CLI into its own repo and shared libraries.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Complete the workspace CLI across 3 phases: establish the CLI baseline, implement the remaining commands, and consolidate the CLI into its own repo and shared libraries.

## Context

### Upstream Work

| Kind        | Path                                | Role                                                            |
| ----------- | ----------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md` | Tracks short-term actionables, pending questions, and blockers. |
| Source      | `$PROJECT/_roadmap/_architect.md`   | Architect Briefing: Workspace CLI (Milestone 1)                 |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `write-milestone` — Writes milestones from roadmaps and backlogs. Required for Planning Work Item.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmaps and milestones coordination.                                              |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.

---

## Phases

| Index | Name                    | Status     |
| ----- | ----------------------- | ---------- |
| 1     | Establish CLI baseline  | `DONE`     |
| 2     | Consolidate             | `WORKING`  |
| 3     | Decompose               | `PLANNING` |
| 4     | Implement more commands | `DRAFT`    |

### Phase: 1 — Establish CLI baseline

**Goal:** Deliver the core workspace CLI command surface and infrastructure.

**Description:** Workspace split; sanity, clone, branch, and repo commands; sanity report; pull/push/sync; dynamic record discovery; fixes and test coverage.

**Status:** `DONE`

**Dependencies:**

- None.

### Phase: 2 — Consolidate

**Goal:** Consolidate the CLI into its own repo (art-work) and shared libraries (art-cli).

**Description:** Performance optimizations. UI improvements (args, predictability, and feedback)

**Status:** `WORKING`

**Dependencies:**

- None.

### Phase: 3 — Decompose

**Goal:** Decompose into packages

**Description:** Create the art-cli and art-work repositories;

**Status:** `PLANNING`

**Dependencies:**

- None.

### Phase: 3 — Implement more commands

**Goal:** Deliver the remaining command surface.

**Description:** Link, links, publish, and unlink commands; update knowledge resources.

**Status:** `DRAFT`

**Dependencies:**

- None.

---

## Items:

| Phase | Resource / Record                                                                                                            | Status     |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1     | Plan: Workspace Split `_backlog/0-archive/2026-08-10-plan-workspace-split/plan.md`                                           | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Sanity, Clone, Branch `_backlog/0-archive/2026-08-12-plan-workspace-sanity-clone-branch/plan.md`       | `ARCHIVED` |
| 1     | Plan: Refactor Conventions `_backlog/0-archive/2026-08-13-plan-refactor-conventions/plan.md`                                 | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Repo Command `_backlog/0-archive/2026-08-14-plan-implement-command-repo/plan.md`                       | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Sanity Workspace Report `_backlog/0-archive/2026-08-14-plan-implement-sanity-workspace-report/plan.md` | `ARCHIVED` |
| 1     | Plan: Fix Repo Command Issues `_backlog/0-archive/2026-08-18-plan-fix-repo-command-issues/plan.md`                           | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Pull, Push, Sync Commands `_backlog/0-archive/2026-08-18-plan-implement-pull-push-sync/plan.md`        | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Cleaner Code `_backlog/0-archive/2026-08-18-plan-cleaner-code/plan.md`                                 | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Fix Reported Bugs `_backlog/0-archive/2026-08-19-plan-fix-reported-bugs/plan.md`                       | `ARCHIVED` |
| 1     | Plan: Discover Records Dynamically `_backlog/0-archive/2026-09-02-plan-discover-records/plan.md`                             | `ARCHIVED` |
| 1     | Plan: Workspace CLI — Fixes and Test Coverage `_backlog/0-archive/2026-09-02-plan-repo-command-fixes-and-tests/plan.md`      | `ARCHIVED` |
| 1     | Plan: Fix Pull Push Bugs `_backlog/0-archive/2026-09-02-plan-fix-pull-push-bugs/plan.md`                                     | `ARCHIVED` |
| -     |                                                                                                                              |            |
| 2     | Plan: Log Process as it Happens `_backlog/0-archive/2026-09-03-plan-log-process-as-it-happens/plan.md`                       | `ARCHIVED` |
| 2     | Plan: Scoped Record Paths `_backlog/0-archive/2026-09-03-plan-scoped-record-paths/plan.md`                                   | `ARCHIVED` |
| 2     | Plan: Scope Commands to Location `_backlog/0-archive/2026-09-03-plan-scope-commands-to-checkouts/plan.md`                    | `ARCHIVED` |
| 2     | Plan: Parallel Scanning `_backlog/0-archive/2026-09-04-plan-parallel-scanning/plan.md`                                       | `ARCHIVED` |
| 2     | Plan: Workspace CLI — Checkouts Run Command `_backlog/0-archive/2026-09-04-plan-implement-checkouts-run/plan.md`             | `ARCHIVED` |
| 2     | Plan: Streamline Operation Types and Factories `_backlog/0-archive/2026-09-05-plan-streamline-ops/plan.md`                   | `ARCHIVED` |
| -     |                                                                                                                              |            |
| 3     | Plan: Create Art Cli Project and Repo `_backlog/1-done/plan-create-art-cli-project-repo/plan.md`                             | `DONE`     |
| 3     | Plan: Create Art Work Repository and Project `_backlog/1-done/plan-create-art-work-repository-project/plan.md`               | `DONE`     |
| 3     | Plan: Extract Workspace Cli to Art Work `_backlog/1-done/plan-extract-workspace-cli-art-work/plan.md`                        | `DONE`     |
| 3     | Plan: Extract Read/Write Records to Art Cli `_backlog/3-now/plan-extract-read-write-records-art-cli/plan.md`                 | `READY`    |
| 3     | Plan: Make Art Work Cli work from global install `_backlog/4-next/plan-work-cli-global-install/plan.md`                      | (create)   |
| -     |                                                                                                                              |            |
| 4     | Plan: Replace Repo Command                                                                                                   | -          |
| 4     | Plan: Replace Clone Command                                                                                                  | -          |
| 4     | Plan: Workspace CLI — Packages Run Command `_backlog/4-next/plan-implement-packages-run/plan.md`                             | `DRAFT`    |
| 4     | Plan: Make Behind Check Opt-in `_backlog/6-plan/plan-make-behind-check-opt-in/plan.md`                                       | `DRAFT`    |
| 4     | Plan: Workspace CLI — Link Command `_backlog/6-plan/plan-implement-link/plan.md`                                             | `DRAFT`    |
| 4     | Plan: Workspace CLI — Links Command `_backlog/6-plan/plan-implement-links/plan.md`                                           | `DRAFT`    |
| 4     | Plan: Workspace CLI — Unlink Command `_backlog/6-plan/plan-implement-unlink/plan.md`                                         | `DRAFT`    |
| 4     | Plan: Update Knowledge Resources `_backlog/6-plan/plan-update-knowledge-resources/plan.md`                                   | `DRAFT`    |

---

## Work

### Next

Phase 2 — delegate the `READY` plan `plan-streamline-ops` (instructions written). Then Phase 3 — delegate the `READY` plans `plan-create-art-cli-project-repo`, `plan-create-art-work-repository-project`, `plan-extract-workspace-cli-art-work`, `plan-extract-read-write-records-art-cli` (instructions written).

### Blockers

- None.

---

## Operating Instructions

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- Phase 3 splits the move plan into 4 plans: create art-cli repo, create art-work repo, extract workspace cli to art-work, extract read/write records to art-cli.
- The workspace CLI moves to `noodlestan/art-work` (canonical `@art-work/cli`); the shared records lib lives in `noodlestan/art-cli` (canonical `@art-cli/lib-records`).
- The superseded plan `plan-move-code-project-art-cli` is archived.

### Knowledge to Update

- None.

### Follow Ups

- None.

### Feedback

- None.
