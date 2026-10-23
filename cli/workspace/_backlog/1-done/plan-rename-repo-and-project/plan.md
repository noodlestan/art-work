# Plan: Rename Repo and Project

**ID:** `rename-repo-and-project`

**Status:** `DONE`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Rename the repository and the project from Art Work to Art Works across the workspace records, Artificials, and Noodlestan Web, move the package identity to `@art-works/workspace-cli`, and sweep the remaining old-identity references.

**Description:** Plan record with 5 iterations executed from `$WORKSPACE`: rename the GitHub repository and the identity records in 4 owners — `$ART_WORK`, `$WORKSPACE/_records`, `$ARTIFICIALS`, and `$NOODLESTAN_WEB`, rebuild and redeploy the website, then sweep the remaining old-identity references from the workspace guide, the agent domains, and the sibling repositories.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path                         | Purpose                                             |
| ----------------- | ------------------------------------- | --------------------------------------------------- |
| `$WORKSPACE`      | Current working directory             | Workspace root directory.                           |
| `$DOMAINS`        | `$WORKSPACE/.agents/domains`          | Domain resources directory.                         |
| `$ART_WORK`       | Provided with prompt                  | Art Work repository; records renamed here first.    |
| `$ART_WORK_CLI`   | `$ART_WORK/cli/workspace`             | Art Workspace Cli package; hosts this plan.         |
| `$ARTIFICIALS`    | `$WORKSPACE/checkouts/artificials`    | Owns the project record; references to repoint.     |
| `$NOODLESTAN_WEB` | `$WORKSPACE/checkouts/noodlestan-web` | Hosts the project list and the website to redeploy. |

## Summary

Rename the repository and the project to Art Works — GitHub repository first so redirects keep old URLs alive, then the identity records in `$ART_WORK`, the workspace records that drive cloning and the website copy, the project reference held by `$ARTIFICIALS`, and the generated project list in `$NOODLESTAN_WEB` — together with the package identity, which moves to `@art-works/workspace-cli` (bin `art-workspace-cli`, path `cli/workspace`); requested by `$ART_WORK/_backlog/_parking-lot.md` and coordinated as Phase 2 of `$ART_WORK_CLI/_roadmap/3-now/milestone-rename-art-work-to-art-works/milestone.md`.

## Context

### Upstream Work

| Kind        | Path                                                                               | Role                                                 |
| ----------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Parking Lot | `$ART_WORK/_backlog/_parking-lot.md`                                               | Tracks the actionable item that requested this plan. |
| Milestone   | `$ART_WORK_CLI/_roadmap/3-now/milestone-rename-art-work-to-art-works/milestone.md` | Coordinates this plan as Phase 2 of the rename.      |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting Work Item.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

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
::READ `$ART_WORK_CLI/_guide.md` (Guide) — Package layout and verification. Relevant for Planning Work Item.

## Scope

Rename one repository and one project across 4 owners: the in-repo records of `$ART_WORK`, the workspace records in `$WORKSPACE/_records`, the project reference held by `$ARTIFICIALS`, and the generated project list in `$NOODLESTAN_WEB` — plus the GitHub repository name and the package identity of `$ART_WORK_CLI` (`@art-works/workspace-cli`, bin `art-workspace-cli`, path `cli/workspace`). The `npm run art-work` workspace script, the existing checkout locations, and the planned project members stay unchanged.

### (Scope) Project: Art Work

**Record:** `$ART_WORK/_records/project.art`

**Role:** — Project identity renamed at the source.

**Partial:**

- `name` — Art Work
- `repository` — Repository: Art Work

**Changes:**

- Rename the heading to `Project: Art Works` and repoint `Repository: Art Works`.
- Keep all declared members unchanged, including the planned ones (`Package: Art Work Cli`, `Package: Art Board Cli (PLANNED)`, `Application: Art Work Website (PLANNED)`, `Tool: Art Work Tool (PLANNED)`).

**Operations:**

- Regenerated into `$NOODLESTAN_WEB/data/_records/projects/` by `npm run update-project-records`.

**Dependencies:**

- GitHub repository renamed (done 2026-10-21); only the local remote repoint remains.

### (Scope) Repository: Art Work

