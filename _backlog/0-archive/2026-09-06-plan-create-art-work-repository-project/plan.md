# Plan: Create Art Work Repository and Project

**ID:** `create-art-work-repository-project`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Create the `noodlestan/art-work` repository with project, repo, and namespace records for the Art Work project.

**Description:** Create the art-work repo with Namespace: Art Work; the root project record takes the current content of `cli/workspace/_records/project.art`; Project.Resources: Package: Workspace CLI, Application: Workspace Website (PLANNED), Tool: Workspace Tool (PLANNED); Repository.Remote: `git@github.com:noodlestan/art-work.git`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                            |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                           |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                         |
| `$ART_DOMAINS` | Provided with prompt.        | Where this plan lives. Example: `$WORKSPACE/checkouts/art-domains-planning`        |
| `$ART_WORK`    | Provided with prompt.        | The new repository to create. Example: `$WORKSPACE/checkouts/art-work-building`    |
| `$ART_JS`      | Provided with prompt.        | Repo used to scaffold by copying. Example: `$WORKSPACE/checkouts/art-js-reference` |

## Summary

Create the `noodlestan/art-work` repository with Namespace: Art Work, root project record from `cli/workspace/_records/project.art`, and Repository remote `git@github.com:noodlestan/art-work.git`.

## Context

### Upstream Work

| Kind                  | Path                                                                   | Role                                                                 |
| --------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Parking Lot           | `$ART_DOMAINS/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers.      |
| Architecture Briefing | `_roadmap/_architect.md`                                               | Workspace principles, NFRs, milestones.                              |
| Milestone             | `$ART_DOMAINS/_roadmap/3-now/milestone-workspace-cli-one/milestone.md` | Coordinates this plan as Phase 3 of the Workspace CLI One milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.
::READ `$DOMAINS/roadmaps/index.md` (Structure) — Roadmaps and milestones coordination. Relevant for Planning Work Item.

## Scope

Create the art-work repo (scaffold, guide, records): Namespace: Art Work; root project record takes the current content of `cli/workspace/_records/project.art`; Project.Resources: Package: Workspace CLI, Application: Workspace Website (PLANNED), Tool: Workspace Tool (PLANNED); Repository.Remote: `git@github.com:noodlestan/art-work.git`.

## Work

### Next

Move plan to `1-done/` or proceed to next plan in milestone.

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

**Instructions:** (From `$ART_DOMAINS/_guide.md`)

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

| Iteration / Instructions     | Status |
| ---------------------------- | ------ |
| Iteration: Create Repository | `DONE` |
| Iteration: Populate Records  | `DONE` |

### Iteration: Create Repository

**Id:** `create-repository`

**Status:** `DONE`

**Report:** `./plan-create-art-work-repository-project/instructions/create-repository__report.md`

**Purpose:** Create the art-work repository with the standard scaffold and guide.

**Description:** Scaffold the art-work repo (dotfiles, lint configs, license, README, package.json, tsconfig, turbo.json, lefthook.yml, architecture index, `_backlog/_parking-lot.md`, `_roadmap/_parking-lot.md`) and add the `_guide.md`. Records are populated in the Populate Records iteration.

**Instructions:** `./plan-create-art-work-repository-project/instructions/create-repository.md`

**Changes:**

- Scaffold the art-work repo (dotfiles, lint configs, license, README, package.json, tsconfig, turbo.json, lefthook.yml, architecture index, parking lots).
- Add the `_guide.md`.

**Dependencies:**

- None.

#### Commits:

| ID                             | Repository / Checkout / Branch  | Policy       | Hash      | Status      |
| ------------------------------ | ------------------------------- | ------------ | --------- | ----------- |
| `scaffold-art-work-repository` | Art Work / `$ART_WORK` / `main` | `AUTONOMOUS` | `7eca2fa` | `COMMITTED` |
| `add-art-work-guide`           | Art Work / `$ART_WORK` / `main` | `AUTONOMOUS` | `7f6e943` | `COMMITTED` |

##### Commit: `scaffold-art-work-repository`

**Message:**

```
scaffold(art-work): Scaffold Art Work repository.

