# Plan: Make Art Work Cli work from global install

**ID:** `art-work-cli-global-install`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Make the Art Work Cli work correctly when installed globally.

**Description:** Update the Art Work Cli so that its globally installed executable can discover and operate on an Art Work workspace without relying on the CLI being invoked from its repository or from a local monorepo installation. Ensure the package, executable, runtime path resolution, and workspace discovery remain correct for both local development and global installation.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`  | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-building` |

## Summary

Make the Art Work Cli executable and operational when installed globally, while preserving local development and monorepo usage. Update the CLI implementation and package metadata as required, and verify both invocation modes.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                                |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers.     |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                 | Art Work principles, NFRs, milestones.                              |
| Milestone             | `$ART_WORK/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Coordinates this plan as Phase 3 of the Art Work Cli One milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK/_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.

::READ `$ART_WORK/cli/work/architecture/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Update the Art Work Cli so that the globally installed executable can locate its runtime and operate against the intended Art Work workspace independently of the CLI's source checkout. Preserve local development behaviour and existing workspace discovery semantics unless they are specifically identified as the cause of the global-install failure.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_WORK` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

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

Additionally verify the CLI from a global installation and from the local development environment. All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions                  | Status |
| ----------------------------------------- | ------ |
| Iteration: Make CLI Global-Install Safe   | `TODO` |
| Iteration: Verify Global CLI Installation | `TODO` |

### Iteration: Make CLI Global-Install Safe

**Id:** `make-cli-global-install-safe`

**Status:** `TODO`

**Report:** `./plan-make-art-work-cli-work-from-global-install/instructions/make-cli-global-install-safe__report.md`

**Purpose:** Make the Art Work Cli executable independently of its source checkout when installed globally.

**Description:** Identify and remove assumptions that the CLI is being executed from the Art Work repository or monorepo installation. Update runtime path resolution, package metadata, executable configuration, and workspace discovery as required so a globally installed `art-work-cli` can resolve its own runtime and operate on an Art Work workspace.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/make-cli-global-install-safe.md`

**Changes:**

- Identify the source of the global-install failure.
- Update CLI runtime and path resolution so it does not depend on the current CLI source checkout.
- Update package metadata or executable configuration where required for global installation.
- Preserve local repository and monorepo invocation.
- Add or update tests covering the global-install execution path.

**Dependencies:**

- None.

#### Commits:

| ID                                 | Repository / Checkout / Branch      | Policy       | Hash | Status |
| ---------------------------------- | ----------------------------------- | ------------ | ---- | ------ |
| `make-art-work-cli-global-install` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `TODO` |

##### Commit: `make-art-work-cli-global-install`

**Message:**

```text
fix(art-work): Make CLI work from global install.

- Remove runtime assumptions tied to the CLI source checkout.
- Ensure the packaged executable resolves its runtime correctly.
- Preserve local CLI execution.
```

### Iteration: Verify Global CLI Installation

**Id:** `verify-global-cli-installation`

**Status:** `TODO`

**Report:** `./plan-make-art-work-cli-work-from-global-install/instructions/verify-global-cli-installation__report.md`

**Purpose:** Verify that the published/package-installed Art Work Cli works as a global executable.

**Description:** Build and package the CLI, install the resulting package globally in an isolated environment, invoke `art-work-cli` from outside the Art Work repository, and verify that it can discover and operate on an Art Work workspace. Also verify that local development invocation remains functional.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/verify-global-cli-installation.md`

**Changes:**

- Build the Art Work Cli package.
- Install the package globally in an isolated test environment.
- Invoke `art-work-cli` from outside the repository containing its source.
- Verify workspace discovery and representative CLI operations.
- Verify local development invocation still works.

**Dependencies:**

- `make-cli-global-install-safe` — the global-install implementation must be complete before verification.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ------ |
| `verify-art-work-global-cli` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `TODO` |

##### Commit: `verify-art-work-global-cli`

**Message:**

```text
test(art-work): Verify CLI global installation.

- Verify the packaged CLI can be installed globally.
- Verify execution outside the source repository.
- Verify workspace discovery and local execution remain functional.
```

---

## Coordination

### Not In Scope

- Changing the Art Work Cli command model or workspace domain model.
- Extracting the record read/write modules (tracked in Plan: Extract Read/Write Records to Art Cli).
- Changes unrelated to making the CLI work from a global installation.

### Evidence

- Global installation can execute `art-work-cli` without requiring the Art Work source checkout to be the current or module-resolution directory.
- Representative workspace operations work from outside the CLI source repository.
- Local development invocation continues to work.
- Build, lint, and tests pass.

### Findings

- To be completed during implementation.

### Decisions

- The CLI must support both local development and global installation.
- Global execution must not depend on the CLI being invoked from its source repository.
- Workspace discovery remains based on the existing workspace model rather than introducing a separate global-install-specific workflow.

### Knowledge to Update

- Update Art Work Cli documentation with the supported global installation and invocation model.
- Update any stale knowledge describing the CLI as requiring local monorepo execution.

### Follow Ups

- None identified.

### Feedback

- None.
