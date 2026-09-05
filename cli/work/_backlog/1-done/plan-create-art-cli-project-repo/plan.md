# Plan: Create Art Cli Project and Repo

**ID:** `create-art-cli-project-repo`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Create the `noodlestan/art-cli` repository scaffolded from the art-js-reference template, with project, repo, and namespace records for the Art Cli project.

**Description:** Scaffold the art-cli repo from `$ART_JS` (dotfiles, lint configs, vite, license, README, `_records`, empty architecture index, `_backlog/_parking-lot.md`, `_roadmap/_parking-lot.md`); add the guide; populate records (copied from the template except scaffolders) with Namespace: Art Cli, Project: Art Cli, and Repository remote `git@github.com:noodlestan/art-cli.git`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                            |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                           |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                         |
| `$ART_DOMAINS` | Provided with prompt.        | Where this plan lives. Example: `$WORKSPACE/checkouts/art-domains-planning`        |
| `$ART_CLI`     | Provided with prompt.        | The new repository to create. Example: `$WORKSPACE/checkouts/art-cli-building`     |
| `$ART_JS`      | Provided with prompt.        | Repo used to scaffold by copying. Example: `$WORKSPACE/checkouts/art-js-reference` |

## Summary

Create the `noodlestan/art-cli` repository scaffolded from the art-js-reference template, with Namespace: Art Cli, Project: Art Cli (resources: Package: Lib Records PLANNED), and Repository remote `git@github.com:noodlestan/art-cli.git`.

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

::READ `$ART_DOMAINS/_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `$ART_DOMAINS/architecture/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.
::READ `$DOMAINS/roadmaps/index.md` (Structure) — Roadmaps and milestones coordination. Relevant for Planning Work Item.

## Scope

Scaffold the art-cli repo from the art-js-reference template: dotfiles, lint configs, vite, license, README, `_records`, empty architecture index, `_backlog/_parking-lot.md`, `_roadmap/_parking-lot.md`; add the guide; populate records (all template records except scaffolders) with Namespace: Art Cli, Project: Art Cli, and Repository remote `git@github.com:noodlestan/art-cli.git`.

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

| Iteration / Instructions       | Status |
| ------------------------------ | ------ |
| Iteration: Scaffold Repository | `DONE` |
| Iteration: Add Guide           | `DONE` |
| Iteration: Populate Records    | `DONE` |

### Iteration: Scaffold Repository

**Id:** `scaffold-repository`

**Status:** `DONE`

**Report:** `./plan-create-art-cli-project-repo/instructions/scaffold-repository__report.md`

**Purpose:** Scaffold the art-cli repository from the art-js-reference template.

**Description:** Scaffold all dotfiles, tslint, eslint, vite, license, README, package.json, tsconfig, turbo.json, lefthook.yml, architecture (empty index), and initialize `_backlog/_parking-lot.md` and `_roadmap/_parking-lot.md` from `$ART_JS`. Records are populated in the Populate Records iteration.

**Instructions:** `./plan-create-art-cli-project-repo/instructions/scaffold-repository.md`

**Changes:**

- Scaffold the repo skeleton from `$ART_JS` template: dotfiles, lint configs, vite, license, README, package.json, tsconfig, turbo.json, lefthook.yml.
- Create an empty architecture index.
- Initialize `_backlog/_parking-lot.md` and `_roadmap/_parking-lot.md`.

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `scaffold-art-cli-repository` | Art Cli / `$ART_CLI` / `main`  | `AUTONOMOUS` | `3da41ec` | `COMMITTED` |

##### Commit: `scaffold-art-cli-repository`

**Message:**

```
scaffold(art-cli): Scaffold Art Cli repository from Art Js template.

- Copy dotfiles, lint configs, vite, license, README, package.json, tsconfig, turbo.json, and lefthook.yml.
- Create empty architecture index.
- Initialize _backlog/_parking-lot.md and _roadmap/_parking-lot.md.
```

### Iteration: Add Guide

**Id:** `add-guide`

**Status:** `DONE`