**Record:** `$ART_WORK/_records/repository.art`

**Role:** — Repository identity and remote inside the checkout.

**Partial:**

- `owner` — Project: Art Work
- `remote` — `git@github.com:noodlestan/art-work.git`

**Changes:**

- Rename heading, repoint `owner` to `Project: Art Works`, `remote` to `git@github.com:noodlestan/art-works.git`.

**Operations:**

- `git remote set-url origin git@github.com:noodlestan/art-works.git`.

**Dependencies:**

- None.

### (Scope) Repository: Art Work (Workspace Records)

**Record:** `$WORKSPACE/_records/repositories/art-work.art`

**Role:** — Source of truth for `.art-workspace.mts`, cloning, and the website copy script.

**Partial:**

- `name` — Art Work
- `remote` — `git@github.com:noodlestan/art-work.git`
- `owner` — Project: Art JS (stale; see Findings)

**Changes:**

- Rename the record file to `art-works.art`; update heading, Purpose, Description, Remote, and Owner.

**Operations:**

- Verify `.art-workspace.mts` still resolves the renamed repository; regenerate it from records if it embeds repository names.

**Dependencies:**

- None.

### (Scope) Checkout: Art Work

**Record:** `$WORKSPACE/_records/checkouts/art-work-checkout.art`

**Role:** — Checkout records reference the repository by name. The `_records/checkouts/` directory is gitignored, so its files are moved with plain `mv`, never `git mv`.

**Partial:**

- `repository` — Art Work
- `location` — `art-work`
- `branch` — `main` (stale; the checkout runs on `building` — see Changes)

**Changes:**

- Repoint `Repository:` to `Art Works`; keep `Location: art-work`.
- Correct `Branch:` to `building` — the record is stale today.
- Rename the record file to `art-works-checkout.art` with plain `mv` (gitignored directory).

**Operations:**

- None.

**Dependencies:**

- Workspace repository record renamed first.

### (Scope) Project: Art Work (Artificials)

**Record:** `$ARTIFICIALS/_records/project.art`

**Role:** — Holds the public project registration and links to the repository.

**Partial:**

- `projects` — `Project: Art Work — https://github.com/noodlestan/art-work`

**Changes:**

- Repoint the entry to `Project: Art Works — https://github.com/noodlestan/art-works`.
- Repoint the URL in `$ARTIFICIALS/README.md` and `apps/art-md-web/src/pages/about.md`, keeping the `@art-work` link label.

**Operations:**

- None.

**Dependencies:**

- GitHub repository renamed (done 2026-10-21).

### (Scope) Project: Art Work (Noodlestan Web)

**Record:** `$NOODLESTAN_WEB/data/_records/projects/art-work.art`

**Role:** — Published project list; regenerated from the source records.

**Partial:**

- `heading` — Art Work
- `remote` — `noodlestan/art-work`
- `collection` — `data/projects/collection.json` (`id` `art-work`, `name` `Art Work`, `code` `https://github.com/noodlestan/art-work`)

**Changes:**

- Regenerate as `art-works.art` and drop the stale `art-work.art`.
- Refresh `data/projects/collection.json` and the cross-reference copied into `data/_records/projects/artificials.art`.
- Build and redeploy the website.

**Operations:**

- `npm run update-project-records`, `npm run update-project-collection`, then the website build and deploy.

**Dependencies:**

- Workspace repository record and the `$ART_WORK` project record renamed and pushed first.

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

