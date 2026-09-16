# Instructions: `refactor-config-semantics`

**Plan:** `art-work-cli-global-install`

**Iteration Id:** `refactor-config-semantics`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-work-cli-global-install/instructions/refactor-config-semantics__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `refactor-config-semantics`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`  | Provided with prompt         | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-building` |
| `$ART_LIB`   | Provided with prompt         | Art Lib repository. Example: `$WORKSPACE/checkouts/art-lib-building`   |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `refactor-config-semantics`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

This section describes the goal(s) of this iteration.

Make the intent behind each config option explicit by reshaping `WorkspaceConfig` to express `checkouts.path`, `data` (where managed records are stored), and `discover.records` (how records are scanned for in checkouts), and wire the new `FSRecordsStore` into the workspace context.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$ART_WORK/cli/work/architecture/index.md`
- briefing: `$ART_WORK/_roadmap/_architect.md`
- provider contract: `$ART_LIB` Plan: Add FS Records Store — Iteration: Implement FSRecordsStore (`$WORKSPACE/checkouts/art-lib-planning/_backlog/4-next/add-fs-records-store/plan.md`). This iteration depends on the `FSRecordsStore`, `FSRecordsStoreOptions`, `FSRecordsPattern`, and `createFSRecordsStore()` symbols being available from `@art-lib/fs-records`.

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

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 8 — Verify provider contract availability
- Step 2 / 8 — Add config constants
- Step 3 / 8 — Reshape config types and defaults
- Step 4 / 8 — Extract WorkspaceContext and add fsRecords
- Step 5 / 8 — Extract createConfig and createContext factories
- Step 6 / 8 — Update CLI entry and commands
- Step 7 / 8 — Replace findRecordFiles with fsRecords
- Step 8 / 8 — Commit `refactor-config-options`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 8` — Verify provider contract availability

Confirm that the `@art-lib/fs-records` package exposes the symbols required by this iteration. Read the package exports from `$ART_LIB/libs/fs-records/src/index.ts` and confirm the following are exported:

- `FSRecordsStore` (interface)
- `FSRecordsStoreOptions` (interface)
- `FSRecordsPattern` (interface)
- `createFSRecordsStore(options: FSRecordsStoreOptions): FSRecordsStore` (factory)
- `FSRecordFile` with the `basePath` field (renamed from `searchPath`)

Also confirm the `FSRecordsStore` contract matches the provider plan:

```ts
export interface FSRecordsStore {
  options: FSRecordsStoreOptions;
  listFiles: () => Promise<FSRecordFile[]>;
  readRecord: <T extends BaseRecordStructure>(
    file: FSRecordFile,
    recordRead: RecordReadImplementation<T>,
  ) => Promise<FSRecord<T>>;
  writeRecord: <T extends BaseRecordStructure>(
    file: FSRecordFile,
    record: T,
    recordWrite: RecordWriteImplementation<T>,
  ) => Promise<FSRecord<T>>;
}
```

Note: `listFiles()` is async, and `writeRecord(file, record, recordWrite)` accepts the record to write.

If any of these symbols are missing or the contract differs, **REPORT A BLOCKER** — this iteration depends on the `$ART_LIB` Plan: Add FS Records Store, Iteration: Implement FSRecordsStore being complete.

### Step `2 / 8` — Add config constants

Create `$ART_WORK/cli/work/src/config/constants.ts` with two exported constants:

```ts
import type { FSRecordsPattern, FSRecordsStoreOptions } from '@art-lib/fs-records';

export const DEFAULT_RECORDS_PATTERN: FSRecordsPattern = {
  base: '.',
  pattern: '*.art',
  ignored: ['node_modules/', '.git/', 'dist/'],
  excluded: [],
  gitignore: true,
};

export const DEFAULT_RECORDS_STORE_OPTIONS: FSRecordsStoreOptions = {
  path: '_records/',
  extension: '.art',
  ignored: ['node_modules/', '.git/', 'dist/'],
  excluded: [],
};
```

The `DEFAULT_RECORDS_PATTERN` is extracted from the current `DEFAULTS` constant in `$ART_WORK/cli/work/src/config/private/normalizeRecordPaths.ts`.

### Step `3 / 8` — Reshape config types and defaults

Update `$ART_WORK/cli/work/src/config/types.ts` to the new shape:

