# Instructions: `extract-record-modules`

**Plan:** `extract-read-write-records-art-lib`

**Iteration Id:** `extract-record-modules`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-extract-read-write-records-art-lib/instructions/extract-record-modules__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `extract-record-modules`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `extract-record-modules`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Extract the generic record read/write modules and their tests from the art-work-cli source (`$ART_WORK/cli/work/src/private/records/`) into the Lib Records package (`$ART_CLI/lib/records/src/`), adapting imports, exports, and tests for the standalone lib package.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/4-next/plan-extract-read-write-records-art-lib/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_WORK/cli/work/src/private/records/findRecordFiles.ts` (Source) — Module to extract.
- ::READ `$ART_WORK/cli/work/src/private/records/readRecordFileContent.ts` (Source) — Module to extract.
- ::READ `$ART_WORK/cli/work/src/private/records/types.ts` (Source) — Module to extract.
- ::READ `$ART_WORK/cli/work/src/private/records/findRecordFiles.test.ts` (Source) — Test to extract and adapt.
- ::READ `$ART_WORK/cli/work/src/config/types.ts` (Source) — The `WorkspaceRecordsPath` type the modules depend on; the lib defines its own equivalent.
- ::READ `$ART_CLI/lib/records/package.json` (Source) — The lib package.json created in the previous iteration.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_WORK/cli/work` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

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

## Changes

- Step 1 / 4 — Copy the record modules into the lib
- Step 2 / 4 — Adapt imports, exports, and tests for the standalone lib
- Step 3 / 4 — Commit `extract-record-modules` and push
- Step 4 / 4 — Report

## Steps

### Step `1 / 4` — Copy the record modules into the lib

Copy the generic record read/write modules from `$ART_WORK/cli/work/src/private/records/` to `$ART_CLI/lib/records/src/`:

- `findRecordFiles.ts` → `$ART_CLI/lib/records/src/findRecordFiles.ts`
- `readRecordFileContent.ts` → `$ART_CLI/lib/records/src/readRecordFileContent.ts`
- `types.ts` → `$ART_CLI/lib/records/src/types.ts`
- `findRecordFiles.test.ts` → `$ART_CLI/lib/records/src/findRecordFiles.test.ts`
- `private/` → `$ART_CLI/lib/records/src/private/` (createRecordFile, directoryExists, filterByKinds, findRecordFilesInPath, getGitIgnoredSet, globPath, normalizeExcludes, normalizePatterns)

Do NOT copy: the resource-specific readers/loaders (`src/private/resources/`), the config module, or the test helpers.

**Expected outcome:** `$ART_CLI/lib/records/src/` contains the record modules and their private helpers.

### Step `2 / 4` — Adapt imports, exports, and tests for the standalone lib

**2a. Define the lib's own records path type.** Create `$ART_CLI/lib/records/src/types.ts` additions (or a new `$ART_CLI/lib/records/src/config.ts`):

```ts
export interface RecordsPath {
  base: string;
  pattern: string | string[];
  ignored: string[];
  excluded: string[];
  gitignore: boolean;
}

export interface RecordsConfig {
  paths: RecordsPath[];
}
```

**2b. Adapt the modules that import from the art-work-cli config:**

- `findRecordFiles.ts`: replace `import type { WorkspaceConfig } from '../../config'` with the lib's `RecordsConfig`; the `recordsConfig` parameter type becomes `RecordsConfig`.
- `private/findRecordFilesInPath.ts`: replace `import type { WorkspaceRecordsPath } from '../../../config'` with the lib's `RecordsPath`.
- `private/globPath.ts`: replace `import type { WorkspaceRecordsPath } from '../../../config'` with the lib's `RecordsPath`.

The lib's `RecordsPath` is structurally identical to `WorkspaceRecordsPath`, so the art-work-cli can pass its config when consuming the lib.

**2c. Create the lib entry point `$ART_CLI/lib/records/src/index.ts`:**

```ts
export { findRecordFiles } from './findRecordFiles';
export { readRecordFileContent } from './readRecordFileContent';
export type { RecordFile } from './types';
export type { RecordsConfig, RecordsPath } from './types';
```

**2d. Adapt the test.** `findRecordFiles.test.ts` uses `makeMockConfig` from `../../test/helpers/context/makeMockConfig`. Replace it with a local helper in the lib:

- Create `$ART_CLI/lib/records/src/test/makeMockRecordsConfig.ts` returning a `RecordsConfig` with the same defaults as the art-work-cli helper:

```ts
import type { RecordsConfig } from '../types';

export function makeMockRecordsConfig(): RecordsConfig {
  return {
    paths: [
      {
        base: '.',
        pattern: '*.art',
        ignored: ['node_modules/', '.git/', 'dist/'],
        excluded: [],
        gitignore: true,
      },
    ],
  };
}
```

- Update the test imports: `makeMockConfig(tempDir).records` → `makeMockRecordsConfig()`, and the temp-dir helpers (`makeTempDir`, `removeTempDirs`) stay as-is (copy them into `$ART_CLI/lib/records/src/test/` if not already present).

**2e. Verify the lib builds and tests pass** from `$ART_CLI/lib/records`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

**Expected outcome:** the lib compiles, exports the record API, and its tests pass standalone.

---

#### Commit: `extract-record-modules`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(art-lib): extract record read/write modules from art-work-cli

- Copy generic record read/write modules and their tests to libs/records.
- Adapt imports and exports for the lib package.
```

---

### Step `3 / 4` — Push

```bash
cd $ART_CLI
git push -u origin main
```

The GitHub repository `noodlestan/art-lib` may not exist yet. If the push fails with `Repository not found`, do NOT report a blocker — record the deferred push in the report and continue. The push is executed once the repository is created on GitHub.

**Expected outcome:** the commit is pushed to `origin/main`, or the deferred push is recorded in the report.

---

### Step `4 / 4` — Report

Report according to the "How to Report Back to the Delegator" instructions, noting the push state (pushed or deferred).

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that `$ART_CLI/lib/records/src/` contains the record modules, private helpers, and the adapted test, and that the lib builds and tests pass.
- Verify that the art-work-cli source (`$ART_WORK/cli/work`) is unchanged by this iteration (its local copies remain until the consume iteration).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
