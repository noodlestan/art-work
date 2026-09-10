# Plan: Extract Read/Write Records to Art Cli

**ID:** `extract-read-write-records-art-lib`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Extract the generic record read/write modules into a shared library in the art-lib repository.

**Description:** Create Package: Lib Records in art-lib (canonical `@art-lib/fs-records`, path `libs/records`); extract the generic record read/write modules and their tests from art-work-cli; register the lib in the Art Cli project record; publish the lib; consume it in art-work-cli; update knowledge; publish a new art-work-cli version; test in `$WORKSPACE`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                                     |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                                                    |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                                                  |
| `$ART_CLI`   | Provided with prompt.        | Where the functions are being migrated to. Example: `$WORKSPACE/checkouts/art-lib-building` |
| `$ART_WORK`  | Provided with prompt.        | Repo currently containing the functions. Example: `$WORKSPACE/checkouts/art-work-building`  |

## Summary

Create Package: Lib Records in art-lib (`@art-lib/fs-records`, path `libs/records`); extract the generic record read/write modules and their tests from art-work-cli; register, publish, consume; publish a new art-work-cli version; test in `$WORKSPACE`.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                                |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers.     |
| Architecture Briefing | `_roadmap/_architect.md`                                           | Art Work principles, NFRs, milestones.                              |
| Milestone             | `$ART_WORK/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Coordinates this plan as Phase 3 of the Art Work Cli One milestone. |

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

Create the Lib Records package in art-lib; extract the generic record read/write modules and their tests from art-work-cli; register the lib in the Art Cli project record; publish the lib; consume it in art-work-cli; update knowledge; publish a new art-work-cli version; test in `$WORKSPACE`.

## Work

### Next

- None.

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

**Instructions:** (From `$ART_WORK/_guide.md`)

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

| Iteration / Instructions                  | Status |
| ----------------------------------------- | ------ |
| Iteration: Create Lib Records Package     | `DONE` |
| Iteration: Extract Record Modules         | `DONE` |
| Iteration: Consume Art Cli FS Records Lib | `DONE` |

### Iteration: Consume Art Cli FS Records Lib

**Id:** `register-publish-consume`

**Status:** `DONE`

**Purpose:** Register the lib, publish it, and consume it in art-work-cli.

**Description:** Register the lib in the Art Cli project record; publish the lib; consume it in art-work-cli; update knowledge; publish a new art-work-cli version; test in `$WORKSPACE`.

**Instructions:** `./plan-extract-read-write-records-art-lib/instructions/register-publish-consume.md`

**Changes:**

- Register the lib in the Art Cli project record.
- Publish the lib.
- Consume the lib in art-work-cli.
- Update knowledge in art-lib and art-work.
- Publish a new art-work-cli version.
- Test in `$WORKSPACE`.

**Dependencies:**

- Plan: Extract Read/Write Records to Art Cli `$ART_LIB/_backlog/0-archive/plan-extract-read-write-records-art-lib/plan.md`

#### Commits:

| ID                                    | Repository / Checkout / Branch  | Policy       | Hash      | Status     |
| ------------------------------------- | ------------------------------- | ------------ | --------- | ---------- |
| `consume-lib-records-in-art-work-cli` | Art Work / `$ART_WORK` / `main` | `AUTONOMOUS` | `c9438e8` | `AUTHORED` |

##### Commit: `consume-lib-records-in-art-work-cli`

**Message:**

```
refactor(art-work): consume @art-lib/fs-records in art-work-cli

- Replace local record read/write modules with imports from @art-lib/fs-records.
- Update package record and dependencies.
- Update knowledge in art-lib and art-work.
```

---

## Coordination

### Not In Scope

- Creating the art-lib repository (tracked in Plan: Create Art Cli Project and Repo).
- Moving the art-work-cli source code (tracked in Plan: Extract Art Work Cli to Art Work).
- Generating the art-lib ecosystem roadmap notes (future plan, not yet tracked).

### Evidence

- None.

### Findings

- The extraction spans two repos: modules are copied to art-lib (`libs/records`) while art-work-cli keeps its local copies until the lib is published and consumed.
- Consumption replaces the local modules in art-work-cli with imports from `@art-lib/fs-records`, followed by a new art-work-cli release.

### Decisions

- Package: Lib Records, canonical `@art-lib/fs-records`, path `libs/records`.
- Commit order: create package → extract modules → register + publish lib → consume in art-work-cli → release art-work-cli.

### Knowledge to Update

- Update knowledge in art-lib and art-work.
- Update the art-work-cli package record after consuming the lib.

### Follow Ups

- None.

### Feedback

- None.
