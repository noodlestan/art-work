# Plan: Migrate Planning and Knowledge

**ID:** `migrate-planning-and-knowledge`

**Status:** `READY`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Move the repository-level `_roadmap/` and `_backlog/` content into `cli/work/`, re-scaffold the emptied root trees for repository-level planning, and keep the root free for non-CLI work.

**Description:** The CLI planning artefacts relocate from the monorepo root into `cli/work/`, the emptied root trees are re-scaffolded with empty stages for future repository-level (non-CLI) planning, both guides document the split, and no in-repo reference to the relocated entries remains.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable        | Resolved Path                            | Purpose                                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `$WORKSPACE`    | Current working directory                | Workspace root directory                                   |
| `$DOMAINS`      | `$WORKSPACE/.agents/domains`             | Domain resources directory                                 |
| `$ART_WORK`     | `$WORKSPACE/checkouts/art-work-building` | Art Work repository; hosts this plan.                      |
| `$ART_WORK_CLI` | `$ART_WORK/cli/work`                     | The Art Work Cli package, and now its roadmap and backlog. |

## Summary

Move the root `_roadmap/` and `_backlog/` content into `$ART_WORK_CLI/`, re-scaffold the emptied root trees for future repository-level planning, verify the repository and package guides already describe the per-CLI planning split, and leave no reference to the relocated root paths — so additional CLIs can each own their own roadmap and backlog while the root stays free for non-CLI work.

## Context

### Upstream Work

| Kind                  | Path                                                                               | Role                                                        |
| --------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                                               | Tracks the ONGOING migration item that requested this plan. |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                                 | Art Work principles, NFRs, milestones.                      |
| Milestone             | `$ART_WORK_CLI/_roadmap/3-now/milestone-rename-art-work-to-art-works/milestone.md` | Coordinates this plan as Phase 1 of the rename milestone.   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Resource Kinds in Scope

| Kind       | Domain       | Structure Record Path                             |
| ---------- | ------------ | ------------------------------------------------- |
| Repository | Repositories | `$DOMAINS/repositories/structures/repository.art` |
| Package    | Packages     | `$DOMAINS/packages/structures/package.art`        |

### Workflows

| Workflow / Path                                                                | Purpose                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Workflow: Planning Work `$DOMAINS/work/workflows/planning-work/workflow.art`   | Create and manage work item lifecycles.               |
| Workflow: Executing Work `$DOMAINS/work/workflows/executing-work/workflow.art` | Organize work execution to produce verified outcomes. |

### Workflow Operations

| Workflow / Operation / Path                                                                                         | Purpose                                               |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Planning Work / Planning Work Item `$DOMAINS/work/workflows/planning-work/planning-work-item/operation.art`         | Plan the implementation of the work item.             |
| Planning Work / Writing Commit Message `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art` | Write standardized messages according to conventions. |
| Executing Work / Setting Up `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`                       | Prepare the execution environment.                    |
| Executing Work / Verifying Completion `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`   | Confirm the work item satisfies its intended outcome. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Workspace layout, records management, setup, and verification. Relevant for Planning Work Item, Setting Up, Writing Commit Message.
::READ `$ART_WORK/_guide.md` (Guide) — Repository layout, Roadmapping, and Planning Work sections. Relevant for Planning Work Item, Verifying Completion.
::READ `$ART_WORK_CLI/_guide.md` (Guide) — Package layout and workflows. Relevant for Planning Work Item.

## Scope

Move the planning content of both trees into `$ART_WORK_CLI`, re-scaffold the emptied root trees with `.gitkeep` stages while their repository-level files (`_roadmap/_architect.md`, the root `_parking-lot.md` trackers) stay at the root, verify (without editing) `$ART_WORK/_guide.md` and `$ART_WORK_CLI/_guide.md`, which already describe the split, and correct in-repo references to the relocated entries. No plan or milestone content is edited, archived, or retired — only relocated. Cross-repository references held by other checkouts are out of scope and tracked as a follow-up.

### (Scope) Repository: Art Work

**Record:** `$ART_WORK/_records/repository.art`

**Role:** — Owns the root `_roadmap/` and `_backlog/` trees being relocated, and the guides that document the split.

**Partial:**

- `owner` — Project: Art Work
- `remote` — `git@github.com:noodlestan/art-work.git`

**Changes:**

- Move the root `_roadmap/` and `_backlog/` content into `cli/work/`.
- Re-scaffold the emptied root trees with `.gitkeep` stage directories.
- Repoint every in-repo reference to the relocated root entries.

**Operations:**

- `git mv` for every move so history is preserved.

**Dependencies:**

- None.

### (Scope) Package: Art Work Cli

**Record:** `$ART_WORK_CLI/_records/package.art`

**Role:** — Receives the relocated roadmap and backlog; hosts this plan.

**Partial:**

- `path` — `$ART_WORK_CLI/`
- `canonicalName` — `@art-work/cli`
- `bin` — `art-work-cli`

**Changes:**

- Merge the moved trees into the existing `cli/work/_roadmap/` and `cli/work/_backlog/` stage directories.
- Document the per-CLI roadmap and backlog split in both guides.