- Add dotfiles, lint configs, license, README, package.json, tsconfig, turbo.json, and lefthook.yml.
- Create empty architecture index.
- Initialize _backlog/_parking-lot.md and _roadmap/_parking-lot.md.
```

##### Commit: `add-art-work-guide`

**Message:**

```
guides(art-work): Add root guide to the Art Work repository.
```

### Iteration: Populate Records

**Id:** `populate-records`

**Status:** `DONE`

**Report:** `./plan-create-art-work-repository-project/instructions/populate-records__report.md`

**Purpose:** Populate the project, repo, and namespace records for the Art Work project.

**Description:** Copy the template records (namespace, project, repository, license, dependencies, scripts) and set Namespace: Art Work; root project record takes the current content of `cli/workspace/_records/project.art`; Project.Resources: Package: Workspace CLI, Application: Workspace Website (PLANNED), Tool: Workspace Tool (PLANNED); Repository.Remote: `git@github.com:noodlestan/art-work.git`.

**Instructions:** `./plan-create-art-work-repository-project/instructions/populate-records.md`

**Changes:**

- Copy the template records (namespace, project, repository, license, dependencies, scripts).
- Set Namespace.name: Art Work.
- Set the root project record from the current content of `cli/workspace/_records/project.art`.
- Set Project.Resources: Package: Workspace CLI, Application: Workspace Website (PLANNED), Tool: Workspace Tool (PLANNED).
- Set Repository.Remote: `git@github.com:noodlestan/art-work.git`.

**Dependencies:**

- `create-repository` — the repo must exist before records are populated.

#### Commits:

| ID                          | Repository / Checkout / Branch  | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------- | ------------ | --------- | ----------- |
| `populate-art-work-records` | Art Work / `$ART_WORK` / `main` | `AUTONOMOUS` | `6285c27` | `COMMITTED` |

##### Commit: `populate-art-work-records`

**Message:**

```
records(art-work): Populate project, repo, and namespace records.

- Copy template records (namespace, project, repository, license, dependencies, scripts).
- Set Namespace: Art Work.
- Root project record from cli/workspace/_records/project.art.
- Set Project.Resources and Repository remote art-work.git.
```

---

## Coordination

### Not In Scope

- Moving the workspace-cli source code (tracked in Plan: Extract Workspace Cli to Art Work).

### Evidence

- Created Art Work repository skeleton, architecture index, parking lots, and `_guide.md` at `$ART_WORK`.
- Populated project, repo, namespace, license, dependencies, and scripts records at `$ART_WORK/_records/`.
- Commits `7eca2fa`, `7f6e943`, and `9a2cd88` authored and pushed to `origin/main`.

### Findings

- The root project record for Art Work takes the current content of `cli/workspace/_records/project.art` (Project: Workspace), re-scoped to Namespace: Art Work and Repository: Art Work.
- The art-work repo is a monorepo; the workspace-cli source will live at `cli/workspace` (moved in Plan: Extract Workspace Cli to Art Work).

### Decisions

- Namespace: Art Work.
- The root project record takes the current content of `cli/workspace/_records/project.art`.
- Repository remote `git@github.com:noodlestan/art-work.git`.
- Commit order: scaffold → guide → records; each commit is self-contained in the art-work repo.

### Knowledge to Update

- Register the art-work repository in the workspace records (`_records/repositories/art-work.art`) and workspace manifest.
- Add art-work to the owner project record in the artificials repo.

### Follow Ups

- Register the art-work repository in the workspace records (`_records/repositories/art-work.art`) and workspace manifest once the repo exists on GitHub.
- Add art-work to the owner project record in the artificials repo.

### Feedback

- None.