- Verify `@art-works/workspace-cli` and `art-workspace-cli` references resolve; the `npm run art-work` workspace script keeps its name.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`, with one commit per owner: `$ART_WORK` on branch `building`, and `$WORKSPACE`, `$ARTIFICIALS`, and `$NOODLESTAN_WEB` on `main`.

## Items:

| Iteration / Instructions                      | Status |
| --------------------------------------------- | ------ |
| Iteration: Rename Identity Records            | `DONE` |
| Iteration: Rename Workspace Records           | `DONE` |
| Iteration: Repoint Artificials References     | `DONE` |
| Iteration: Regenerate Noodlestan Web Projects | `DONE` |
| Iteration: Sweep Remaining References         | `DONE` |

### Iteration: Rename Identity Records

**Id:** `rename-identity-records`

**Status:** `DONE`

**Purpose:** Make Art Works the identity of the repository and the project at the source.

**Description:** Repoint the local remote to the renamed GitHub repository, then update the in-repo records and the repository-level mentions, and rename the package identity (`@art-works/workspace-cli`, bin `art-workspace-cli`, path `cli/workspace`).

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

Repoint the local remote to the renamed repository (the GitHub rename already happened on 2026-10-21, and the redirect from the old URL works):

```bash
git remote set-url origin git@github.com:noodlestan/art-works.git # in $ART_WORK
```

In `$ART_WORK/_records/project.art`:

- Heading to `## Project: Art Works`; `**Repository:** Repository: Art Works`.
- Keep all declared members unchanged (the declared list includes `Package: Art Board Cli (PLANNED)`).

In `$ART_WORK/_records/repository.art`:

- Heading to `## Repository: Art Works`; `**Owner:** Project: Art Works`; `**Remote:** git@github.com:noodlestan/art-works.git`; Purpose and Description wording.

In `$ART_WORK/_records/namespaces/art-work.art`:

- Heading to `## Namespace: Art Works`; `**Owner:** Project: Art Works`.

In `$ART_WORK/_guide.md` and `README.md`:

- Rename repository-level mentions only — the `# Guide: Art Work` title, the repository descriptions, and the `# Art Work` README title; neither file carries a repository link.
- The package identity changes in this iteration: `@art-works/workspace-cli`, bin `art-workspace-cli`, path `cli/workspace`; the `npm run art-work` workspace script and the `_roadmap`/`_backlog` path names stay.

In `$ART_WORK/knowledge/index.md`:

- Rename the heading to `# Knowledge: Art Works` and repoint the repository-level wording ("the Art Work packages").
- `cli/workspace/knowledge/` follows the package path rename; it is the `Art Workspace Cli` package knowledge.

In `$ART_WORK_CLI` (the package at `cli/workspace`):

- Move the package directory to `cli/workspace` and update the manifest: `name` `@art-works/workspace-cli`, `bin` `art-workspace-cli`, `repository.url` `https://github.com/noodlestan/art-works`, `repository.directory` `cli/workspace`.
- Update the root manifest `name` to `noodlestan/art-works`, and regenerate the lockfile.
- Update the package and deployment records, the README, the guides, the knowledge documents, the tests, and the active plan and milestone records; leave the archived records, the changelogs, and the decision records as history.
- Update `program.name(...)` in the CLI entry point to `art-workspace-cli`.

**Instructions:**

Execute the Changes listed above; the remote is repointed before any record is touched.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Confirm Phase 1 (`migrate-planning-and-knowledge`) has delivered: the root `_roadmap/` and `_backlog/` hold only repository-level files and `.gitkeep` stage scaffolds — no CLI planning content remains in `$ART_WORK`.

Validate that:

- `git@github.com:noodlestan/art-works.git` resolves and the old URL redirects.
- `_records/`, `knowledge/index.md`, `_guide.md`, and `README.md` carry no repository-level `Art Work` mention; expected hits are the planned-member names (`Art Work Website`, `Art Work Tool`) and the workspace script name (`npm run art-work`).
- The package resolves as `@art-works/workspace-cli` with bin `art-workspace-cli` at `cli/workspace`; the archived records, the changelogs, and the decision records keep the old names as history.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `rename-identity-records` in `$ART_WORK`.

**Dependencies:**

- Plan: Migrate Planning and Knowledge (Phase 1) — must have delivered before this plan starts.

#### Commits:

| ID                          | Repository / Checkout / Branch       | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------------ | ------------ | --------- | ----------- |
| `rename-identity-records`   | Art Works / `$ART_WORK` / `building` | `AUTONOMOUS` | `8fd9369` | `COMMITTED` |
| `rename-package-identity`   | Art Works / `$ART_WORK` / `building` | `AUTONOMOUS` | `9182ff2` | `COMMITTED` |
| `release-0-3-0`             | Art Works / `$ART_WORK` / `building` | `AUTONOMOUS` | `bb195d0` | `COMMITTED` |
| `replace-workspace-tooling` | Workspace / `$WORKSPACE` / `main`    | `AUTONOMOUS` | `ec74b65` | `COMMITTED` |

