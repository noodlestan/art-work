# Plan: Add Config Cache

**ID:** `add-config-cache`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Compile the workspace configuration into a hidden directory and recompile only when the source configuration changes or caching is explicitly bypassed.

**Description:** Stop writing the compiled config bundle to the workspace root; store the compiled bundle and its change-tracking metadata under `node_modules/.art-work/`, reuse the cached compilation while the recorded sources are unchanged, and add a `--no-config-cache` flag that forces recompilation for one invocation.

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

Move the compiled config bundle out of the workspace root into `node_modules/.art-work/`, reuse it while the config sources are unchanged, add `--no-config-cache` to force a rebuild, and document both — touching config loading, CLI option plumbing, their tests, the package README, and the config architecture knowledge.

## Context

### Upstream Work

| Kind                  | Path                                                                 | Role                                                                                                               |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                                 | Tracks short-term actionables, pending questions, and blockers.                                                    |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                   | Art Work principles, NFRs, milestones.                                                                             |
| Milestone             | `$ART_WORK/_roadmap/3-now/milestone-art-work-cli-one/milestone.md`   | Coordinates this plan as Phase 3 of the Art Work Cli One milestone.                                                |
| Plan                  | `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` | Iteration: Discover configuration file owns config compilation; this plan refines where its compiled output lands. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK/cli/work/architecture/design/config.md` (Model) — Loading mechanism: esbuild bundle-at-runtime. Relevant for all iterations.

::READ `$WORKSPACE/_guide.md` (Guide) — Workspace setup and verification. Relevant for Setting Up, Verifying Step.

## Scope

Changes confined to config loading and CLI option plumbing in `$ART_WORK/cli/work/src/config/` and `$ART_WORK/cli/work/src/index.ts`, their unit and integration tests, the package `$ART_WORK/cli/work/README.md`, and the config architecture knowledge. No change to the config schema, config discovery, or command behaviour beyond skipping the esbuild build when the cache is valid.

## Work

### Next

- Delegate Iteration: Move Config Bundle To Cache first (`./instructions/move-config-bundle-to-cache.md`); the remaining 3 iterations follow in order.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Do NOT run `npm install` inside `$ART_WORK` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the `$ART_WORK` root:

```bash
npm run ci # lint, test and build
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions               | Status  |
| -------------------------------------- | ------- |
| Iteration: Move Config Bundle To Cache | `READY` |
| Iteration: Cache Config By Source Hash | `READY` |
| Iteration: Add No Config Cache Flag    | `READY` |
| Iteration: Update Config Knowledge     | `READY` |

### Iteration: Move Config Bundle To Cache

**Id:** `move-config-bundle-to-cache`

**Status:** `READY`

**Purpose:** Stop writing the compiled configuration bundle into the workspace root.

**Description:** Relocate the esbuild output from `.art-workspace-bundle.mjs` at the workspace root into `node_modules/.art-work/`, and stop producing the root-level file.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/move-config-bundle-to-cache.md`

**Changes:**

In `$ART_WORK/cli/work/src/config/`:

- Add `cache.ts` exporting the cache location helpers: `CACHE_DIR = ['node_modules', '.art-work']`, `BUNDLE_FILE = 'config.bundle.mjs'`, `META_FILE = 'config.cache.json'`, `resolveCacheDir(rootPath)`, `resolveBundlePath(rootPath)`.
- In `loadWorkspaceConfig.ts`, drop `TEMP_FILE = '.art-workspace-bundle.mjs'` and write the bundle to `resolveBundlePath(rootPath)` instead of `join(rootPath, TEMP_FILE)`.
- Create the cache directory on demand (`mkdir(dir, { recursive: true })`) before the first write.
- Wrap cache reads and writes in a try/catch that warns and falls back to a non-cached compile — an unwritable cache MUST NOT fail a run.
- Best-effort delete a stale `.art-workspace-bundle.mjs` left at the workspace root by earlier versions.
- In `loadWorkspaceConfig.test.ts`, assert the bundle lands under `node_modules/.art-work/` and that no `.art-workspace-bundle.mjs` is written at the root.

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ----------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `move-config-bundle-to-cache` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `move-config-bundle-to-cache`

**Message:**

```text
build(art-work-cli): Move compiled config into `node_modules/.art-work`.
```

### Iteration: Cache Config By Source Hash

**Id:** `cache-config-by-source-hash`

**Status:** `READY`

**Purpose:** Reuse the cached compilation while the configuration sources are unchanged.

**Description:** Record change-tracking metadata beside the compiled bundle and skip the esbuild build when every recorded input still hashes the same.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/cache-config-by-source-hash.md`

**Changes:**

In `$ART_WORK/cli/work/src/config/`:

