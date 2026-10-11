# Plan: Add Config Cache

**ID:** `add-config-cache`

**Status:** `DRAFT`

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

Move the compiled config bundle out of the workspace root into `node_modules/.art-work/`, reuse it while the config sources are unchanged, and add `--no-config-cache` to force a rebuild — touching only config loading, CLI option plumbing, their tests, and the config architecture knowledge.

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

Changes confined to config loading and CLI option plumbing in `$ART_WORK/cli/work/src/config/` and `$ART_WORK/cli/work/src/index.ts`, their unit tests, and the config architecture knowledge. No change to the config schema, config discovery, or command behaviour beyond skipping the esbuild build when the cache is valid.

## Work

### Next

- Refine the 3 `DRAFT` iterations (`plan more`), then generate their instructions (`write instructions`) before delegating.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Do NOT run `npm install` inside `$ART_WORK` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

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
| Iteration: Move Config Bundle To Cache | `DRAFT` |
| Iteration: Cache Config By Source Hash | `DRAFT` |
| Iteration: Add No Config Cache Flag    | `DRAFT` |

### Iteration: Move Config Bundle To Cache

**Id:** `move-config-bundle-to-cache`

**Status:** `DRAFT`

**Purpose:** Stop writing the compiled configuration bundle into the workspace root.

**Description:** Relocate the esbuild output from `.art-workspace-bundle.mjs` at the workspace root into `node_modules/.art-work/`, and stop producing the root-level file.

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

| ID                            | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| ----------------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `move-config-bundle-to-cache` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `move-config-bundle-to-cache`

**Message:**

```text
build(art-work-cli): Move compiled config into `node_modules/.art-work`.
```

### Iteration: Cache Config By Source Hash

**Id:** `cache-config-by-source-hash`

**Status:** `DRAFT`

**Purpose:** Reuse the cached compilation while the configuration sources are unchanged.

**Description:** Record change-tracking metadata beside the compiled bundle and skip the esbuild build when every recorded input still hashes the same.

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
- Report the decision (reused / rebuilt) through the operation log so each run shows whether the cache was used.

**Dependencies:**

- Iteration: Move Config Bundle To Cache.

#### Commits:

| ID                            | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| ----------------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `cache-config-by-source-hash` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `cache-config-by-source-hash`

**Message:**

```text
build(art-work-cli): Reuse compiled config when sources are unchanged.
```

### Iteration: Add No Config Cache Flag

**Id:** `add-no-config-cache-flag`

**Status:** `DRAFT`

**Purpose:** Let an operator force a config recompile for a single invocation.

**Description:** Add a `--no-config-cache` option that bypasses the cached compilation, rebuilds, and refreshes the cache before the command runs.

**Changes:**

In `$ART_WORK/cli/work/src/index.ts`:

- Declare `--no-config-cache` on the program. Commander's `--no-<name>` idiom gives `configCache: true` by default and `false` when the flag is passed.
- Confirm the flag is accepted where operators expect it. If Commander rejects it after the subcommand, either document `art-work --no-config-cache <command>` or call `program.enablePositionalOptions()`.
- Thread the value into every command action's `loadWorkspaceConfig(root)` call via `command.optsWithGlobals()`.

In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`:

- Extend the signature to `loadWorkspaceConfig(rootPath, options?: { cache?: boolean })`.
- When `options.cache === false`: skip the cache read, rebuild, overwrite the bundle and metadata, then import.
- Emit an operation through the logger when the cache is bypassed so the behaviour is visible in the run.

In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts`:

- Assert the default honours a valid cache (second call does not rebuild).
- Assert the bypass flag rebuilds and refreshes `config.cache.json`.

**Dependencies:**

- Iteration: Cache Config By Source Hash.

#### Commits:

| ID                         | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| -------------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `add-no-config-cache-flag` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `add-no-config-cache-flag`

**Message:**

```text
build(art-work-cli): Add `--no-config-cache` flag.
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

### Knowledge to Update

- **`$ART_WORK/cli/work/architecture/design/config.md`** — Loading Mechanism steps 3–4 now target the cache directory, plus the invalidation rule.
- **`$ART_WORK/cli/work/architecture/adr/cli.art`** — "Runtime Config Loading — esbuild Bundle-at-Runtime": record the cache location and bypass flag.

### Follow Ups

- **Reconcile `plan-art-work-cli-global-install`** — align its `compile-config-to-temp-dir` commit with the `node_modules/.art-work/` location decided here.
- **Workspace `.gitignore` cleanup** — drop the stale `.art-workspace-bundle.mjs` entry from workspace `.gitignore` files (outside `$ART_WORK`).

### Feedback

- None.