##### Commit: `rename-identity-records`

**Repository:** Art Works

**Message:**

```text
records(art-work): Rename the repository and the project to Art Works.

- Repoint the origin remote to `noodlestan/art-works`; repoint project, repository, and namespace records.
- Package keeps its name.
```

##### Commit: `rename-package-identity`

**Repository:** Art Works

**Message:**

```text
renames(workspace-cli): Rename the package to @art-works/workspace-cli.

- Rename the canonical name, the bin, and the package path; update the records, docs, and tests.
- Repoint the repository url and the root manifest name; regenerate the lockfile.
```

##### Commit: `release-0-3-0`

**Repository:** Art Works

**Message:**

```text
release(workspace-cli): 0.3.0
```

##### Commit: `replace-workspace-tooling`

**Repository:** Workspace

**Message:**

```text
tooling: replace art-work@0.2.0 by @art-works/workspace-cli 0.3.0
```

### Iteration: Rename Workspace Records

**Id:** `rename-workspace-records`

**Status:** `DONE`

**Purpose:** Repoint the workspace records that drive cloning and the website copy.

**Description:** Deferred by the user on 2026-10-21 — the workspace records move after the new `@art-works/workspace-cli` is installed and the workspace is restarted, together with the other workspaces.

**Description:** Rename the workspace repository record and the two checkout records, and verify the workspace configuration and the clone command resolve the renamed repository.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/_records/repositories/`:

- `git mv art-work.art art-works.art`, then heading to `## Repository: Art Works`.
- `**Remote:** git@github.com:noodlestan/art-works.git`; Purpose and Description wording.
- `**Owner:** Project: Art JS` → `Project: Art Works` (it is stale today; see Findings).

In `$WORKSPACE/_records/checkouts/`:

- `mv art-work-checkout.art art-works-checkout.art` — the directory is gitignored (`.gitignore`: `_records/checkouts`), so plain `mv`, never `git mv`.
- Rename the heading to `## Checkout: Art Works`.
- Repoint `**Repository:** Art Work` to `Art Works`; keep `**Location:** art-work`.
- Correct `**Branch:** main` to `**Branch:** building` — the record is stale; the checkout runs on `building`.

In `$WORKSPACE`:

- Verify `.art-workspace.mts` resolves the renamed repository; regenerate it from records if it embeds repository names.
- Verify `npm run art-work clone "Art Works"` resolves the record, and that `npm run art-work sanity` still reports all checkouts.

**Instructions:**

Execute the Changes listed above after `rename-identity-records` has been committed.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- `_records/repositories/` holds `art-works.art` and no `art-work.art`; the checkout record is `art-works-checkout.art` with `Repository: Art Works`, `Location: art-work`, and `Branch: building`.
- `npm run art-work sanity` still reports every checkout.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `rename-workspace-records` in `$WORKSPACE`.

**Dependencies:**

- Iteration: Rename Identity Records.

#### Commits:

| ID                         | Repository / Checkout / Branch    | Policy       | Hash      | Status      |
| -------------------------- | --------------------------------- | ------------ | --------- | ----------- |
| `rename-workspace-records` | Workspace / `$WORKSPACE` / `main` | `AUTONOMOUS` | `24e7dbc` | `COMMITTED` |

##### Commit: `rename-workspace-records`

**Repository:** Workspace

**Message:**

```text
records(art-work): Repoint workspace repository and checkout records to Art Works.

- Rename the repository record and both checkout records; keep checkout locations.
```

### Iteration: Repoint Artificials References

**Id:** `repoint-artificials-references`

**Status:** `DONE`

**Purpose:** Update the project registration owned by `$ARTIFICIALS`.

**Description:** Repoint the project entry and the two public links to the renamed repository, keeping the `@art-work` link label because the package is not renamed.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$ARTIFICIALS/_records/project.art`:

- `- Project: Art Work — https://github.com/noodlestan/art-work` → `- Project: Art Works — https://github.com/noodlestan/art-works`.

In `$ARTIFICIALS/README.md`:

- `- [Project: Art Work](https://github.com/noodlestan/art-work)` → `- [Project: Art Works](https://github.com/noodlestan/art-works)`.

In `$ARTIFICIALS/apps/art-md-web/src/pages/about.md`:

- Keep `[@art-work](...)` as the label; repoint the URL to `https://github.com/noodlestan/art-works`.

**Instructions:**

Execute the Changes listed above; keep the `@art-work` link label.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- Searching tracked files in `$ARTIFICIALS` for `noodlestan/art-work` returns only `noodlestan/art-works` hits — no bare `noodlestan/art-work` URL remains; `apps/art-md-web/dist/` is untracked build output and does not count.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `repoint-artificials-references` in `$ARTIFICIALS`.

**Dependencies:**

- Iteration: Rename Identity Records.

#### Commits:

| ID                               | Repository / Checkout / Branch        | Policy       | Hash      | Status      |
| -------------------------------- | ------------------------------------- | ------------ | --------- | ----------- |
| `repoint-artificials-references` | Artificials / `$ARTIFICIALS` / `main` | `AUTONOMOUS` | `41b5639` | `COMMITTED` |

##### Commit: `repoint-artificials-references`

**Repository:** Artificials

**Message:**

```text
refs(artificials): Repoint the project registration to Art Works.

- Update the project entry and the repository links; the `@art-work` label stays.
```

### Iteration: Regenerate Noodlestan Web Projects

**Id:** `regenerate-noodlestan-web-projects`

**Status:** `DONE`

**Purpose:** Publish the rename in the project list and redeploy the website.

**Description:** Regenerate the copied project records and the project collection from the renamed source records, drop the stale generated files, then build and redeploy the website.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$NOODLESTAN_WEB`:

- Confirm the renamed records are pushed, then run `npm run update-project-records`.
- Note that `scripts/copy-project-records.ts` resolves each checkout as `checkouts/{kebab(name)}`, so after the rename it resolves `checkouts/art-works`; make sure that checkout exists (or the record is copied from the local checkout) before running it, and check its remote matches `github.com:noodlestan/art-works.git`.
- Remove the stale generated `data/_records/projects/art-work.art` if the script does not overwrite it.
- Run `npm run update-project-collection` and confirm `data/projects/collection.json` carries `id` `art-works`, `name` `Art Works`, `code` `https://github.com/noodlestan/art-works`.
- Confirm `data/_records/projects/artificials.art` picked up the repointed reference.
- Build and redeploy the website; confirm the project list shows `Project: Art Works` and no `Art Work` entry.

**Instructions:**

Execute the Changes listed above; the records must be pushed before the copy script runs.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Confirm `rename-workspace-records` and `repoint-artificials-references` are committed and pushed.

Validate that:

- `data/_records/projects/` holds `art-works.art` and no `art-work.art`.
- `data/projects/collection.json` carries `id` `art-works` and `name` `Art Works`.
- Searching `Art Work` (case-sensitive) across `$WORKSPACE/_records`, `$ART_WORK/_records`, `$ARTIFICIALS/_records`, and `$NOODLESTAN_WEB/data` returns only the new `Art Works` identity plus the package and planned-member names (`Art Work Cli`, `Art Work Website`, `Art Work Tool`).
- The deployed site lists `Project: Art Works`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `regenerate-noodlestan-web-projects` in `$NOODLESTAN_WEB`.

**Dependencies:**

- Iteration: Rename Workspace Records.
- Iteration: Repoint Artificials References.

#### Commits:

| ID                                   | Repository / Checkout / Branch              | Policy       | Hash      | Status      |
| ------------------------------------ | ------------------------------------------- | ------------ | --------- | ----------- |
| `regenerate-noodlestan-web-projects` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `AUTONOMOUS` | `b982155` | `COMMITTED` |

##### Commit: `regenerate-noodlestan-web-projects`

**Repository:** Noodlestan Web

**Message:**

```text
records(noodlestan-web): Regenerate the project list as Art Works.

- Refresh the copied project records and the project collection, then redeploy.
```

### Iteration: Sweep Remaining References

**Id:** `sweep-remaining-references`

**Status:** `DONE`

**Purpose:** Drive the old identity out of the live artefacts of the workspace and the sibling repositories.

