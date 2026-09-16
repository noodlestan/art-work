# Plan: Make Art Work Cli work from global install

**ID:** `art-work-cli-global-install`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Make the Art Work Cli work correctly when installed globally.

**Description:** Update the Art Work Cli so that its globally installed executable can discover and operate on an Art Work workspace without relying on the CLI being invoked from its repository or from a local monorepo installation.

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

Update the Art Work Cli so that the globally installed executable can locate its runtime and operate against the intended Art Work workspace independently of the CLI's installation directory.

## Work

### Next

- All 4 iterations are `READY` and fully planned. Delegate Iteration: Refactor Config Semantics first — its delegation is gated on the `$ART_LIB` Plan: Add FS Records Store, Iteration: Implement FSRecordsStore being delivered (the contract is settled; only the provider code is pending).

### Blockers

- None. The contract with `$ART_LIB` Plan: Add FS Records Store is settled (types, signatures, and factory names are final). Iteration: Refactor Config Semantics has a delegation precondition: the provider's `implement-fs-records-store` iteration must be delivered first, since the instructions verify `@art-lib/fs-records` exports at runtime.

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

| Iteration / Instructions               | Status  |
| -------------------------------------- | ------- |
| Iteration: Refactor Config Semantics   | `READY` |
| Iteration: Discover configuration file | `READY` |
| Iteration: Add Init command            | `READY` |
| Iteration: Update Art Work Knowledge   | `READY` |

### Iteration: Refactor Config Semantics

**Id:** `refactor-config-semantics`

**Status:** `PLANNING`

**Purpose:** Make the intent behind each config option more explicit.

**Description:** Change configuration options to express `checkouts.path`, `data` (where managed records are stored), and `discovery.records` (how records are scanned for in checkouts).

**Instructions:** `./plan-art-work-cli-global-install/instructions/refactor-config-semantics.md`

**Changes:**

In `$ART_WORK`