```ts
import type { FSRecordsPattern, FSRecordsStoreOptions } from '@art-lib/fs-records';

export interface WorkspaceConfig {
  root: { path: string };
  checkouts: { path: string };
  data: {
    store: FSRecordsStoreOptions;
    template: string; // WIP: purpose to be defined (default record template path?)
  };
  discover: {
    records: { paths: FSRecordsPattern[] };
  };
}

export interface PartialWorkspaceConfig {
  root?: Partial<WorkspaceConfig['root']>;
  checkouts?: Partial<WorkspaceConfig['checkouts']>;
  data?: Partial<WorkspaceConfig['data']>;
  discover?: {
    records?: { defaults?: Partial<FSRecordsPattern>; paths?: Partial<FSRecordsPattern>[] };
  };
}
```

Note: the `clone` and `output` keys are removed from `WorkspaceConfig` per the target shape. Update all consumers accordingly.

Streamline `$ART_WORK/cli/work/src/config/private/normalizeRecordPaths.ts` to accept the new `discover.records` shape and use `DEFAULT_RECORDS_PATTERN`:

```ts
const maybePaths = records?.paths;
const paths = maybePaths ? maybePaths : [{}];
```

Update `$ART_WORK/cli/work/src/config/defineConfig.ts`:

- Change `clone` => `checkouts` (config key). `checkouts.path` replaces `clone.path`.
- Change `records.paths` => `discover.records.paths`.
- Change `checkouts.path` => `data.store`, defaulting to `DEFAULT_RECORDS_STORE_OPTIONS`.
- Move `checkouts.template` => `data.template`.
- Remove the `output` key.

Update `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` so its `DEFAULT_CONFIG` uses the new shape.

### Step `4 / 8` — Extract WorkspaceContext and add fsRecords

Extract the `WorkspaceContext` interface from `$ART_WORK/cli/work/src/private/context/createWorkspaceContext.ts` into a new file `$ART_WORK/cli/work/src/private/context/types.ts`:

```ts
import type { FSRecordsStore } from '@art-lib/fs-records';
import type { CheckoutStore } from '../store/types';

export interface WorkspaceContext {
  store: CheckoutStore;
  fsRecords: FSRecordsStore;
}
```

Update `createWorkspaceContext` in `$ART_WORK/cli/work/src/private/context/createWorkspaceContext.ts` to receive `(config, store, fsRecords, log)` and return the `WorkspaceContext` from `types.ts`.

### Step `5 / 8` — Extract createConfig and createContext factories

Create `$ART_WORK/cli/work/src/private/cli/createConfig.ts`:

```ts
async function createConfig(logger: Logger) {
  logger(createGenericOperation('locate-config'));
  // WIP: Config discovery next.
  logger(createGenericOperation('load-config'));
  return await loadWorkspaceConfig(root);
}
```

Create `$ART_WORK/cli/work/src/private/cli/createContext.ts`:

```ts
createContext(config, logger) {
  logger(createGenericOperation('create-context'));
  const store = createCheckoutStore();
  const log = createOperationsLog(logger);
  const fsRecords = createFSRecordsStore(config.data.store);
  return createWorkspaceContext(config, store, fsRecords, log);
}
```

### Step `6 / 8` — Update CLI entry and commands

Update `$ART_WORK/cli/work/src/index.ts` to use `createConfig()` and `createContext()` instead of building config and context inline. Update all commands (sanity, branch, checkouts, clone, link, publish, pull, push, repo, sync, unlink) to use the context returned by `createContext()`.

### Step `7 / 8` — Replace findRecordFiles with fsRecords

Replace direct `findRecordFiles()` calls with `fsRecords.listFiles()` and `fsRecords.readRecord()`:

- `$ART_WORK/cli/work/src/private/resources/checkout/loadCheckoutRecords.ts`
- `$ART_WORK/cli/work/src/private/resources/repository/loadRepositoryRecords.ts`

Change all discovery invocations of `findRecordFiles()` to use the discovery config (`discover.records`):

- `$ART_WORK/cli/work/src/private/resources/project/loadProjectRecords.ts`
- `$ART_WORK/cli/work/src/private/resources/namespace/loadNamespaceRecords.ts`
- `$ART_WORK/cli/work/src/private/resources/package/loadPackageRecords.ts`

### Step `8 / 8` — Commit `refactor-config-options`

---

#### Commit: `refactor-config-options`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
refactor(art-work-cli): Refactor config options for better semantics.
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `WorkspaceConfig` uses the new shape (`root`, `checkouts`, `data.store`, `discover.records.paths`) and that no references to `clone`, `records.paths`, or `output` remain in the config layer.
- Verify that `WorkspaceContext` exposes `fsRecords: FSRecordsStore` and that all commands consume the context from `createContext()`.
- Verify that no direct `findRecordFiles()` calls remain; record discovery goes through `fsRecords.listFiles()` / `fsRecords.readRecord()`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