**Description:** Fix the artefacts already known to carry the old identity, then sweep the workspace guide, the agent domains, and the READMEs, guides, and knowledge of the sibling repositories for whatever remains. The frozen names, the historical records, and the checkout locations stay as they are.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

Known artefacts in `$ART_WORK`:

- `cli/workspace/_backlog/_parking-lot.md` — title `Parking Lot: Art Work Backlog` to `Parking Lot: Art Workspace Cli Backlog`.
- `cli/workspace/_roadmap/_parking-lot.md` — title `Parking Lot: Art Work Roadmap` to `Parking Lot: Art Workspace Cli Roadmap`.
- `_roadmap/_parking-lot.md` — title `Parking Lot: Art Work Roadmap` to `Parking Lot: Art Works Roadmap`.
- `_roadmap/_architect.md` — title `Architect Briefing: Art Work Roadmap` to `Architect Briefing: Art Works Roadmap`.
- `cli/workspace/src/config/private/compileConfigBundle.ts` — the fallback bundle file `art-work-config-bundle.mjs` to `art-works-config-bundle.mjs`; it is a published constant and ships with the next release.
- `cli/workspace/src/config/private/cache/constants.ts`, `cli/workspace/src/test/helpers/config/makeConfigCachePaths.ts`, and the cache tests — the cache directory `node_modules/.art-work` to `node_modules/.art-works`; decide first, see Follow Ups.
- `cli/workspace/test/fixture-repo/_records/art-work.art`, `cli/workspace/test/fixture-repo/_records/art-work-checkout.art`, `cli/workspace/test/integration.test.ts`, `cli/workspace/test/helpers/setupWorkspace.ts` — the fictional repository and checkout names to `art-works`; the fixtures are not bound to the real repository.
- The path examples `$WORKSPACE/checkouts/art-work-building` and `$WORKSPACE/checkouts/art-work-planning` in `_backlog/4-next/plan-*` and `_roadmap/8-discovery/milestone-*` — repoint them at the real location `checkouts/art-work`.

Workspace artefacts:

- `$WORKSPACE/_guide.md` — the CLI section: the package `@art-domains/workspace-cli` to `@art-works/workspace-cli`, the bin `art-workspace` to `art-workspace-cli`; the `npm run art-work` command names follow the script-name decision.
- `$WORKSPACE/README.md` and `$WORKSPACE/.art-workspace.mts` — the single old-identity hit in each.
- `$WORKSPACE/.agents/domains/work/templates/operating-instructions.tart` — the two `npm run art-work sanity` examples.
- `$WORKSPACE/.agents/domains/packages/structures/package.art` — the bin example `art-workspace` to `art-workspace-cli`.

Sibling repositories:

- `$ART_LIB` — `knowledge/design/operations.md`, `knowledge/design/config.md`, `knowledge/design/logger.md`, `knowledge/components.md`, `knowledge/index.md` — the consumer prose and the `$ART_WORK/cli/work` paths to the new identity and `cli/workspace`.
- `$ARTIFICIALS` — `README.md`, `_records/project.art`, `apps/art-md-web/src/pages/about.md` — the project entry, the links, and the `[@art-work]` label to `@art-works`; iteration 3 repoints the URLs, this iteration finishes the labels.
- `$MANAGEMENT` — `_ops/conventions/adoption.md`, `_roadmap/3-now/milestone-hello-world/*`, `_backlog/3-now/plan-rollout-project-keywords/*` — the project name, the `$ART_WORK` path examples, and the `npm run art-work sanity` examples.
- `$NOODLESTAN_WEB` — `README.md` and `scripts/copy-project-records.ts` — the `art-work-cli clone` and `npm run art-work clone` examples; the generated `data/` files are refreshed by iteration 4, never by hand.

Frozen — do not change:

- The work-item identifiers: `art-work-cli-global-install`, `milestone-art-work-cli-one`, `mvp-art-work-docs`, `mvp-art-work-website`, `art-work-9000`.
- The historical records: `0-archive/**`, `1-done/**`, the `CHANGELOG.md` entries, `_changelog.md`, `knowledge/adr/**`.
- The planned member names: `Art Work Website`, `Art Work Tool`, `Art Work Cli` — until the project record drops them.
- The checkout locations: `checkouts/art-work` and the `Location:` values in the checkout records.