```ts
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

Extract `const DEFAULTS: FSRecordsPattern` from `cli/work/src/config/private/normalizeRecordPaths.ts` as `DEFAULT_RECORDS_PATTERN ` in `cli/work/src/config/constants.ts`.

Change `checkouts.paths` => `data.store` and update `cli/work/src/config/defineConfig.ts` with `data.store` default is `DEFAULT_RECORDS_STORE_OPTIONS` also declared in `cli/work/src/config/constants.ts`.

Extract the `WorkspaceContext` interface in `cli/work/src/private/context/createWorkspaceContext.ts` to `cli/work/src/private/context/types.ts`.

Add `fsRecords: FSRecordsStore` to `WorkspaceContext`.

```ts
export interface WorkspaceContext {
  store: CheckoutStore;
  fsRecords: FSRecordsStore;
}
```

Update `createWorkspaceContext` in `cli/work/src/private/context/createWorkspaceContext.ts` to receive `(config, store, fsRecords, log)`.

In `cli/work/src/index.ts` extract the config and workspace context factories into `cli/work/src/private/cli/createConfig.ts` and `cli/work/src/private/cli/createContext.ts`.

In `createConfig()` locate and load the config file:

```ts
async function createConfig(logger: Logger) {
  logger(createGenericOperation('locate-config'));
  // WIP: Config discovery next.
  logger(createGenericOperation('load-config'));
  return await loadWorkspaceConfig(root);
}
```

In `createContext()` create an instance of `FSRecordsStore` using the `config.data.store` options:

```ts
createContext(config, logger) {
  logger(createGenericOperation('create-context'));
  const store = createCheckoutStore();
  const log = createOperationsLog(logger);
  const fsRecords = createFSRecordsStore(config.data.store);
  return createWorkspaceContext(config, store, fsRecords, log);
}
```

Update all commands to use `createContext()`

Replace direct `findRecordFiles()` calls with `fsRecords.discoverRecordFiles()` and `fsRecords.readRecord()`:

- `cli/work/src/private/resources/checkout/loadCheckoutRecords.ts`
- `cli/work/src/private/resources/repository/loadRepositoryRecords.ts`

Change `clone` => `checkouts`:

- Update `cli/work/src/config/defineConfig.ts`
- Update all consumers.
- Note: `checkouts.path` replaces `clone.path`; ensure init command and docs use `checkouts.path`.

Change `records.paths` to `discovery.records.paths`.

Streamline `cli/work/src/config/private/normalizeRecordPaths.ts`

```ts
const maybePaths = records?.paths;
const paths = maybePaths ? maybePaths : [{}];
```

Change all discovery invokations of `findRecordFiles()` to use the discovery config: `loadProjectRecords`, `loadNamespaceRecords`, and `loadPackageRecords`.

**Dependencies:**

- `$ART_LIB` Plan: Add FS Records Store — Iteration: Implement FSRecordsStore must be complete so that `FSRecordsStore`, `FSRecordsStoreOptions`, `createFSRecordsStore()`, and `FSRecordsPattern` are available.

#### Commits:

| ID                        | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `refactor-config-options` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `refactor-config-options`

**Message:**

```text
refactor(art-work-cli): Refactor config options for better semantics.
```

### Iteration: Discover configuration file

**Id:** `discover-config-location`

**Status:** `PLANNING`

**Purpose:** Make the Art Work Cli execute independently of its source checkout when installed globally.

**Description:** Make the CLI discover configuration in current working directory and parent dirs. Compile config file to an `.art` temp directory. Apply default config values if not found. In this scenario: checkouts are assumed at `checkouts` and if repos are added they are stored in `_records/repositories/`. Display configuration on every run.

**Instructions:** `./plan-art-work-cli-global-install/instructions/discover-config-location.md`

**Changes:**

- Discover configuration by scanning parent dirs.
- Compile config to a hidden .art dir.
- Advertise "running without config" or "Running from config at {path}".

**Dependencies:**

- Iteration: Refactor Config Semantics.

#### Commits:

| ID                           | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ---------------------------- | ----------------------------------- | ------------ | ---- | ------------- |
| `discover-config-location`   | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `compile-config-to-temp-dir` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |
| `show-config-options`        | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `discover-config-location`

**Message:**

```text
build(art-work-cli): Discover configuration file.
```

##### Commit: `compile-config-to-temp-dir`

**Message:**

```text
build(art-work-cli): Compile config to .art directory.
```

##### Commit: `show-config-options`

**Message:**

```text
build(art-work-cli): Show config options.
```

### Iteration: Add Init command

**Id:** `add-init-command`

**Status:** `PLANNING`

**Purpose:** Make the Art Work Cli executable independently of its source checkout when installed globally.

**Description:** Add a new `init` command that creates a configuration file with default values for `root.path` and `checkouts.path` redeclared for an easy to use starting point.

**Instructions:** `./plan-art-work-cli-global-install/instructions/add-init-command.md`

**Changes:**

- Add init command.

**Dependencies:**

- Iteration: Refactor Config Semantics.
- Iteration: Discover configuration file.

#### Commits:

| ID                 | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ------------------ | ----------------------------------- | ------------ | ---- | ------------- |
| `add-init-command` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `add-init-command`

**Message:**

```text
build(art-work-cli): Add Init Command.
```

### Iteration: Update Art Work Knowledge

**Id:** `update-art-work-knowledge`

**Status:** `PLANNING`

**Purpose:** Update Art Work knowledge files to reflect the global-install capability and new configuration semantics.

**Description:** Update architecture docs, guides, and any knowledge files in `$ART_WORK` that describe how the CLI locates configuration, operates in global vs local modes, and the shape of the workspace config.

**Instructions:** `./plan-art-work-cli-global-install/instructions/update-art-work-knowledge.md`

**Changes:**

- Update `$ART_WORK/cli/work/architecture/index.md` to document global-install execution model.
- Update `$ART_WORK/_guide.md` with global install usage notes.
- Update `$ART_WORK/cli/work/src/config/README.md` (or create) describing config file format and discovery.

**Dependencies:**

- Iteration: Refactor Config Semantics.
- Iteration: Discover configuration file.

#### Commits:

| ID                          | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| --------------------------- | ----------------------------------- | ------------ | ---- | ------------- |
| `update-art-work-knowledge` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `update-art-work-knowledge`

**Message:**

```text
docs(art-work-cli): Update knowledge for global install and config semantics.
```

---

## Coordination

### Not In Scope

- None

### Evidence

- None

### Findings

- The provider plan (`add-fs-records-store`) confirms `FSRecordsStore.discoverRecordFiles()` is async (`Promise<FSRecordFile[]>`) and `writeRecord(file, record, recordWrite)` accepts the record to write. The consumer contract reference reflects these signatures.
- `FSRecordFile.searchPath` is renamed to `FSRecordFile.basePath` in the provider plan; the consumer refactor must use `basePath`.
- The target `WorkspaceConfig` shape drops the `clone` and `output` keys. `clone` is replaced by `checkouts`; `output` is removed and its consumers must be updated.

### Decisions

- Iteration: Refactor Config Semantics is marked `READY` — planning is complete and the contract with `$ART_LIB` Plan: Add FS Records Store is settled. Its delegation is gated on the provider's `implement-fs-records-store` iteration being delivered; the instructions verify `@art-lib/fs-records` exports before starting (Step 1/8).
- Iterations: Discover configuration file, Add Init command, and Update Art Work Knowledge are marked `READY`; they depend on Iteration: Refactor Config Semantics and must be delegated in order.
- The `output` config key is removed per the target `WorkspaceConfig` shape; consumers are updated in Iteration: Refactor Config Semantics.

### Knowledge to Update

- Included as an iteration.

### Follow Ups

- Delegate Iteration: Refactor Config Semantics once the `$ART_LIB` Plan: Add FS Records Store, Iteration: Implement FSRecordsStore is delivered (delegation precondition, not a planning blocker).
- Confirm the `data.template` purpose (currently WIP) in a later iteration.

### Feedback

- None.
