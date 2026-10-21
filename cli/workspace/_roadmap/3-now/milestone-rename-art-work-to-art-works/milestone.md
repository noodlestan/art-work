# Milestone: Rename Art Work to Art Works

**ID:** `rename-art-work-to-art-works`

**Status:** `READY`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Rename the repository and the project from Art Work to Art Works so the repository can host more CLIs and tools, moving the package identity along with them.

**Description:** Milestone record with 2 phases and 2 plans, coordinating the relocation of the remaining planning artefacts into `cli/workspace/` (re-scaffolding the root trees for repository-level planning) and the rename of the repository and project across `$ART_WORK`, `$WORKSPACE/_records`, `$ARTIFICIALS`, and `$NOODLESTAN_WEB`.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

This section lists the path variables used throughout the milestone file and its downstream work items. All file references in the milestone and downstream work items MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path                            | Purpose                                                 |
| ----------------- | ---------------------------------------- | ------------------------------------------------------- |
| `$WORKSPACE`      | Current working directory                | Workspace root directory.                               |
| `$DOMAINS`        | `$WORKSPACE/.agents/domains`             | Domain resources directory.                             |
| `$ART_WORK`       | `$WORKSPACE/checkouts/art-work-building` | Art Work repository; hosts this milestone.              |
| `$ART_WORK_CLI`   | `$ART_WORK/cli/workspace`                | Art Workspace Cli package, and its roadmap and backlog. |
| `$ARTIFICIALS`    | `$WORKSPACE/checkouts/artificials`       | Owns the project record; references to repoint.         |
| `$NOODLESTAN_WEB` | `$WORKSPACE/checkouts/noodlestan-web`    | Hosts the project list and the website to redeploy.     |

## Summary

Rename the repository and the project to Art Works in 2 phases — relocate the remaining `_roadmap/` and `_backlog/` content into `$ART_WORK_CLI` and re-scaffold the root trees for repository-level planning, then rename the repository and project identity across `$WORKSPACE/_records`, `$ARTIFICIALS`, and `$NOODLESTAN_WEB` — so the repository can host more CLIs and tools, with the package identity moving to `@art-works/workspace-cli`; coordinated from the ONGOING items in `$ART_WORK/_backlog/_parking-lot.md`.

## Context

### Upstream Work

