# Instructions: `add-no-config-cache-flag`

**Plan:** `add-config-cache`

**Iteration Id:** `add-no-config-cache-flag`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config-cache/instructions/add-no-config-cache-flag__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-no-config-cache-flag`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`  | Provided with prompt         | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-building` |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-no-config-cache-flag`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

This section describes the goal(s) of this iteration.

Let an operator force a config recompile for a single invocation: add a `--no-config-cache` option that bypasses the cached compilation, rebuilds, refreshes the cache, and is covered by unit and cross-process integration tests.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- config design: `$ART_WORK/cli/work/knowledge/design/config.md` (Loading Mechanism)
- config loader: `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`
- CLI entry: `$ART_WORK/cli/work/src/index.ts` (commander program and command actions)
- integration harness: `$ART_WORK/cli/work/test/integration.test.ts` and `$ART_WORK/cli/work/test/helpers/`
- knowledge: `$ART_WORK/cli/work/knowledge/index.md`
- guide: `$WORKSPACE/_guide.md`
- Conventions: Typescript — `$ART_WORK/node_modules/@noodlestan/conventions-typescript/art/index.md`
- Conventions: Unit Tests — `$ART_WORK/node_modules/@noodlestan/conventions-unit-tests/art/index.md`

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

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 4 — Declare `--no-config-cache` and thread it into config loading
- Step 2 / 4 — Bypass the cache when the flag is set
- Step 3 / 4 — Add unit and integration coverage
- Step 4 / 4 — Commit `add-no-config-cache-flag`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 4` — Declare `--no-config-cache` and thread it into config loading

**Goal:** the flag exists on the program and reaches every config load.

1. In `$ART_WORK/cli/work/src/index.ts`, declare it on the program next to `.version(...)`:

```ts
program.option('--no-config-cache', 'Ignore the config cache and recompile the config');
```

Commander's `--no-<name>` idiom gives `configCache: true` by default and `false` when the flag is passed. 2. Confirm the flag is accepted where operators expect it. If Commander rejects it after the subcommand, either document it as a program-level option (before the subcommand) or call `program.enablePositionalOptions()`. 3. Thread the value into **every** command action that calls `loadWorkspaceConfig(root)` via `command.optsWithGlobals()`:

```ts
const config = await loadWorkspaceConfig(root, {
  cache: command.optsWithGlobals().configCache !== false,
});
```

4. Update every call site in `index.ts` — none may keep the single-argument form.

### Step `2 / 4` — Bypass the cache when the flag is set

**Goal:** `cache: false` skips the read path, rebuilds, and refreshes the cache before the command runs.

1. In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`, extend the signature:

```ts
export async function loadWorkspaceConfig(
  rootPath: string,
  options?: { cache?: boolean },
): Promise<WorkspaceConfig>;
```

2. When `options?.cache === false`: skip the metadata read entirely, run `build()`, overwrite the bundle and `config.cache.json`, then import.
3. Log the bypass with `console.info` (`config: cache bypassed, rebuilt bundle`) — the module has no logger dependency; introducing one is out of scope.

### Step `3 / 4` — Add unit and integration coverage

**Goal:** the flag and the cross-process cache behaviour are proven.

1. In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts`:
   - Default honours a valid cache — second call does not rebuild.
   - `cache: false` rebuilds and refreshes `config.cache.json`.
2. Create `$ART_WORK/cli/work/test/config.test.ts`, alongside `integration.test.ts`, reusing `setupWorkspace`, `spawnCli`, and the `tempDirs` cleanup:
   - Two runs against an unchanged manifest → the second run reuses the cache.
   - Editing `.art-workspace.mts` between runs → the next run rebuilds.
   - `--no-config-cache` → rebuilds and refreshes `config.cache.json`.
   - The cache is created under `<workspace root>/node_modules/.art-work/` and never at the workspace root.
   - Teardown removes any cache written by the run (extend the `tempDirs` cleanup).

**Verification:** from `$ART_WORK`, run `npm run ci` — lint, unit tests, integration tests, and build must all pass.

### Step `4 / 4` — Commit `add-no-config-cache-flag`

---

#### Commit: `add-no-config-cache-flag`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(art-work-cli): Add `--no-config-cache` flag.
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify every `loadWorkspaceConfig(root)` call site in `index.ts` now passes the cache option.
- Verify a second run reuses the cache, an edited manifest rebuilds, and `--no-config-cache` forces a rebuild.
- Verify no cache artefact is written at the workspace root.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
