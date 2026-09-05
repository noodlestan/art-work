# Instructions: `add-guide`

**Plan:** `create-art-cli-project-repo`

**Iteration Id:** `add-guide`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-art-cli-project-repo/instructions/add-guide__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-guide`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                            |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                           |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                         |
| `$ART_DOMAINS` | Provided with prompt.        | Where this plan lives. Example: `$WORKSPACE/checkouts/art-domains-planning`        |
| `$ART_CLI`     | Provided with prompt.        | The new repository to create. Example: `$WORKSPACE/checkouts/art-cli-building`     |
| `$ART_JS`      | Provided with prompt.        | Repo used to scaffold by copying. Example: `$WORKSPACE/checkouts/art-js-reference` |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-guide`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add the `_guide.md` to the art-cli repository, modeled on the art-js-reference guide but scoped to Art Cli: repository layout, records management, workflows, and operating instructions.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/3-now/plan-create-art-cli-project-repo/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_JS/_guide.md` (Source) — Template guide to model the art-cli guide on.
- ::READ `$ART_CLI/package.json` (Source) — The scaffolded package.json (scripts and workspaces for the guide).

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$ART_CLI/_guide.md`)

Run from the `$ART_CLI` root:

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

**Instructions:** (From `$ART_CLI/_guide.md`)

Run from the `$ART_CLI` root directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 4 — Write the art-cli `_guide.md`
- Step 2 / 4 — Commit `add-art-cli-guide`
- Step 3 / 4 — Push (deferred if the GitHub repo does not exist yet)
- Step 4 / 4 — Report

## Steps

### Step `1 / 4` — Write the art-cli `_guide.md`

Create `$ART_CLI/_guide.md`, modeled on `$ARJ_JS/_guide.md` but scoped to Art Cli. Include at minimum:

- **Title:** `# Guide: Art Cli`
- **Overview:** host and manage the Art Cli shared libraries and tools, and their planning artefacts.
- **Recommended Reading:** `_guide.md`, `_records/project.art`, `_records/repository.art`.
- **Repository Layout:**

  ```
  _guide.md           — this file
  _backlog/           — plans, instructions, reports
  _records/           — project, repository, namespace, and license records
  architecture/       — repository-level architecture documentation
  libs/               — library packages
  ```

- **Records Management:** records are co-located with the resources they describe in `_records/` directories (Project, Repository, Namespace, License).
- **Workflows:** Planning Work (`$DOMAINS/work/workflows/planning-work/workflow.art`) and Roadmapping (`$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`), with the backlog at `_backlog/` and the roadmap at `_roadmap/`.
- **Operating Instructions:** Setting Up (`npm ci` from the repository root) and Verifying Completion (`npm run ci` from the repository root).

**Expected outcome:** `$ART_CLI/_guide.md` exists and is consistent with the scaffolded package.json and repository layout.

---

#### Commit: `add-art-cli-guide`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
guides(art-cli): Add root guide to Art Cli repository.
```

---

### Step `3 / 4` — Push

```bash
cd $ART_CLI
git push -u origin main
```

The GitHub repository `noodlestan/art-cli` may not exist yet. If the push fails with `Repository not found`, do NOT report a blocker — record the deferred push in the report and continue. The push is executed once the repository is created on GitHub.

**Expected outcome:** the commit is pushed to `origin/main`, or the deferred push is recorded in the report.

---

### Step `4 / 4` — Report

Report according to the "How to Report Back to the Delegator" instructions, noting the push state (pushed or deferred).

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that `$ART_CLI/_guide.md` exists and covers repository layout, records management, workflows, and operating instructions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