| Kind                  | Path                                                                   | Role                                                                              |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                                   | Tracks the ONGOING migration and rename items that requested this milestone.      |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                     | Repository principles and the multi-CLI future that motivate the rename.          |
| Milestone             | `$ART_WORK_CLI/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Sibling milestone holding the CLI delivery work this planning migration supports. |

### Required Skills

- `write-milestone` — Writes milestones from roadmaps, backlogs, and parking lots. Required for Planning Work Item.
- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and plan artefacts. Required for Drafting Work Item.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmaps and milestones coordination.                                              |

### Resource Kinds in Scope

| Kind       | Domain       | Structure Record Path                             |
| ---------- | ------------ | ------------------------------------------------- |
| Project    | Projects     | `$DOMAINS/projects/structures/project.art`        |
| Repository | Repositories | `$DOMAINS/repositories/structures/repository.art` |
| Package    | Packages     | `$DOMAINS/packages/structures/package.art`        |
| Checkout   | Workspaces   | `$DOMAINS/workspaces/structures/checkout.art`     |

### Workflows

| Workflow / Path                                                                | Purpose                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Workflow: Planning Work `$DOMAINS/work/workflows/planning-work/workflow.art`   | Create and manage work item lifecycles.               |
| Workflow: Roadmapping `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`   | Organize roadmap creation and maintenance.            |
| Workflow: Executing Work `$DOMAINS/work/workflows/executing-work/workflow.art` | Organize work execution to produce verified outcomes. |

### Workflow Operations

| Workflow / Operation / Path                                                                                         | Purpose                                               |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Planning Work / Planning Work Item `$DOMAINS/work/workflows/planning-work/planning-work-item/operation.art`         | Plan the implementation of the work item.             |
| Planning Work / Writing Commit Message `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art` | Write standardized messages according to conventions. |
| Executing Work / Setting Up `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`                       | Prepare the execution environment.                    |
| Executing Work / Verifying Completion `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`   | Confirm the work item satisfies its intended outcome. |

### Knowledge

Agents SHOULD scan these files for relevant clarifications when faced by ambiguity or omissions that may result from missing definitions.

::READ `$WORKSPACE/_guide.md` (Guide) — Workspace layout, records management, setup, and verification. Relevant for Planning Work Item, Setting Up, Writing Commit Message, Verifying Completion.
::READ `$ART_WORK/_guide.md` (Guide) — Repository layout, records management, conventions, and verification. Relevant for Planning Work Item, Writing Commit Message, Verifying Completion.
::READ `$ART_WORK_CLI/_guide.md` (Guide) — Package layout, roadmap and backlog locations, and verification. Relevant for Planning Work Item.

## Scope

Rename the identity of one repository and one project across 4 owners — `$ART_WORK` records, `$WORKSPACE` records, the project reference held by `$ARTIFICIALS`, and the generated project list in `$NOODLESTAN_WEB` — plus the GitHub repository name and the package identity (`@art-works/workspace-cli`); the workspace script names and the existing checkout locations stay unchanged.

### (Scope) Project: Art Work

**Record:** `$ART_WORK/_records/project.art`

**Role:** — The project identity being renamed to Art Works.

**Partial:**

- `name` — Art Work
- `repository` — Repository: Art Work
- `members` — Package: Art Workspace Cli; Package: Art Board Cli (PLANNED); Application: Art Work Website (PLANNED); Tool: Art Work Tool (PLANNED)

**Changes:**

- Rename the heading to `Project: Art Works` and repoint `Repository: Art Works`.
- Keep the member names unchanged.

**Operations:**

- Copy into `$NOODLESTAN_WEB` with `npm run update-project-records`.

**Dependencies:**

- GitHub repository renamed to `art-works` before remotes are repointed.

### (Scope) Repository: Art Work

**Record:** `$ART_WORK/_records/repository.art`

**Role:** — Repository identity inside the checkout that is being renamed.

**Partial:**

- `owner` — Project: Art Work
- `remote` — `git@github.com:noodlestan/art-work.git`

**Changes:**

- Rename the heading to `Repository: Art Works`, repoint `owner` and `remote`.

**Operations:**

- Update the local git remote after the GitHub rename.

**Dependencies:**

- None.

### (Scope) Repository: Art Work (Workspace Records)

**Record:** `$WORKSPACE/_records/repositories/art-work.art`

**Role:** — Source of truth for the workspace manifest, cloning, and the generated website records.

**Partial:**

- `name` — Art Work
- `remote` — `git@github.com:noodlestan/art-work.git`
- `owner` — Project: Art JS (stale; see Findings)

**Changes:**

- Rename the record file to `art-works.art` and update heading, Purpose, Description, and Remote.

**Operations:**

- Regenerate `.art-workspace.mts` from records if it embeds repository names.

**Dependencies:**

- None.

### (Scope) Checkout: Art Work @ planning

**Record:** `$WORKSPACE/_records/checkouts/art-work-@-planning-checkout.art`

**Role:** — Checkout records reference the repository by name and must follow the rename; locations are kept.

**Partial:**

- `repository` — Art Work
- `location` — `art-work-planning` (sibling record: `art-work-@-building-checkout.art`, `art-work-building`)
- `branch` — `main`

**Changes:**

- Repoint `Repository:` to `Art Works` in both checkout records; keep `Location:` unchanged.

**Operations:**

- Rename the record files to `art-works-@-{branch}-checkout.art`.

**Dependencies:**

- Workspace repository record renamed first.

### (Scope) Project: Art Work (Artificials)

**Record:** `$ARTIFICIALS/_records/project.art`

**Role:** — `$ARTIFICIALS` owns the project registration and links to the repository.

**Partial:**

- `projects` — `Project: Art Work — https://github.com/noodlestan/art-work`

**Changes:**

- Repoint the entry to `Project: Art Works — https://github.com/noodlestan/art-works`.
- Repoint the same link in `$ARTIFICIALS/README.md` and `apps/art-md-web/src/pages/about.md`.

**Operations:**

- None.

**Dependencies:**

- GitHub repository renamed to `art-works`.

### (Scope) Project: Art Work (Noodlestan Web)

**Record:** `$NOODLESTAN_WEB/data/_records/projects/art-work.art`

**Role:** — Published project list and website; regenerated from the records above.

**Partial:**

- `heading` — Art Work
- `remote` — `noodlestan/art-work`
- `collection` — `data/projects/collection.json` (`id` `art-work`, `name` `Art Work`, `code` `https://github.com/noodlestan/art-work`)

**Changes:**

- Drop the stale generated record and regenerate it as `art-works.art`.
- Refresh `data/projects/collection.json` and the cross-reference in `data/_records/projects/artificials.art`.

**Operations:**

- `npm run update-project-records`, then `npm run update-project-collection`, then build and redeploy the website.

**Dependencies:**

- Workspace repository record and the `$ART_WORK` project record renamed first.

### (Scope) Package: Art Workspace Cli

**Record:** `$ART_WORK_CLI/_records/package.art`

**Role:** — Renamed together with the repository and the project.

**Partial:**

- `canonicalName` — `@art-works/workspace-cli`
- `bin` — `art-workspace-cli`
- `path` — `cli/workspace`

**Changes:**

- Rename the package, its bin, and its path; update the manifest, the deployment record, the imports, the docs, the tests, and every `$PROJECT` reference to the old path and names.

**Operations:**