- Set `metafile: true` on the `build()` call so the build reports every input file it bundled.
- After a successful build, write `config.cache.json` next to the bundle:

```json
{
  "version": 1,
  "compiledAt": "2026-10-11T00:00:00.000Z",
  "manifest": "$WORKSPACE/.art-workspace.mts",
  "inputs": [{ "path": ".art-workspace.mts", "hash": "<sha256>" }]
}
```

- Before calling `build()`:
  1. Read and parse `config.cache.json`. Missing, unparseable, or `version` mismatch → rebuild.
  2. Verify the bundle exists. Missing → rebuild.
  3. Hash every recorded input (sha256 of file bytes). Missing file or mismatched hash → rebuild.
  4. Otherwise import the cached bundle and skip `build()` entirely.
- Record every file from `metafile.inputs`, not only the manifest, so a change to an imported file invalidates the cache too.
- Prefer content hashes over mtime: mtimes reset on `git checkout`, restores, and container binds.
- Log the decision (reused / rebuilt) with `console.info` — the module has no logger dependency; introducing one is out of scope.

In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts`:

- Valid cache → a second call imports the bundle and does **not** call `build()` (spy on `esbuild.build`).
- Edited manifest → rebuilds and rewrites `config.cache.json`.
- Edited file imported by the manifest → rebuilds (proves `metafile.inputs` coverage).
- Missing bundle, missing `config.cache.json`, unparseable metadata, and `version` mismatch → rebuild.
- Unreadable cache directory → warns and still returns a config (no throw).

**Dependencies:**

- Iteration: Move Config Bundle To Cache.

#### Commits:

| ID                            | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ----------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `cache-config-by-source-hash` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `cache-config-by-source-hash`

**Message:**

```text
build(art-work-cli): Reuse compiled config when sources are unchanged.
```

### Iteration: Add No Config Cache Flag

**Id:** `add-no-config-cache-flag`

**Status:** `READY`

**Purpose:** Let an operator force a config recompile for a single invocation.

**Description:** Add a `--no-config-cache` option that bypasses the cached compilation, rebuilds, and refreshes the cache before the command runs.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-no-config-cache-flag.md`

**Changes:**

In `$ART_WORK/cli/work/src/index.ts`:

- Declare `--no-config-cache` on the program. Commander's `--no-<name>` idiom gives `configCache: true` by default and `false` when the flag is passed.
- Confirm the flag is accepted where operators expect it. If Commander rejects it after the subcommand, either document it as a program-level option (before the subcommand) or call `program.enablePositionalOptions()`.
- Thread the value into every command action's `loadWorkspaceConfig(root)` call via `command.optsWithGlobals()`.

In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`:

- Extend the signature to `loadWorkspaceConfig(rootPath, options?: { cache?: boolean })`.
- When `options.cache === false`: skip the cache read, rebuild, overwrite the bundle and metadata, then import.
- Log the bypass with `console.info` so the behaviour is visible in the run.

In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts`:

- Assert the default honours a valid cache (second call does not rebuild).
- Assert the bypass flag rebuilds and refreshes `config.cache.json`.

In `$ART_WORK/cli/work/test/config.test.ts` (new integration test, alongside `integration.test.ts`):

- Two runs against an unchanged manifest → the second run reuses the cache.
- Editing `.art-workspace.mts` between runs → the next run rebuilds.
- `--no-config-cache` → rebuilds and refreshes `config.cache.json`.
- The cache is created under `<workspace root>/node_modules/.art-work/` and never at the workspace root.
- Teardown removes any cache written by the run (extend the `tempDirs` cleanup).

**Dependencies:**

- Iteration: Cache Config By Source Hash.

#### Commits:

| ID                         | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| -------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `add-no-config-cache-flag` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `add-no-config-cache-flag`

**Message:**

```text
build(art-work-cli): Add `--no-config-cache` flag.
```

### Iteration: Update Config Knowledge

**Id:** `update-config-knowledge`

**Status:** `READY`

**Purpose:** Document the config cache and the `--no-config-cache` flag for users and maintainers.

**Description:** Add user-facing config and options sections to the package README, and a Cache subsection to the config design doc covering location, automatic invalidation, and manual busting.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/update-config-knowledge.md`

**Changes:**

In `$ART_WORK/cli/work/README.md`:

- Add `## Config` immediately after the `## Installation` section (before `## Usage`), with a sample manifest:

```ts
import { defineConfig } from '@art-work/cli/config';

export default defineConfig({
  clone: {
    path: 'checkouts',
  },
  checkouts: {
    path: '_records/checkouts',
    template: '.agents/domains/workspace/templates/checkout.art.njk',
  },
  records: {
    base: '_records',
    gitignore: false,
  },
});
```