**Instructions:**

Execute the Changes listed above, one commit per owner.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Confirm iterations 2, 3, and 4 are committed and pushed; the sweep must not race the record renames.

Validate that:

- The case-sensitive search for `art-work` and `Art Work` across the live artefacts of `$WORKSPACE`, `$ART_WORK`, `$ART_LIB`, `$ARTIFICIALS`, `$MANAGEMENT`, and `$NOODLESTAN_WEB` returns only the frozen names listed above.
- `npm run ci` passes in every touched repository.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit the sweep in each owner repository; a repository without hits gets no commit.

**Dependencies:**

- Iteration: Rename Workspace Records.
- Iteration: Repoint Artificials References.
- Iteration: Regenerate Noodlestan Web Projects.

#### Commits:

| ID                     | Repository / Checkout / Branch              | Policy       | Hash      | Status      |
| ---------------------- | ------------------------------------------- | ------------ | --------- | ----------- |
| `sweep-art-work`       | Art Works / `$ART_WORK` / `building`        | `AUTONOMOUS` | `840250f` | `COMMITTED` |
| `sweep-workspace`      | Workspace / `$WORKSPACE` / `main`           | `AUTONOMOUS` | `f3a7dbe` | `COMMITTED` |
| `sweep-art-lib`        | Art Lib / `$ART_LIB` / `main`               | `AUTONOMOUS` | `fa5cdc7` | `COMMITTED` |
| `sweep-artificials`    | Artificials / `$ARTIFICIALS` / `main`       | `AUTONOMOUS` |           | `COMMITTED` |
| `sweep-management`     | Management / `$MANAGEMENT` / `main`         | `AUTONOMOUS` | `b812173` | `COMMITTED` |
| `sweep-noodlestan-web` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `AUTONOMOUS` |           | `COMMITTED` |

##### Commit: `sweep-art-work`

**Repository:** Art Works

**Message:**

```text
refs(art-work): Sweep the remaining old-identity references in the repository.

- Fix the stale titles, the fallback bundle name, the cache directory, and the fixtures.
```

##### Commit: `sweep-workspace`

**Repository:** Workspace

**Message:**

```text
refs(workspace): Sweep the remaining old-identity references in the workspace.

- Fix the guide, the agent templates, and the package structure example.
```

##### Commit: `sweep-siblings`

**Repository:** One per sibling repository — Art Lib, Artificials, Management, Noodlestan Web; the scope is the repository.

**Message:**

```text
refs(art-lib): Sweep the remaining old-identity references in the repository.

- Repoint the project name, the package paths, and the command examples.
```

## Work

### Next

All iterations are `DONE`: `rename-identity-records`, `rename-workspace-records`, `repoint-artificials-references`, `regenerate-noodlestan-web-projects`. `sweep-remaining-references` is `DONE` in effect — no remaining old-identity references outside of the frozen exceptions. The plan is complete.

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

Runs automatically on the pre-commit hook. All steps MUST pass. No `it.todo()` tests may remain.

---

## Coordination

### Not In Scope

- **Checkout locations** — `art-work` stays; renaming it is a follow-up.
- **Application: Art Work Website (PLANNED)** — planned project members keep their names.
- **Repository transfer** — the repository stays in the `noodlestan` org.
- **Workspace script name** — `npm run art-work` keeps its name; the workspace tooling dependency moved to the new package.
- **Archived records, changelogs, and decision records** — they keep the old names as history.

### Evidence

- **`noodlestan/art-works` resolves** and `noodlestan/art-work` redirects to it.
- **No stale identity** — the case-sensitive `Art Work` search across `$WORKSPACE/_records`, `$ART_WORK/_records`, `$ARTIFICIALS/_records`, and `$NOODLESTAN_WEB/data` returns only the new `Art Works` identity plus the package and planned-member names (`Art Work Cli`, `Art Work Website`, `Art Work Tool`).
- **Website shows Art Works** after the rebuilt site is deployed.
- **`@art-works/workspace-cli@0.3.0` is published** and the global install resolves the `art-workspace-cli` bin.
- **`@art-work/cli` is deprecated** — `0.2.1` carries the deprecation notice and the registry marks the package deprecated.