- Verify that `@art-works/workspace-cli` and `art-workspace-cli` references resolve after the rename; the `npm run art-work` workspace script keeps its name.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`, planning work in `$WORKSPACE/checkouts/art-work-building` on branch `building`, with record changes in `$WORKSPACE/_records`, `$ART_WORK/_records`, `$ARTIFICIALS/_records`, and `$NOODLESTAN_WEB/data`.

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name                                             | Status    |
| ----- | ------------------------------------------------ | --------- |
| 1     | Relocate planning artefacts into `cli/workspace` | `DONE`    |
| 2     | Rename repository and project to Art Works       | `ONGOING` |

### Phase: 1 — Relocate planning artefacts into `cli/workspace`

**Goal:** Give the Art Workspace Cli ownership of its roadmap and backlog before identities move, keeping the root trees free for repository-level planning.

**Description:** Move the remaining root `_roadmap/` and `_backlog/` entries into `$ART_WORK_CLI`, re-scaffold the emptied root trees with `.gitkeep` stages, verify both guides already describe the split, and leave no stale reference.

**Status:** `DONE`

**Dependencies:**

- None.

### Phase: 2 — Rename repository and project to Art Works

**Goal:** Repository and project read Art Works everywhere, with the `Art Work` identity surviving only in package and planned-member names and the kept checkout locations.

**Description:** Rename the GitHub repository, the in-repo and workspace records, the project reference in `$ARTIFICIALS`, and the generated project list in `$NOODLESTAN_WEB`, then rebuild and redeploy the website.

**Status:** `READY`

**Dependencies:**

- None.

---

## Items:

| Phase | Resource / Record                                                                                               | Status    |
| ----- | --------------------------------------------------------------------------------------------------------------- | --------- |
| 1     | Plan: Migrate Planning and Knowledge `$ART_WORK_CLI/_backlog/3-now/plan-migrate-planning-and-knowledge/plan.md` | `DONE`    |
| 2     | Plan: Rename Repo and Project `$ART_WORK_CLI/_backlog/3-now/plan-rename-repo-and-project/plan.md`               | `WORKING` |

---

## Work

### Next

Phase 2 is `ONGOING`: `rename-identity-records` is `DONE` (the identity records and the package identity are renamed) and `rename-workspace-records` is `SKIPPED` until the new CLI is installed and the workspaces restart.

### Blockers

- None.

---

## Operating Instructions

### Operating Instructions: Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the message following the rules defined there.

### Operating Instructions: Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the `$ART_WORK` root:

```bash
npm ci # to install dependencies.
```

Do NOT run `npm install` inside `$ART_WORK` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Operating Instructions: Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the `$ART_WORK` root:

```bash
npm run ci # lint, test and build
```

Runs automatically on the pre-commit hook. All steps MUST pass.

---

## Coordination

### Not In Scope

- **Checkout locations** — `Location: art-work-planning` and `Location: art-work-building` stay as they are; renaming them is a follow-up.
- **Application: Art Work Website (PLANNED)** — planned members of the project keep their names; renaming them is a separate decision.
- **Repository transfer** — only the repository name changes; it stays in the `noodlestan` org.
- **Workspace script name** — `npm run art-work` keeps its name; the workspace is out of scope for this round.
- **Archived records, changelogs, and decision records** — they keep the old names as history.

### Evidence

- **`noodlestan/art-works` resolves** and `noodlestan/art-work` redirects to it.
- **No stale identity** — searching `Art Work` (case-sensitive) across `$WORKSPACE/_records`, `$ART_WORK/_records`, `$ARTIFICIALS/_records`, and `$NOODLESTAN_WEB/data` returns only the new `Art Works` identity plus the planned-member names (`Art Work Website`, `Art Work Tool`); searching `art-work` returns only `art-works`, the kept checkout locations (`art-work-planning`, `art-work-building`), and the workspace script name (`npm run art-work`).
- **Website shows Art Works** — the rebuilt and redeployed site lists `Project: Art Works` with the new repository URL.

### Findings

- **Website project data is generated** — `$NOODLESTAN_WEB/data/_records/projects/*.art` come from `npm run update-project-records` and `data/projects/collection.json` from `npm run update-project-collection`; the rename edits the source records, then regenerates.
- **One record drives clones** — `$WORKSPACE/_records/repositories/art-work.art` feeds both `.art-workspace.mts` and the website copy script, so the file itself must be renamed, not only its contents.
- **Owner field is stale** — `$WORKSPACE/_records/repositories/art-work.art` declares `Owner: Project: Art JS` while `$ART_WORK/_records/project.art` declares `Project: Art Work`.

### Decisions

- **Migrate before rename** — planning artefacts settle in `$ART_WORK_CLI` first so the rename does not move paths twice.
- **GitHub rename first** — the repository is renamed before records are repointed, so GitHub redirects keep every old URL working during the switch.
- **Package keeps its name** — the repository and the project only are renamed, so the repository can host more CLIs and tools. Superseded on 2026-10-21: the package identity moved with the repository to `@art-works/workspace-cli` (bin `art-workspace-cli`, path `cli/workspace`).
- **The workspace records wait** (user, 2026-10-21) — the workspace records move after the new CLI is installed and the workspaces restart.

### Knowledge to Update

- `$ART_WORK/_guide.md` — guide title and repository description after the rename.
- `$ART_WORK_CLI/_guide.md` — repository-level mentions only; the package keeps its name.

### Follow Ups

- **Rename checkout locations** — `art-work-planning` and `art-work-building` to `art-works-*` once no session runs inside them.
- **Update Management references** — repoint `$MANAGEMENT` milestones and records that reference `art-work` paths.

### Feedback

- None.
