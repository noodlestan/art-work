# Plan: Migrate Planning and Knowledge

**ID:** `migrate-planning-and-knowledge`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Move the repository-level `_roadmap/` and `_backlog/` into `cli/work/` so the Art Work Cli owns its own planning artefacts.

**Description:** The repository is going to host more CLIs under `cli/`. Relocate the roadmap and backlog from the monorepo root into `cli/work/`, update both guides to document the split, and fix every in-repo reference to the old root locations.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable        | Resolved Path                            | Purpose                                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `$WORKSPACE`    | Current working directory                | Workspace root directory                                   |
| `$DOMAINS`      | `$WORKSPACE/.agents/domains`             | Domain resources directory                                 |
| `$ART_WORK`     | `$WORKSPACE/checkouts/art-work-planning` | Art Work repository; hosts this plan.                      |
| `$ART_WORK_CLI` | `$ART_WORK/cli/work`                     | The Art Work Cli package, and now its roadmap and backlog. |

## Summary

Move the root `_roadmap/` and `_backlog/` trees into `$ART_WORK_CLI/`, update the repository and package guides to describe the per-CLI planning split, and leave no reference to the old root paths — so additional CLIs can each own their own roadmap and backlog.

## Context

### Upstream Work

| Kind                  | Path                                                                             | Role                                                                |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK_CLI/_roadmap/_parking-lot.md`                                         | Tracks short-term actionables; requested the creation of this plan. |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                               | Art Work principles, NFRs, milestones.                              |
| Milestone             | `$ART_WORK_CLI/_roadmap/3-now/milestone-rename-art-work-to-art-box/milestone.md` | Coordinates this plan as Phase 1 of the rename milestone.           |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK/_guide.md` (Guide) — Repository layout, Roadmapping, and Planning Work sections. Relevant for Planning Work Item.

::READ `$ART_WORK/cli/work/_guide.md` (Guide) — Package layout and workflows. Relevant for Planning Work Item.

## Scope

Move the two planning trees into `$ART_WORK_CLI`, update `$ART_WORK/_guide.md` and `$ART_WORK_CLI/_guide.md`, and correct in-repo references. No plan or milestone content is edited, archived, or retired — only relocated. Cross-repository references held by other checkouts are out of scope and tracked as a follow-up.

## Work

### Next