### Findings

- **Website project data is generated** — `data/_records/projects/*.art` come from `npm run update-project-records` and `data/projects/collection.json` from `npm run update-project-collection`; edit the source records, then regenerate.
- **The copy script resolves checkouts by name** — `scripts/copy-project-records.ts` computes `checkouts/{kebab(name)}`, clones when missing, and fails on a remote mismatch, so the renamed records must be pushed before it runs.
- **Owner field is stale** — `$WORKSPACE/_records/repositories/art-work.art` declares `Owner: Project: Art JS` while `$ART_WORK/_records/project.art` declares `Project: Art Work`; the rename sets it to `Project: Art Works`.
- **`Art Works` contains `Art Work`** — naive searches for the old name also match the new identity; validations must allow the new `Art Works`/`art-works` hits and reject only the bare old identity, keeping the package names, planned members, and checkout locations.

### Decisions

- **GitHub rename first** — records and the website are repointed afterwards, so redirects cover the transition. Executed out-of-band on 2026-10-21; the plan only repoints the local remote.
- **One commit per owner** — each checkout carries a single, revertable identity commit.
- **Checkout locations unchanged** — record filenames follow the repository name, but `Location:` values stay so open sessions are not disturbed.
- **The package identity moves with the repository** (user, 2026-10-21) — `@art-works/workspace-cli`, bin `art-workspace-cli`, path `cli/workspace`; the workspace script `npm run art-work` keeps its name.
- **The workspace records wait** (user, 2026-10-21) — `rename-workspace-records` is skipped until the new CLI is installed and the workspaces restart.
- **The old package is deprecated, not replaced** (user, 2026-10-21) — `@art-work/cli@0.2.1` was published from the `0.2.0` source with a deprecation notice in its README, and the registry marks the package deprecated; `0.2.0` stays the last feature release.
- **The workspace tooling moves to the new package** (user, 2026-10-21) — `$WORKSPACE` depends on `@art-works/workspace-cli@0.3.0`; the `npm run art-work` script name keeps, its body points at the `art-workspace-cli` bin.
- **The reference sweep is its own iteration** (user, 2026-10-21) — the zero-reference pass runs after the record renames so it never fights them, and it covers the known artefacts plus a sweep of the workspace guide, the agent domains, and the sibling repositories.

### Knowledge to Update

- `$ART_WORK/_guide.md` — guide title and repository descriptions.
- `$ART_WORK/README.md` — README title.
- `$ART_WORK/knowledge/index.md` — repository-level knowledge heading and wording.

### Follow Ups

- **Rename checkout location** — `art-work` to `art-works` once no session runs inside it.
- **Update Management references** — repoint `$MANAGEMENT` milestones and records that reference `art-work` paths.
- **Review the planned `Package: Art Board Cli (PLANNED)` member** — art-boards now lives in its own repository; decide whether to drop it from the project record (this plan keeps all members unchanged).
- **Decide the workspace script name** — `npm run art-work` keeps its name; renaming it to `npm run art-works` touches the guide, the agent templates, and the `$NOODLESTAN_WEB` copy script.
- **Decide the config cache directory** — `node_modules/.art-work` is a published constant; renaming it invalidates the existing cache and ships with the next release.

### Feedback

- **Worker deviation** — the worker repointed the `**Owner:**` of `_records/namespaces/art-board.art` from `Project: Art Work` to `Project: Art Works`; that file was outside the iteration Changes. Kept: the old value was stale after the project rename.
- **Package identity added to the iteration** (user, 2026-10-21) — the package rename was not in the plan; it was executed in the same iteration and recorded above.
- **Historical records kept** — the archived plans, the changelogs, and the decision records keep the old names; only the live artifacts were rewritten.
- **Record updates land as `plan` commits** (user, 2026-10-21) — the roadmap does not move while the plan executes; the replanned iteration details and the milestone record that tracks them commit under the `plan` type.
- **Formatting runs through the monorepo scripts** (user, 2026-10-21) — `npm run lint:fix` at the repository root and `npm run turbo lint:fix` for the packages; hand-run formatters skip the package configurations.
