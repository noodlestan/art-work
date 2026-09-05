# Instructions: `create-repository`

**Plan:** `create-art-work-repository-project`

**Iteration Id:** `create-repository`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-art-work-repository-project/instructions/create-repository__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-repository`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-repository`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the `noodlestan/art-work` repository at `$ART_WORK`, scaffolded from the art-js-reference template: dotfiles, lint configs, license, README, package.json, tsconfig, turbo.json, lefthook.yml, an empty architecture index, and the parking lots. Add the `_guide.md`. Initialize git with the initial commits.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/3-now/plan-create-art-work-repository-project/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_JS/package.json` (Source) — Template package.json to copy and adjust.
- ::READ `$ART_JS/README.md` (Source) — Template README to adapt for Art Work.
- ::READ `$ART_JS/_guide.md` (Source) — Template guide to model the art-work guide on.
- ::READ `$ART_JS/architecture/index.md` (Source) — Template architecture index; replaced with an empty index.

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
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 5 — Create the art-work repo skeleton from the template
- Step 2 / 5 — Commit `scaffold-art-work-repository`
- Step 3 / 5 — Add the `_guide.md` and commit `add-art-work-guide`
- Step 4 / 5 — Set the remote and push (deferred if the GitHub repo does not exist yet)
- Step 5 / 5 — Report

## Steps

### Step `1 / 5` — Create the art-work repo skeleton from the template

**1a. Create the destination directory:**

```bash
mkdir -p $ART_WORK
```

**1b. Copy the skeleton files from `$ART_JS`:**

- Dotfiles: `.eslintrc.cjs`, `.gitignore`, `.npmrc`, `.nvmrc`, `.prettierignore`, `.prettierrc`
- Configs: `lefthook.yml`, `tsconfig.json`, `turbo.json`
- `LICENSE-MIT`
- `package.json` (adjust as described below)
- `README.md` (adapt as described below)

Do NOT copy: `_records/`, `_guide.md`, `_backlog/` (except the parking lot created below), `_roadmap/`, `architecture/` (except the empty index created below), `cli/`, `libs/`, `spec/`, `package-lock.json`, `.git/`.

**1c. Adjust `package.json`:**

- `name`: `noodlestan/art-work`
- `description`: `Workspace orchestration tools and applications for the Noodlestan ecosystem.`
- `workspaces`: `["cli/**"]`
- Keep the rest (version, author, license, packageManager, engines, scripts, devDependencies) as in the template.

**1d. Adapt `README.md`:**

- Title: `# Art Work`
- Tagline: `> Workspace orchestration tools and applications for the Noodlestan ecosystem.`
- Replace the template's Packages table with an empty `## Packages` section (packages are added as they are created).
- Keep the `## Scripts` and `## Setup` sections, adapted to the art-work scripts.

**1e. Create the empty architecture index** at `$ART_WORK/architecture/index.md`:

```md
# Art Work Architecture

## Overview

This directory contains architecture documentation for the Art Work packages.

## Documents

| Document | Description |
| -------- | ----------- |
```

**1f. Create the parking lots:**

- `$ART_WORK/_backlog/_parking-lot.md` — fresh WIP tracker with the standard sections: `## ACTIONABLE`, `## pending`, `## BLOCKER`, `## FOLLOW-UPS (not in scope)`.
- `$ART_WORK/_roadmap/_parking-lot.md` — fresh roadmapping tracker with the same standard sections.

**Expected outcome:** `$ART_WORK` contains the scaffolded skeleton; no template packages, records, or guide are copied.

---

#### Commit: `scaffold-art-work-repository`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
scaffold(art-work): Scaffold Art Work repository.

- Add dotfiles, lint configs, license, README, package.json, tsconfig, turbo.json, and lefthook.yml.
- Create empty architecture index.
- Initialize _backlog/_parking-lot.md and _roadmap/_parking-lot.md.
```

---

### Step `3 / 5` — Add the `_guide.md`

Create `$ART_WORK/_guide.md`, modeled on `$ART_JS/_guide.md` but scoped to Art Work. Include at minimum:

- **Title:** `# Guide: Art Work`
- **Overview:** host and manage the Art Work workspace orchestration tools and applications, and their planning artefacts.
- **Recommended Reading:** `_guide.md`, `_records/project.art`, `_records/repository.art`.
- **Repository Layout:**

  ```
  _guide.md           — this file
  _backlog/           — plans, instructions, reports
  _records/           — project, repository, namespace, and license records
  architecture/       — repository-level architecture documentation
  cli/                — CLI packages (workspace-cli source lives at cli/workspace)
  ```

- **Records Management:** records are co-located with the resources they describe in `_records/` directories (Project, Repository, Namespace, License).
- **Workflows:** Planning Work (`$DOMAINS/work/workflows/planning-work/workflow.art`) and Roadmapping (`$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`), with the backlog at `_backlog/` and the roadmap at `_roadmap/`.
- **Operating Instructions:** Setting Up (`npm ci` from the repository root) and Verifying Completion (`npm run ci` from the repository root).

**Expected outcome:** `$ART_WORK/_guide.md` exists and is consistent with the scaffolded package.json and repository layout.

---

#### Commit: `add-art-work-guide`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
guides(art-work): Add root guide to the Art Work repository.
```

---

### Step `4 / 5` — Set the remote and push

**4a. Initialize git and set the remote:**

```bash
cd $ART_WORK
git init -b main
git remote add origin git@github.com:noodlestan/art-work.git
```

**4b. Push:**

```bash
git push -u origin main
```

The GitHub repository `noodlestan/art-work` may not exist yet. If the push fails with `Repository not found`, do NOT report a blocker — record the deferred push in the report and continue. The push is executed once the repository is created on GitHub.

**Expected outcome:** the commits are pushed to `origin/main`, or the deferred push is recorded in the report.

---

### Step `5 / 5` — Report

Report according to the "How to Report Back to the Delegator" instructions, noting the push state (pushed or deferred).

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that the art-work repo skeleton exists at `$ART_WORK` with the adjusted package.json and README, empty architecture index, both parking lots, and the `_guide.md`.
- Verify that no template packages or records were copied.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
