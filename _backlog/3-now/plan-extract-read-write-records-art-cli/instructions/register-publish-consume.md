# Instructions: `register-publish-consume`

**Plan:** `extract-read-write-records-art-lib`

**Iteration Id:** `register-publish-consume`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-extract-read-write-records-art-lib/instructions/register-publish-consume__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `register-publish-consume`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                | Purpose                                                                                     |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `$WORKSPACE`   | Current working directory    | Workspace root directory                                                                    |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains` | Domain resources directory                                                                  |
| `$ART_DOMAINS` | Provided with prompt.        | Where this plan lives. Example: `$WORKSPACE/checkouts/art-domains-planning`                 |
| `$ART_CLI`     | Provided with prompt.        | Where the functions are being migrated to. Example: `$WORKSPACE/checkouts/art-lib-building` |
| `$ART_WORK`    | Provided with prompt.        | Repo currently containing the functions. Example: `$WORKSPACE/checkouts/art-work-building`  |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `register-publish-consume`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Register the Lib Records package in the Art Cli project record, publish `@art-lib/fs-records` to npm, consume it in art-work-cli (replacing the local record modules), update knowledge in art-lib and art-work, publish a new art-work-cli version, and test in `$WORKSPACE`.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/3-now/plan-extract-read-write-records-art-cli/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_CLI/_records/project.art` (Source) — Art-cli project record; Package: Lib Records is registered as PLANNED.
- ::READ `$ART_CLI/libs/records/package.json` (Source) — The lib package.json to publish.
- ::READ `$ART_WORK/cli/work/_records/package.art` (Source) — The art-work-cli package record to update.
- ::READ `$ART_WORK/cli/work/package.json` (Source) — The art-work-cli package.json to update.
- ::READ `$ART_WORK/cli/work/src/private/records/findRecordFiles.ts` (Source) — Local module to be replaced by the lib import.
- ::READ `$ART_WORK/cli/work/src/private/records/readRecordFileContent.ts` (Source) — Local module to be replaced by the lib import.
- ::READ `$ART_WORK/cli/work/src/private/records/types.ts` (Source) — Local module to be replaced by the lib import.

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

- Step 1 / 6 — Register the lib in the Art Cli project record
- Step 2 / 6 — Publish `@art-lib/fs-records` and commit `register-and-publish-lib-records`
- Step 3 / 6 — Consume the lib in art-work-cli and commit `consume-lib-records-in-art-work-cli`
- Step 4 / 6 — Update knowledge in art-lib and art-work
- Step 5 / 6 — Publish a new art-work-cli version and commit `release-art-work-cli`
- Step 6 / 6 — Test in `$WORKSPACE` and report

## Steps

### Step `1 / 6` — Register the lib in the Art Cli project record

Edit `$ART_CLI/_records/project.art`: change the Lib Records resource from PLANNED to registered:

- `Package: Lib Records (PLANNED)` → `Package: Lib Records`

**Expected outcome:** the Art Cli project record lists Package: Lib Records as a registered resource.

### Step `2 / 6` — Publish `@art-lib/fs-records`

**2a. Publish the lib to npm:**

```bash
cd $ART_CLI/libs/records
npm publish --access public
```

If the publish fails because the package name is already taken or npm auth is missing, do NOT report a blocker — record the deferred publish in the report and continue. The publish is executed once auth is available.

**2b. Update the lib package record** `$ART_CLI/libs/records/_records/package.art`:

- **Published:** `true`

**Expected outcome:** `@art-lib/fs-records` is published (or the deferred publish is recorded) and the package record reflects it.

---

#### Commit: `register-and-publish-lib-records`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
records(art-lib): register lib records in project record and publish