- Refine the 3 `DRAFT` iterations (`plan more`), then generate their instructions (`write instructions`) before delegating.

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
```

Do NOT run `npm install` inside `$ART_WORK` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

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
| Iteration: Move Roadmap Into Cli Work   | `DRAFT` |
| Iteration: Move Backlog Into Cli Work   | `DRAFT` |
| Iteration: Update Guides and References | `DRAFT` |

### Iteration: Move Roadmap Into Cli Work

**Id:** `move-roadmap-into-cli-work`

**Status:** `DRAFT`

**Purpose:** Give the Art Work Cli its own roadmap tree.

**Description:** Relocate every root `_roadmap/` entry into `$ART_WORK_CLI/_roadmap/`, merging into the stage directories scaffolded there, and remove the emptied root directory.

**Changes:**

Use `git mv` for every move so history is preserved.

In `$ART_WORK`:

- `_roadmap/_architect.md` → `cli/work/_roadmap/_architect.md`
- `_roadmap/_parking-lot.md` → `cli/work/_roadmap/_parking-lot.md`
- `_roadmap/3-now/milestone-art-work-cli-one/` → `cli/work/_roadmap/3-now/milestone-art-work-cli-one/`
- `_roadmap/1-done/` and `_roadmap/9-inbox/` hold only `.gitkeep`; drop the sources, keeping the scaffolded copies under `cli/work/_roadmap/`.
- Remove the emptied root `_roadmap/`.

**Dependencies:**

- None.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ------------- |
| `move-roadmap-into-cli-work` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `move-roadmap-into-cli-work`

**Message:**

```text
migrate(art-work): Move the root `_roadmap` into `cli/work`.
```

### Iteration: Move Backlog Into Cli Work

**Id:** `move-backlog-into-cli-work`

**Status:** `DRAFT`

**Purpose:** Give the Art Work Cli its own backlog tree.

**Description:** Relocate every root `_backlog/` entry into `$ART_WORK_CLI/_backlog/`, merging into the stage directories scaffolded there, and remove the emptied root directory.

**Changes:**

Use `git mv` for every move so history is preserved.

In `$ART_WORK`:

- `_backlog/_parking-lot.md` → `cli/work/_backlog/_parking-lot.md`
- `_backlog/0-archive/` (23 archived plan directories) → `cli/work/_backlog/0-archive/`
- `_backlog/3-now/plan-add-config-cache/` → `cli/work/_backlog/3-now/plan-add-config-cache/`
- `_backlog/4-next/plan-art-work-cli-global-install/` → `cli/work/_backlog/4-next/plan-art-work-cli-global-install/`
- `_backlog/4-next/plan-optimize-tests-update-knowledge/` → `cli/work/_backlog/4-next/plan-optimize-tests-update-knowledge/`
- `_backlog/6-plan/` (5 plan directories plus `_parking-lot.md`) → `cli/work/_backlog/6-plan/`
- Remove the emptied root `_backlog/`.

**Dependencies:**

- Iteration: Move Roadmap Into Cli Work.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ------------- |
| `move-backlog-into-cli-work` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `move-backlog-into-cli-work`

**Message:**

```text
migrate(art-work): Move the root `_backlog` into `cli/work`.
```

### Iteration: Update Guides and References

**Id:** `update-guides-and-references`

**Status:** `DRAFT`

**Purpose:** Make the split discoverable and leave no stale path.

**Description:** Update the repository guide and the package guide to document the per-CLI roadmap and backlog, and sweep the repository for references to the retired root locations.

**Changes:**

In `$ART_WORK/_guide.md`:

- Repository Layout: drop `_backlog/` and `_roadmap/`; add `cli/` — the CLI packages, each owning its own `_roadmap/` and `_backlog/`.
- Roadmapping: point at `$ART_WORK_CLI/_roadmap/` (stages, `_parking-lot.md`, `_architect.md`).
- Planning Work: point at `$ART_WORK_CLI/_backlog/` (stages and `_parking-lot.md`).

In `$ART_WORK_CLI/_guide.md`:

- Package Layout: add `_roadmap/` and `_backlog/`.
- Workflows: add Roadmapping and Planning Work alongside Deploying.

Sweep `$ART_WORK` for tracked references to the root `_roadmap/` and `_backlog/` and repoint them to `cli/work/`. Update relative paths inside the moved plan files only where they broke — the move is otherwise path-preserving.

**Dependencies:**

- Iteration: Move Backlog Into Cli Work.

#### Commits:

| ID                             | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ------------------------------ | ----------------------------------- | ------------ | ---- | ------------- |
| `update-guides-and-references` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `update-guides-and-references`

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

- **No root planning trees** — after delivery, `$ART_WORK/_roadmap` and `$ART_WORK/_backlog` no longer exist, and `cli/work/_roadmap` + `cli/work/_backlog` hold everything.

### Findings

- **Multi-CLI future** — the repository will host more CLIs under `cli/`; planning artefacts must live with the CLI they describe rather than at the monorepo root.
- **Scaffold already in place** — `cli/work/_roadmap/` and `cli/work/_backlog/` stage directories exist, so the migration is a merge, not a create.
- **`0-archive` is the bulk** — 23 of the 26 backlog directories are archived plans; moving them first keeps the active stages small and reviewable.

### Decisions

- **`git mv` everywhere** — history follows the rename; no copy-then-delete.
- **Merge into scaffold** — the pre-created stage directories are kept; only their `.gitkeep` sources are dropped when the real content arrives.
- **One commit per tree** — roadmap, backlog, and guides are separable concerns and revert independently.

### Knowledge to Update

- `$ART_WORK/_guide.md` — delivered by Iteration: Update Guides and References.
- `$ART_WORK_CLI/_guide.md` — delivered by Iteration: Update Guides and References.

### Follow Ups

- **Update Management references** — repoint `$MANAGEMENT` milestones and records at `cli/work/_roadmap` and `cli/work/_backlog`.
- **Per-CLI guide template** — once a second CLI lands, extract the roadmap/backlog section of `cli/work/_guide.md` into a reusable pattern for `cli/*/_guide.md`.

### Feedback

- None.
