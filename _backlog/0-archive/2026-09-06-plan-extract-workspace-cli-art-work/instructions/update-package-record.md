# Instructions: `update-package-record`

**Plan:** `extract-workspace-cli-art-work`

**Iteration Id:** `update-package-record`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-extract-workspace-cli-art-work/instructions/update-package-record__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-package-record`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                                 |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                                |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                              |
| `$ART_WORK`    | Provided with prompt.        | Where the Cli is being miagrated to. Example: `$WORKSPACE/checkouts/art-work-building`  |
| `$ART_DOMAINS` | Provided with prompt.        | Repo currently containing the Cli. Example: `$WORKSPACE/checkouts/art-domains-building` |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-package-record`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Update the workspace-cli package record for its new home in Art Work: Owner: Project: Art Work, Namespace: Namespace: Art Work, Path: `cli/work`, Canonical Name: `@art-work/cli`, Bin: `art-work-cli: ./dist/index.js`. Keep package.json and the npm-deployment record consistent with the new canonical name.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/4-next/plan-extract-workspace-cli-art-work/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_DOMAINS/cli/workspace/_records/package.art` (Source) — The package record to update.
- ::READ `$ART_DOMAINS/cli/workspace/_records/npm-deployment.art` (Source) — The npm-deployment record to update.
- ::READ `$ART_DOMAINS/cli/workspace/package.json` (Source) — The package.json to update.
- ::READ `$ART_WORK/_records/namespace.art` (Source) — Art-work namespace record (Namespace: Art Work).
- ::READ `$ART_WORK/_records/project.art` (Source) — Art-work root project record (Project: Art Work).

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$ART_DOMAINS` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_WORK/cli/work` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

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

Run from the package directory:

Run from repository being modified `$ART_DOMAINS` or `$ART_WORK` root:

```bash
npm run ci # to verify build is green before starting
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 4 — Update the package record
- Step 2 / 4 — Update package.json and the npm-deployment record
- Step 3 / 4 — Commit `update-work-cli-package-record` and push
- Step 4 / 4 — Report

## Steps

### Step `1 / 4` — Update the package record

Edit `$ART_WORK/lib/work/_records/package.art`:

- **Owner:** `Project: Art Work`
- **Namespace:** `Namespace: Art Work`
- **Path:** `cli/work`
- **Canonical Name:** `@art-work/cli`
- **Bin:**
  - `art-work-cli`: `./dist/index.js`

Keep everything else (Purpose, Description, Author, Published, Private, Deployment, Files, Language, Engines, PackageManager, PackageFile, Dependencies, Scripts, Scaffolders, License) unchanged.

**Expected outcome:** the package record reflects the new owner, namespace, path, canonical name, and bin.

### Step `2 / 4` — Update package.json and the npm-deployment record

**2a. Edit `$ART_WORK/lib/work/package.json`:**

- `name`: `@art-work/cli`
- `bin`: `{ "art-work-cli": "./dist/index.js" }`
- `repository.url`: `https://github.com/noodlestan/art-work`
- `repository.directory`: `cli/work`

Keep everything else unchanged.

**2b. Edit `$ART_WORK/lib/work/_records/npm-deployment.art`:**

- **Canonical Name:** `@art-work/cli`

Keep everything else unchanged.

**Expected outcome:** package.json and the npm-deployment record are consistent with the updated package record.

---

#### Commit: `update-work-cli-package-record`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
records(art-work): Update Work Cli package record to Art Work.

- Set Owner: Project: Art Work, Namespace: Namespace: Art Work.
- Set Path: cli/workspace, Canonical Name: @art-work/cli, Bin: art-work-cli.
- Update package.json name, bin, and repository to match.
- Update npm-deployment canonical name to @art-work/cli.
```

---

### Step `3 / 4` — Push

```bash
cd $ART_WORK
git push -u origin building
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
- Verify that the package record, package.json, and npm-deployment record all reference `@art-work/cli` / `art-work-cli` and the art-work owner/namespace/path.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