- Add `## Options` after the `### Commands` list (before `## Development`), with one entry:

```md
- `--no-config-cache` — Ignore the config cache, recompile the config, and refresh the cache for this run.
```

In `$ART_WORK/cli/work/architecture/design/config.md`:

- Add `### Cache` under `## Overview` (before `## Configuration Structure`), covering three points:
  - **Where** — `<workspace root>/node_modules/.art-work/` holds `config.bundle.mjs` and `config.cache.json`.
  - **Automatic invalidation** — `config.cache.json` records a sha256 per esbuild input; a changed, missing, or unreadable input, a missing bundle, unparseable metadata, or a `version` mismatch triggers a rebuild.
  - **Manual bust** — run any command with `--no-config-cache`, or delete `node_modules/.art-work/`.

In `$ART_WORK/cli/work/src/`:

- No unit test changes — documentation only.

**Dependencies:**

- Iteration: Add No Config Cache Flag.

#### Commits:

| ID                        | Repository / Checkout / Branch      | Policy       | Hash | Status     |
| ------------------------- | ----------------------------------- | ------------ | ---- | ---------- |
| `update-config-knowledge` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `update-config-knowledge`

**Message:**

```text
docs(art-work-cli): Document config cache and no-config-cache option.
```

---

## Coordination

### Not In Scope

- **Config schema and discovery** — owned by `plan-art-work-cli-global-install`, Iterations: Refactor Config Semantics and Discover configuration file.
- **`.art-workspace/` cache location** — rejected alternative; would need a `.gitignore` entry in every workspace.

### Evidence

- **Cache reuse observable** — run any command twice in `$WORKSPACE`; the second run reports reuse and leaves `node_modules/.art-work/config.bundle.mjs` untouched.

### Findings

- **Root-level bundle** — `loadWorkspaceConfig` writes `.art-workspace-bundle.mjs` at the workspace root today, which is why the workspace `.gitignore` carries an entry for it. The delivery report of `plan-workspace-cli-sanity-clone-branch` already recommended a hidden location.
- **Many call sites** — `loadWorkspaceConfig(root)` is called from every command action in `$ART_WORK/cli/work/src/index.ts`; the bypass flag must be threaded through all of them.
- **Overlap with global-install** — Iteration: Discover configuration file compiles config through the same code path and currently targets a `.art` temp directory.

### Decisions

- **Cache location `node_modules/.art-work/`** — chosen over `.art-workspace/` because `node_modules/` is already git-ignored in every workspace, so no `.gitignore` changes are needed.
- **Content hash, not timestamp** — sha256 over every esbuild input (from `metafile`) invalidates correctly when an imported file changes; mtimes are unreliable across checkouts and restores.
- **Degrade gracefully** — a missing or unwritable cache falls back to compiling without caching; caching never fails a run.
- **Bypass refreshes the cache** — `--no-config-cache` rebuilds and rewrites the metadata so the next run is warm.
- **Instructions mode per iteration** — all 4 iterations are `INSTRUCTIONS_SELF_CONTAINED_FILE`. The Plan Iterations rule routes an iteration to file mode when it has 3+ commit steps or needs code samples / file-by-file detail; Update Config Knowledge qualifies on the latter. Every iteration carries a generated `./instructions/{id}.md`.
- **Integration coverage lives with the flag** — `cli/work/test/config.test.ts` proves cross-process reuse, invalidation, and bypass; unit tests in `loadWorkspaceConfig.test.ts` cover the branch logic.

### Knowledge to Update

- **`cli/work/README.md` and `cli/work/architecture/design/config.md`** — delivered by Iteration: Update Config Knowledge.
- **`cli/work/architecture/adr/cli.art`** — "Runtime Config Loading — esbuild Bundle-at-Runtime" does not yet record the cache location or the bypass flag; not covered by an iteration.

### Follow Ups

- **Reconcile `plan-art-work-cli-global-install`** — align its `compile-config-to-temp-dir` commit with the `node_modules/.art-work/` location decided here.
- **README sample schema drift** — the sample uses the current `clone` / `checkouts` / `records` shape; re-verify it after `plan-art-work-cli-global-install`, Iteration: Refactor Config Semantics changes the schema.
- **Workspace `.gitignore` cleanup** — drop the stale `.art-workspace-bundle.mjs` entry from workspace `.gitignore` files (outside `$ART_WORK`).

### Feedback

- **Commit sections lack `**Repository:**`** — `commit.tart` renders `Repository` + `Message` per `##### Commit:`; the 4 commit sections carry only the message. No worker impact — the repository is listed in the Commits tables and in the instruction files.
- **Optional template sections not rendered** — `Resource Types in Scope`, `Workflows` / `Workflow Operations`, `Execution Context`; template completeness only, no worker impact.