**Report:** `./plan-create-art-cli-project-repo/instructions/add-guide__report.md`

**Purpose:** Add the guide to the new repository.

**Description:** Add the `_guide.md` to the art-cli repository.

**Instructions:** `./plan-create-art-cli-project-repo/instructions/add-guide.md`

**Changes:**

- Add the `_guide.md` to the new repository.

**Dependencies:**

- `scaffold-repository` — the scaffolded repo must exist first.

#### Commits:

| ID                  | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-art-cli-guide` | Art Cli / `$ART_CLI` / `main`  | `AUTONOMOUS` | `6e47e36` | `COMMITTED` |

##### Commit: `add-art-cli-guide`

**Message:**

```
guides(art-cli): Add root guide to Art Cli repository.
```

### Iteration: Populate Records

**Id:** `populate-records`

**Status:** `DONE`

**Report:** `./plan-create-art-cli-project-repo/instructions/populate-records__report.md`

**Purpose:** Populate the project, repo, and namespace records for the Art Cli project.

**Description:** Copy all records from `$ART_JS` except scaffolders; set Namespace.name: Art Cli, Namespace.owner: Project: Art Cli, Project.name: Art Cli, Project.resources: Package: Lib Records (PLANNED canonical `@art-cli/lib-records`), Repository.Remote: `git@github.com:noodlestan/art-cli.git`.

**Instructions:** `./plan-create-art-cli-project-repo/instructions/populate-records.md`

**Changes:**

- Copy all records from `$ART_JS` except scaffolders.
- Set Namespace.name: Art Cli, Namespace.owner: Project: Art Cli.
- Set Project.name: Art Cli, Project.resources: Package: Lib Records (PLANNED canonical `@art-cli/lib-records`).
- Set Repository.Remote: `git@github.com:noodlestan/art-cli.git`.

**Dependencies:**

- `add-guide` — the guide must be in place before records are populated.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `populate-art-cli-records` | Art Cli / `$ART_CLI` / `main`  | `AUTONOMOUS` | `917c561` | `COMMITTED` |

##### Commit: `populate-art-cli-records`

**Message:**

```
records(art-cli): Populate project, repo, and namespace records.

- Copy template records except scaffolders.
- Set Namespace: Art Cli, Project: Art Cli, Repository remote art-cli.git.
- Register Package: Lib Records (PLANNED) in the project record.
```

---

## Coordination

### Not In Scope

- Moving the workspace-cli source code (tracked in Plan: Extract Workspace Cli to Art Work).
- Extracting the record read/write modules (tracked in Plan: Extract Read/Write Records to Art Cli).

### Evidence

- Scaffolded Art Cli repository skeleton, dotfiles, configs, architecture index, parking lots, and `_guide.md` at `$ART_CLI`.
- Populated project, repo, namespace, license, dependencies, and scripts records at `$ART_CLI/_records/`.
- Commits `3da41ec`, `6e47e36`, and `10b5f13` authored and pushed to `origin/main`.

### Findings

- The art-js-reference template carries the full scaffold (dotfiles, lint configs, vite, license, README, `_records`, architecture index, parking lots) plus scaffolders; the scaffolders are not copied — records are populated manually.
- The template records (project, repository, namespace, license, dependencies, scripts) are copied except the `scaffolders/` directory.

### Decisions

- The art-cli repo is scaffolded from `$ART_JS`. Example: `/checkouts/art-js-reference`.
- Records are copied from the template except scaffolders.
- Namespace: Art Cli, Project: Art Cli, Repository remote `git@github.com:noodlestan/art-cli.git`.
- Commit order: scaffold → guide → records; each commit is self-contained in the art-cli repo.

### Knowledge to Update

- Register the art-cli repository in the workspace records (`_records/repositories/art-cli.art`) and workspace manifest.
- Add art-cli to the owner project record in the artificials repo.

### Follow Ups

- Register the art-cli repository in the workspace records (`_records/repositories/art-cli.art`) once the repo exists on GitHub.
- Add art-cli to the owner project record in the artificials repo.

### Feedback

- None.