**Operations:**

- None.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`, with every commit in `$ART_WORK` on branch `building`, verified by running `npm run ci` from the `$ART_WORK` root.

## Work

### Next

Delegate `move-roadmap-into-cli-work`, the first `READY` iteration.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Do NOT run `npm install` inside `$ART_WORK` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the `$ART_WORK` root:

```bash
npm run ci # lint, test and build
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions                | Status  |
| --------------------------------------- | ------- |
| Iteration: Move Roadmap Into Cli Work   | `READY` |
| Iteration: Move Backlog Into Cli Work   | `READY` |
| Iteration: Update Guides and References | `READY` |

### Iteration: Move Roadmap Into Cli Work

**Id:** `move-roadmap-into-cli-work`

**Status:** `READY`

**Purpose:** Give the Art Work Cli its own roadmap tree.

**Description:** Relocate every root `_roadmap/` entry into `$ART_WORK_CLI/_roadmap/`, merging into the stage directories scaffolded there, and remove the emptied root directory.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

Use `git mv` for every move so history is preserved.

In `$ART_WORK`:

- `_roadmap/3-now/milestone-art-work-cli-one/` → `cli/work/_roadmap/3-now/milestone-art-work-cli-one/`
- `_roadmap/1-done/` and `_roadmap/9-inbox/` hold only `.gitkeep`; drop the sources, keeping the scaffolded copies under `cli/work/_roadmap/`.
- Keep the repository-level files at the root: `_roadmap/_architect.md` (repository briefing) and `_roadmap/_parking-lot.md` (repository-level tracker).
- Re-scaffold the emptied root `_roadmap/` by adding a `.gitkeep` back to `1-done/`, `3-now/`, and `9-inbox/`.

**Instructions:**

Execute the Changes listed above; `cli/work/_roadmap/` already holds `3-now`, `4-next`, `6-plan`, `8-discovery`, `9-inbox`, and the committed milestones, so this is a merge, not a create. The emptied root stages are re-scaffolded with `.gitkeep` so the root tree stays ready for repository-level planning.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- The root `_roadmap/` holds only `_architect.md`, `_parking-lot.md`, and `.gitkeep`-scaffolded stage directories.
- Every moved entry appears under `cli/work/_roadmap/`, and `git status` reports the moves as renames, not as delete-then-add pairs.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `move-roadmap-into-cli-work` in `$ART_WORK`.

**Dependencies:**

- None.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `move-roadmap-into-cli-work` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `move-roadmap-into-cli-work`

**Repository:** Art Work

**Message:**

```text
migrate(art-work): Move the root `_roadmap` into `cli/work`.
```

### Iteration: Move Backlog Into Cli Work

**Id:** `move-backlog-into-cli-work`

**Status:** `READY`

**Purpose:** Give the Art Work Cli its own backlog tree.

**Description:** Relocate every root `_backlog/` entry into `$ART_WORK_CLI/_backlog/`, merging into the stage directories scaffolded there, and remove the emptied root directory.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

Use `git mv` for every move so history is preserved.

In `$ART_WORK`:

- `_backlog/0-archive/` (26 archived plan directories) → `cli/work/_backlog/0-archive/`
- `_backlog/4-next/plan-art-work-cli-global-install/` → `cli/work/_backlog/4-next/plan-art-work-cli-global-install/`
- `_backlog/4-next/plan-optimize-tests-update-knowledge/` → `cli/work/_backlog/4-next/plan-optimize-tests-update-knowledge/`
- `_backlog/6-plan/` (5 plan directories plus `_parking-lot.md`) → `cli/work/_backlog/6-plan/`
- Keep the repository-level tracker at the root: `_backlog/_parking-lot.md`.
- Re-scaffold the emptied root `_backlog/` by adding a `.gitkeep` back to `0-archive/`, `4-next/`, and `6-plan/`.

**Instructions:**

Execute the Changes listed above; `cli/work/_backlog/` already holds the empty stage directories, the new `_parking-lot.md`, and the two plans created there (`plan-migrate-planning-and-knowledge`, `plan-rename-repo-and-project`), so this is a merge, not a create. The emptied root stages are re-scaffolded with `.gitkeep` so the root tree stays ready for repository-level planning.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Depends on `move-roadmap-into-cli-work`; do not start before it has been committed.

Validate that:

- The root `_backlog/` holds only `_parking-lot.md` and `.gitkeep`-scaffolded stage directories.
- `cli/work/_backlog/4-next/` holds `plan-art-work-cli-global-install` and `plan-optimize-tests-update-knowledge`.
- Every plan directory that was under the root `_backlog/` now sits under `cli/work/_backlog/`, in its own stage.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `move-backlog-into-cli-work` in `$ART_WORK`.

**Dependencies:**

- Iteration: Move Roadmap Into Cli Work.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `move-backlog-into-cli-work` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `move-backlog-into-cli-work`

**Repository:** Art Work

**Message:**

```text
migrate(art-work): Move the root `_backlog` into `cli/work`.
```

### Iteration: Update Guides and References

**Id:** `update-guides-and-references`

**Status:** `READY`

