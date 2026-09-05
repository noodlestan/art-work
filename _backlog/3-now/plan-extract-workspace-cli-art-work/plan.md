# Plan: Extract Workspace Cli to Art Work

**ID:** `extract-workspace-cli-art-work`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Move the workspace-cli source code from art-domains to the art-work repository and update the package record.

**Description:** Move the workspace-cli source code to `art-work/cli/workspace` (Art Work remains a monorepo; the cli source stays in `cli/workspace`). The project record is NOT migrated (already copied to the root of Art Work in Plan: Create Art Work Repository and Project). Update the package record: Owner: Project: Art Work, Namespace: Namespace: Art Work, Path: `cli/workspace`, Canonical Name: `@art-work/cli`, Bin: `art-work-cli: ./dist/index.js`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                                 |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                                |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                              |
| `$ART_WORK`    | Provided with prompt.        | Where the Cli is being miagrated to. Example: `$WORKSPACE/checkouts/art-work-building`  |
| `$ART_DOMAINS` | Provided with prompt.        | Repo currently containing the Cli. Example: `$WORKSPACE/checkouts/art-domains-building` |

## Summary

Move the workspace-cli source code to `$ART_WORK/cli/work` and update the package record (Owner: Project: Art Work, Namespace: Namespace: Art Work, Path: `cli/work`, Canonical Name: `@art-work/cli`, Bin: `art-work-cli`) and remove it from `$ART_DOMAINS`.

## Context

### Upstream Work

| Kind                  | Path                                                                   | Role                                                                 |
| --------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Parking Lot           | `$ART_DOMAINS/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers.      |
| Architecture Briefing | `$ART_DOMAINS/_roadmap/_architect.md`                                  | Workspace principles, NFRs, milestones.                              |
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

Move the workspace-cli source code from `$ART_DOMAINS/cli/workspace` to `$ART_WORK/cli/work`; update the package record with the new owner, namespace, path, canonical name, and bin. The project record is not migrated (already copied to the root of Art Work).

## Work

### Next

Delegate the `READY` iterations: `move-workspace-cli-source`, `update-package-record` (instructions written under `./plan-extract-workspace-cli-art-work/instructions/`).

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_WORK` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

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

| Iteration / Instructions             | Status  |
| ------------------------------------ | ------- |
| Iteration: Move Workspace Cli Source | `READY` |
| Iteration: Update Package Record     | `READY` |

### Iteration: Move Workspace Cli Source

**Id:** `move-workspace-cli-source`

**Status:** `READY`

**Purpose:** Move the workspace-cli source code to the art-work repository.

**Description:** Move the workspace-cli source code from `$ART_DOMAINS/cli/workspace` to `$ART_WORK/cli/work`. Art Work is also a monorepo; the cli source code path in the target is `cli/work`. The project record is not migrated.

**Instructions:** `./plan-extract-workspace-cli-art-work/instructions/move-workspace-cli-source.md`

**Changes:**

- Move the workspace-cli source code to `$ART_WORK/cli/work`.
- Remove from `$ART_DOMAINS/cli/workspace` (Art Work remains a monorepo).
- Do not migrate the project record (already copied to the root of Art Work).

**Dependencies:**

- Plan: Create Art Work Repository and Project — the art-work repo must exist first.

#### Commits:

| ID                            | Repository / Checkout / Branch            | Policy       | Hash | Status     |
| ----------------------------- | ----------------------------------------- | ------------ | ---- | ---------- |
| `move-workspace-cli-source`   | Art Work / `$ART_WORK` / `building`       | `AUTONOMOUS` | -    | `AUTHORED` |
| `remove-workspace-cli-source` | Art Domains / `$ART_DOMAINS` / `building` | `AUTONOMOUS` | -    | `AUTHORED` |

##### Commit: `move-workspace-cli-source`

**Message:**

```
build(art-work): Move workspace-cli from Art Domains.
```

##### Commit: `remove-workspace-cli-source`

**Message:**

```
clean(workspace-cli): Remove workspace-cli (source moved to Art Work).
```

### Iteration: Update Package Record

**Id:** `update-package-record`

**Status:** `READY`

**Purpose:** Update the workspace-cli package record for its new home in Art Work.

**Description:** Update the package record: Owner: Project: Art Work, Namespace: Namespace: Art Work, Path: `cli/workspace`, Canonical Name: `@art-work/cli`, Bin: `art-work-cli: ./dist/index.js`. Keep package.json and the npm-deployment record consistent with the new canonical name.

**Instructions:** `./plan-extract-workspace-cli-art-work/instructions/update-package-record.md`

**Changes:**

- Set Package.Owner: Project: Art Work.
- Set Package.Namespace: Namespace: Art Work.
- Set Package.Path: `cli/workspace`.
- Set Package.CanonicalName: `@art-work/cli`.
- Set Package.Bin: `art-work-cli: ./dist/index.js`.
- Update package.json: name `@art-work/cli`, bin `art-work-cli`, repository url `https://github.com/noodlestan/art-work`, directory `cli/workspace`.
- Update the npm-deployment record canonical name to `@art-work/cli`.

**Dependencies:**

- `move-workspace-cli-source` — the source must be moved before the package record is updated.

#### Commits:

| ID                                    | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ------------------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `update-workspace-cli-package-record` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` | -    | `AUTHORED` |

##### Commit: `update-workspace-cli-package-record`

**Message:**

```
records(art-work): Update Work Cli package record to Art Work.

- Set Owner: Project: Art Work, Namespace: Namespace: Art Work.
- Set Path: cli/workspace, Canonical Name: @art-work/cli, Bin: art-work-cli.
- Update package.json name, bin, and repository to match.
- Update npm-deployment canonical name to @art-work/cli.
```

---

## Coordination

### Not In Scope

- Creating the art-work repository (tracked in Plan: Create Art Work Repository and Project).
- Extracting the record read/write modules (tracked in Plan: Extract Read/Write Records to Art Cli).

### Evidence

- None.

### Findings

- The move spans two repositories: the source is added to art-work (`cli/workspace`) and removed from art-domains; each side commits separately.
- The project record is not migrated — it was already copied to the root of Art Work in Plan: Create Art Work Repository and Project.

### Decisions

- Art Work remains a monorepo; the cli source stays in `cli/workspace`.
- The project record is not migrated (already copied to the root of Art Work).
- Canonical name becomes `@art-work/cli`; bin becomes `art-work-cli`.
- Commit order: add source in art-work → remove source in art-domains → update package record in art-work.

### Knowledge to Update

- Update the art-domains project record and guide (no longer owns workspace-cli — art-work does).
- Update READMEs, knowledge, and stale checks in artificials, art-domains, and art-js referencing workspace-cli under art-domains.

### Follow Ups

- Update READMEs, knowledge, and stale checks in artificials, art-domains, and art-js referencing workspace-cli under art-domains (tracked in Knowledge to Update).

### Feedback

- None.
