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

- Plan iterations.

### Blockers

- Depends on `$ART_LIB` Plan: Add FS Records Store.

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

| Iteration / Instructions               | Status     |
| -------------------------------------- | ---------- |
| Iteration: Refactor Config Semantics   | `PLANNING` |
| Iteration: Discover configuration file | `PLANNING` |
| Iteration: Add Init command            | `PLANNING` |
| Iteration: Update Art Work Knowledge   | `PLANNING` |

### Iteration: Refactor Config Semantics

**Id:** `refactor-config-semantics`

**Status:** `PLANNING`

**Purpose:** Make the intent behind each config option more explicit.

**Description:** Change configuration options to express `checkouts.path`, `data` (where managed records are stored), and `discovery.records` (how records are scanned for in checkouts).

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/refactor-config-semantics.md`

**Changes:**

In `$ART_WORK`

```ts
export interface WorkspaceConfig {
  root: { path: string };
  checkouts: { path: string };
  data: {
    store: FSRecordsStoreOptions;
    template: string;
  };
  discover: {
    records: { paths: FSRecordsPattern[] };
  };
}

export interface PartialWorkspaceConfig {
  root?: Partial<WorkspaceConfig['root']>;
  checkouts?: Partial<WorkspaceConfig['checkouts']>;
  data?: Partial<WorkspaceConfig['data']>;
  discovery?: {
    records?: { defaults?: Partial<FSRecordsPattern>; paths?: Partial<FSRecordsPattern>[] };
  };
}
```

Extract `const DEFAULTS: FSRecordsPath` from `cli/work/src/config/private/normalizeRecordPaths.ts` as `DEFAULT_RECORDS_PATTERN ` in `cli/work/src/config/constants.ts`.

Change `checkouts.paths` => `data.store` and update `cli/work/src/config/defineConfig.ts` with `data.store` default is `DEFAULT_RECORDS_STORE_OPTIONS` also declared in `cli/work/src/config/constants.ts`.

Extract the `WorkspaceContext` interface in `cli/work/src/private/context/createWorkspaceContext.ts` to `cli/work/src/private/context/types.ts`.

Add an `fsRecords: FSRecordsStore`

```ts
Extract export interface WorkspaceContext {
  store: CheckoutStore;
  fsRecords: FSRecordsStore;
}
```

Update `createWorkspaceContext` in `cli/work/src/private/context/createWorkspaceContext.ts` to receive `(config, store, fsRecords, log)`.

In `cli/work/src/index.ts` extract the config and workspace context factories into ``and `cli/work/src/private/cli/createContext.ts`.

In `createConfig()` create an instance of store using the `config.data.store` options.

```
createContext(logger,) {
  logger(createGenericOperation('locate-config'));
  // WIP: Config discovery next.
  logger(createGenericOperation('load-config'));
  return await loadWorkspaceConfig(root);
}
```

In `createContext()` create an instance of store using the `config.data.store` options.

```
createContext(config, logger,) {
  logger(createGenericOperation('create-context'));
  const store = createCheckoutStore();
  const log = createOperationsLog(logger);
  const fsRecords = createFSRecordsStore(config.data.store);
  return createWorkspaceContext(config, store, fsRecords, log);
}
```

Update all commands to use `createContext()`

Change all record management invokation of `findRecordFiles()` to use this store:

- `cli/work/src/private/resources/checkout/loadCheckoutRecords.ts`
- `cli/work/src/private/resources/repository/loadRepositoryRecords.ts`

Change `clone` => `checkouts`:

- Update `cli/work/src/config/defineConfig.ts`
- Update all consumers.

Change `records.paths` to `discovery.records.paths`.

Streamline `cli/work/src/config/private/normalizeRecordPaths.ts`

```ts
const maybePaths = records?.paths;
const paths = maybePaths ? maybePaths : [{}];
```

Change all discovery invokations of `findRecordFiles()` to use the discovery config: `loadProjectRecords`, `loadNamespaceRecords`, and `loadPackageRecords`.

**Dependencies:**

- None.

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

**Description:** Make the CLI discover configuration in current working directory and parent dirs. Compile config file to an `.art` temp directory. Apply default config values if not found. In this scenario: checkouts are assumed at `checkouts` and if repos are added they are stored in `_records/repositories/`. Display copnfiguration on every run.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/discover-config-location.md`

**Changes:**

- Discover configuration by scanning parent dirs.
- Compile config to a hidden .art dir.
- Advertise "running without config" or "Running from config at {path}".

**Dependencies:**

- None.

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

**Description:** Add a new `init` command that creates a configuration file with default values for `clone.path` and `checkouts.path` redeclared for a easy to use starting point.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/add-init-command.md`

**Changes:**

- Add init command.

**Dependencies:**

- None.

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

**Id:** `add-init-command`

**Status:** `PLANNING`

**Purpose:** Make the Art Work Cli executable independently of its source checkout when installed globally.

**Description:** Add a new `init` command that creates a configuration file with default values for `clone.path` and `checkouts.path` redeclared for a easy to use starting point.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/add-init-command.md`

**Changes:**

- Add init command.

**Dependencies:**

- None.

#### Commits:

| ID                 | Repository / Checkout / Branch      | Policy       | Hash | Status        |
| ------------------ | ----------------------------------- | ------------ | ---- | ------------- |
| `add-init-command` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `PLACEHOLDER` |

##### Commit: `add-init-command`

**Message:**

```text
build(art-work-cli): Add Init Command.
```

---

## Coordination

### Not In Scope

- None

### Evidence

- None

### Findings

- None

### Decisions

- None

### Knowledge to Update

- Incliuded as an iteration.

### Follow Ups

- None identified.

### Feedback

- None.