- Register Package: Lib Records in the Art Cli project record.
- Publish @art-lib/fs-records to npm.
```

---

### Step `3 / 6` — Consume the lib in art-work-cli

**3a. Add the dependency** to `$ART_WORK/cli/work/package.json`:

- `dependencies`: add `"@art-lib/fs-records": "^0.0.1"`

**3b. Replace the local record modules with lib imports.** The consumers of the record modules are the resource readers/loaders in `$ART_WORK/cli/work/src/private/resources/`:

- `loadRepositoryRecords.ts`, `loadPackageRecords.ts`, `loadProjectRecords.ts`, `loadCheckoutRecords.ts`, `loadNamespaceRecords.ts` — replace `import { findRecordFiles } from '../../records/findRecordFiles'` with `import { findRecordFiles } from '@art-lib/fs-records'`.
- `readRepositoryRecord.ts`, `readPackageRecord.ts`, `readProjectRecord.ts`, `readCheckoutRecord.ts`, `readNamespaceRecord.ts` — replace `import { readRecordFileContent } from '../../records/readRecordFileContent'` and `import type { RecordFile } from '../../records/types'` with `import { readRecordFileContent, type RecordFile } from '@art-lib/fs-records'`.

**3c. Remove the local record modules** from `$ART_WORK/cli/work/src/private/records/` (findRecordFiles, readRecordFileContent, types, private/, and the test).

**3d. Update the art-work-cli package record** `$ART_WORK/cli/work/_records/package.art`:

- **Dependencies** → Runtime: add `Package Dependency: Lib Records` (canonical `@art-lib/fs-records`, version `^0.0.1`).

**3e. Verify the art-work-cli builds and tests pass** from `$ART_WORK/cli/work$`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

**Expected outcome:** art-work-cli consumes `@art-lib/fs-records`; the local record modules are gone; build and tests pass.

---

#### Commit: `consume-lib-records-in-art-work-cli`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(art-work): consume @art-lib/fs-records in art-work-cli

- Replace local record read/write modules with imports from @art-lib/fs-records.
- Update package record and dependencies.
- Update knowledge in art-lib and art-work.
```

---

### Step `4 / 6` — Update knowledge in art-lib and art-work

- In `$ART_CLI`: add a short architecture note under `$ART_CLI/architecture/index.md` documenting the Lib Records package (purpose, canonical name, path).
- In `$ART_WORK`: update `$ART_WORK/cli/work/architecture/` docs that reference the record modules to point at `@art-lib/fs-records` (e.g. `architecture/index.md` and `architecture/_pseudo.md` if they mention `src/private/records/`).

**Expected outcome:** knowledge in both repos reflects the extracted lib.

### Step `5 / 6` — Publish a new art-work-cli version

**5a. Bump the art-work-cli version** in `$ART_WORK/cli/work/package.json` (minor bump, e.g. `0.0.18` → `0.1.0`).

**5b. Publish:**

```bash
cd $ART_WORK/cli/work$
npm publish --access public
```

If the publish fails (npm auth missing), do NOT report a blocker — record the deferred publish in the report and continue.

**5c. Update the npm-deployment record** `$ART_WORK/cli/work/_records/npm-deployment.art` if it tracks versions.

**Expected outcome:** a new art-work-cli version consuming `@art-lib/fs-records` is published (or the deferred publish is recorded).

---

#### Commit: `release-art-work-cli`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
release(art-work): publish art-work-cli with lib records dependency

- Publish a new art-work-cli version consuming @art-lib/fs-records.
- Test in $WORKSPACE.
```

---

### Step `6 / 6` — Test in `$WORKSPACE` and report

- From `$WORKSPACE` root, run `npm ci` and `npm run ci` to verify the workspace still builds with the published packages.
- Report according to the "How to Report Back to the Delegator" instructions, noting the push/publish state (pushed or deferred) for each repository.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that the Art Cli project record registers Package: Lib Records, the lib is published (or deferred), and art-work-cli consumes `@art-lib/fs-records` with no local record modules remaining.
- Verify that knowledge in art-lib and art-work is updated and the new art-work-cli version is published (or deferred).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
