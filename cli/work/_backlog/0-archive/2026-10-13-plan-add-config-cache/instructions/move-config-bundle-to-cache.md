# Instructions: `move-config-bundle-to-cache`

**Plan:** `add-config-cache`

**Iteration Id:** `move-config-bundle-to-cache`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config-cache/instructions/move-config-bundle-to-cache__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `move-config-bundle-to-cache`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `move-config-bundle-to-cache`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

This section describes the goal(s) of this iteration.

Stop writing the compiled configuration bundle into the workspace root: relocate the esbuild output from `.art-workspace-bundle.mjs` at the workspace root into `node_modules/.art-work/`, stop producing the root-level file, and prove the relocation with unit tests.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- config design: `$ART_WORK/cli/work/knowledge/design/config.md` (Loading Mechanism)
- config loader: `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` (current manifest/temp file handling)
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

- Step 1 / 2 — Relocate the compiled config bundle into `node_modules/.art-work/`
- Step 2 / 2 — Commit `move-config-bundle-to-cache`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 2` — Relocate the compiled config bundle into `node_modules/.art-work/`

**Goal:** the compiled bundle lives under `<workspace root>/node_modules/.art-work/` and the workspace root stays clean.

1. Create `$ART_WORK/cli/work/src/config/cache.ts` with the cache location helpers:

```ts
import { join } from 'node:path';

export const CACHE_DIR = ['node_modules', '.art-work'] as const;
export const BUNDLE_FILE = 'config.bundle.mjs';
export const META_FILE = 'config.cache.json';

export function resolveCacheDir(rootPath: string): string {
  return join(rootPath, ...CACHE_DIR);
}

export function resolveBundlePath(rootPath: string): string {
  return join(resolveCacheDir(rootPath), BUNDLE_FILE);
}
```

2. In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`:
   - Delete `const TEMP_FILE = '.art-workspace-bundle.mjs';` and its use at `join(rootPath, TEMP_FILE)`.
   - Import `resolveCacheDir`, `resolveBundlePath` from `./cache`.
   - Before writing, create the directory: `await mkdir(resolveCacheDir(rootPath), { recursive: true })`.
   - Write the bundle to `resolveBundlePath(rootPath)` and `import()` that path.
3. Degrade gracefully — cache problems MUST NOT fail a run:
   - Wrap directory creation and bundle writing in try/catch.
   - On failure, `console.warn` a single message naming the cache path, then fall back to writing the bundle to `join(tmpdir(), 'art-work-config-bundle.mjs')` so the command still loads a config.
4. Best-effort cleanup: if `<rootPath>/.art-workspace-bundle.mjs` exists, remove it with `rm(path, { force: true })` inside a try/catch. Never fail on it.
5. Extend `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts` with:
   - After a successful load, `<tempDir>/node_modules/.art-work/config.bundle.mjs` exists.
   - `<tempDir>/.art-workspace-bundle.mjs` does **not** exist.
   - A cache directory that cannot be created produces a warning and still returns a config (no throw).

**Verification:** from `$ART_WORK`, run `npm run ci` — lint, unit tests, integration tests, and build must all pass.

### Step `2 / 2` — Commit `move-config-bundle-to-cache`

---

#### Commit: `move-config-bundle-to-cache`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(art-work-cli): Move compiled config into `node_modules/.art-work`.
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that no code path writes `.art-workspace-bundle.mjs` at the workspace root.
- Verify that the bundle and any cache metadata land under `<workspace root>/node_modules/.art-work/`.
- Verify that an unusable cache directory warns and the run still completes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