**Purpose:** Make the split discoverable and leave no stale path.

**Description:** Finish the repository and package guides so both describe the per-CLI roadmap and backlog, and sweep the repository for references to the retired root locations.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$ART_WORK/_guide.md`:

- Verify only — do not edit: the Roadmapping and Planning Work sections already describe the repository-level `_roadmap/` and `_backlog/` plus the per-CLI trees hosted under `cli/work/`, which is exactly the post-migration layout.

In `$ART_WORK_CLI/_guide.md`:

- Verify only — do not edit: Package Layout and the Roadmapping / Planning Work sections already document `_roadmap/` and `_backlog/`.

Sweep `$ART_WORK` for tracked references to the relocated entries (the CLI milestone, the moved plans, and the archive) and repoint them to their new `cli/work/` locations — this covers the moved milestones and the moved plan files whose paths broke. Do not touch the root `_roadmap/_architect.md`, the root `_backlog/_parking-lot.md`, or the root `_roadmap/_parking-lot.md`: they are repository-level files that stay. Do not touch `$ART_WORK/_guide.md` or `$ART_WORK/_records/project.art`: their references point at the root trees, which remain. Leave `cli/work/_backlog/0-archive/` untouched: archived records are frozen delivery evidence and their paths stay as delivered. Update relative paths inside the moved plan files only where they broke — the move is otherwise path-preserving.

**Instructions:**

Execute the Changes listed above; both guides already document the post-migration split, so this iteration is verification plus the reference sweep.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Depends on `move-backlog-into-cli-work`; do not start before it has been committed.

Validate that:

- Searching tracked references to the relocated entries (root `3-now/milestone-art-work-cli-one`, the root backlog plans, and the archive) returns no hit outside `cli/work/`; `cli/work/_backlog/0-archive/` is excluded.
- Both guides describe the split: the repository-level trees reserved at the root, one roadmap and backlog per CLI under `cli/work/`.
- `git status` reports no change to `_guide.md` or `_records/project.art`.
- `npm run ci` passes.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `update-guides-and-references` in `$ART_WORK`.

**Dependencies:**

- Iteration: Move Backlog Into Cli Work.

#### Commits:

| ID                             | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ------------------------------ | ----------------------------------- | ------------ | ---- | ---------- |
| `update-guides-and-references` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `update-guides-and-references`

**Repository:** Art Work

**Message:**

```text
docs(art-work): Document the per-CLI roadmap and backlog split.
```

---

## Coordination

### Not In Scope

- **Cross-repository references** — `$MANAGEMENT/_roadmap/3-now/milestone-hello-world/milestone.md` points at `$ART_WORK/_roadmap/...` and `_backlog/0-archive/...`; updating it belongs to the Management backlog, not this repository.
- **Content changes** — no plan or milestone is rewritten, archived, or retired; only relocated.

### Evidence

- **Root trees freed** — after delivery, `$ART_WORK/_roadmap` and `$ART_WORK/_backlog` hold only repository-level files (`_architect.md`, the root `_parking-lot.md`) and `.gitkeep`-scaffolded stages, while `cli/work/_roadmap` + `cli/work/_backlog` hold the CLI planning artefacts.

### Findings

- **Multi-CLI future** — the repository will host more CLIs under `cli/`; planning artefacts must live with the CLI they describe rather than at the monorepo root.
- **Scaffold already in place** — `cli/work/_roadmap/` and `cli/work/_backlog/` stage directories exist, so the migration is a merge, not a create.
- **`0-archive` is the bulk** — 26 of the 33 plan directories under the root `_backlog/` are archived plans; moving them first keeps the active stages small and reviewable.
- **The split is half-documented** — `$ART_WORK_CLI/_guide.md` already documents both sections and all five workflows, while the Planning Work section of `$ART_WORK/_guide.md` still points at the root.

### Decisions

- **`git mv` everywhere** — history follows the rename; no copy-then-delete.
- **Merge into scaffold** — the pre-created stage directories are kept; only their `.gitkeep` sources are dropped when the real content arrives.
- **One commit per tree** — roadmap, backlog, and guides are separable concerns and revert independently.
- **Root trees are re-scaffolded, not removed** — the root `_roadmap/` and `_backlog/` stay, emptied of CLI content and re-scaffolded with `.gitkeep` stages, so the root remains free for repository-level (non-CLI) planning.
- **Repository-level files stay at the root** — `_roadmap/_architect.md` (the repository briefing) and the root `_parking-lot.md` trackers are not relocated.

### Knowledge to Update

- `$ART_WORK/_guide.md` — verified by Iteration: Update Guides and References; already describes the split, no edit required.
- `$ART_WORK_CLI/_guide.md` — verified by Iteration: Update Guides and References; already describes the split, no edit required.

### Follow Ups

- **Update Management references** — repoint `$MANAGEMENT` milestones and records at `cli/work/_roadmap` and `cli/work/_backlog`.
- **Per-CLI guide template** — once a second CLI lands, extract the roadmap/backlog section of `cli/work/_guide.md` into a reusable pattern for `cli/*/_guide.md`.

### Feedback

- None.
