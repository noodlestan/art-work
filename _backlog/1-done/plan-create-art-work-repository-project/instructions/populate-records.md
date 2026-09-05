# Instructions: `populate-records`

**Plan:** `create-art-work-repository-project`

**Iteration Id:** `populate-records`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-art-work-repository-project/instructions/populate-records__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `populate-records`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                            |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                           |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                         |
| `$ART_DOMAINS` | Provided with prompt.        | Where this plan lives. Example: `$WORKSPACE/checkouts/art-domains-planning`        |
| `$ART_WORK`    | Provided with prompt.        | The new repository to create. Example: `$WORKSPACE/checkouts/art-work-building`    |
| `$ART_JS`      | Provided with prompt.        | Repo used to scaffold by copying. Example: `$WORKSPACE/checkouts/art-js-reference` |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `populate-records`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Populate the project, repository, and namespace records for the Art Work project: copy the template records (except scaffolders) from `$ART_JS`; Set Namespace: Art Work; Set Repository remote to `git@github.com:noodlestan/art-work.git`. Create `$ART_JS/_records/project.art` (root project record) based on the content of `$ART_DOMANS/cli/workspace/_records/project.art` (re-scoped). Set Project.Resources (Package: Workspace CLI, Application: Workspace Website PLANNED, Tool: Workspace Tool PLANNED).

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/3-now/plan-create-art-work-repository-project/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_JS/_records/namespace.art` (Source) — Template namespace record to copy and adapt.
- ::READ `$ART_JS/_records/project.art` (Source) — Template project record to copy and adapt.
- ::READ `$ART_JS/_records/repository.art` (Source) — Template repository record to copy and adapt.
- ::READ `$ART_JS/_records/license.art` (Source) — Template license record to copy as-is.
- ::READ `$ART_JS/_records/dependencies/` (Source) — Template dependency records to copy as-is.
- ::READ `$ART_JS/_records/scripts/` (Source) — Template script records to copy as-is.
- ::READ `$ART_DOMANS/cli/workspace/_records/project.art` (Source) — Current root project record (Project: Workspace) to re-scope for Art Work.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

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

## Changes

- Step 1 / 4 — Copy the template records (except scaffolders)
- Step 2 / 4 — Adapt the namespace, project, and repository records for Art Work
- Step 3 / 4 — Commit `populate-art-work-records` and push
- Step 4 / 4 — Report

## Steps

### Step `1 / 4` — Copy the template records (except scaffolders)

Copy the `_records` directory from `$ART_JS` to `$ART_WORK`, EXCLUDING the `scaffolders/` directory:

- `$ART_JS/_records/dependencies/` → `$ART_WORK/_records/dependencies/` (8 files, as-is)
- `$ART_JS/_records/license.art` → `$ART_WORK/_records/license.art` (as-is)
- `$ART_JS/_records/namespace.art` → `$ART_WORK/_records/namespace.art` (adapt in Step 2)
- `$ART_JS/_records/project.art` → `$ART_WORK/_records/project.art` (adapt in Step 2)
- `$ART_JS/_records/repository.art` → `$ART_WORK/_records/repository.art` (adapt in Step 2)
- `$ART_JS/_records/scripts/` → `$ART_WORK/_records/scripts/` (5 files, as-is)

Do NOT copy `$ART_JS/_records/scaffolders/`.

**Expected outcome:** `$ART_WORK/_records/` contains dependencies, license, namespace, project, repository, and scripts — no scaffolders.

### Step `2 / 4` — Adapt the namespace, project, and repository records for Art Work

**2a. `$ART_WORK/_records/namespace.art`:**

- `## Namespace: Art Work`
- **Purpose:** Workspace orchestration tools and applications for the Noodlestan ecosystem.
- **Description:** Tools and applications for managing multi-repository development environments.
- **Owner:** Project: Art Work
- Keep Author, Scaffolders, and License as in the template.

**2b. `$ART_WORK/_records/project.art`:**

Take the current content of `$ART_DOMAINS/cli/workspace/_records/project.art` (Project: Workspace) and re-scope it:

- `## Project: Art Work`
- **Purpose:** Manage multi-repository development environments for parallel planning and execution. (unchanged from source)
- **Description:** Tools for discovering projects, managing knowledge and context resources, and operating across multiple checkouts: cloning, visualizing, synchronizing, and executing commands. (unchanged from source)
- **Owner:** Project: Art Domains (unchanged from source)
- **Author:** Noodlestan Collective (unchanged from source)
- **Repository:** Repository: Art Work
- **Resources:**
  - Package: Workspace CLI
  - Application: Workspace Website (PLANNED)
  - Tool: Workspace Tool (PLANNED)
- **Private:** `false` (unchanged from source)
- **Management:** (unchanged from source)
- **License:** License: Noodlestan 2026 MIT (unchanged from source)

**2c. `$ART_WORK/_records/repository.art`:**

- `## Repository: Art Work`
- **Purpose:** Host and manage the Art Work workspace orchestration tools and applications, and their planning artefacts.
- **Description:** Monorepo containing the Art Work roadmap, workspace orchestration source code, and their backlogs.
- **Owner:** Project: Art Work
- **Remote:** `git@github.com:noodlestan/art-work.git`
- Keep the rest as in the template.

**Expected outcome:** the three records are scoped to Art Work; the license, dependencies, and scripts records are unchanged copies.

---

#### Commit: `populate-art-work-records`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
records(art-work): Populate project, repo, and namespace records.

- Copy template records (namespace, project, repository, license, dependencies, scripts).
- Set Namespace: Art Work.
- Root project record from cli/workspace/_records/project.art.
- Set Project.Resources and Repository remote art-work.git.
```

---

### Step `3 / 4` — Push

```bash
cd $ART_WORK
git push -u origin main
```

The GitHub repository `noodlestan/art-work` may not exist yet. If the push fails with `Repository not found`, do NOT report a blocker — record the deferred push in the report and continue. The push is executed once the repository is created on GitHub.

**Expected outcome:** the commit is pushed to `origin/main`, or the deferred push is recorded in the report.

---

### Step `4 / 4` — Report

Report according to the "How to Report Back to the Delegator" instructions, noting the push state (pushed or deferred).

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that `$ART_WORK/_records/` contains the copied records (no scaffolders) and that namespace, project, and repository records are scoped to Art Work with the correct remote.
- Verify that the project record carries the source content (Purpose, Description, Owner, Author, Management, License) with Repository: Art Work and the three Resources.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
