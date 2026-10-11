# Instructions: `cache-config-by-source-hash`

**Plan:** `add-config-cache`

**Iteration Id:** `cache-config-by-source-hash`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config-cache/instructions/cache-config-by-source-hash__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `cache-config-by-source-hash`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `cache-config-by-source-hash`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

This section describes the goal(s) of this iteration.

Reuse the cached compilation while the configuration sources are unchanged: record change-tracking metadata beside the compiled bundle, and skip the esbuild build entirely when every recorded input still hashes the same.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- config design: `$ART_WORK/cli/work/architecture/design/config.md` (Loading Mechanism)
- config loader: `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`
- cache helpers: `$ART_WORK/cli/work/src/config/cache.ts` (created by Iteration: Move Config Bundle To Cache)
- architecture: `$ART_WORK/cli/work/architecture/index.md`
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

- Step 1 / 2 — Record and honour the source-hash cache metadata
- Step 2 / 2 — Commit `cache-config-by-source-hash`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 2` — Record and honour the source-hash cache metadata

**Goal:** the second run against an unchanged config reuses the bundle; any changed input triggers a rebuild.

1. In `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts`, add `metafile: true` to the `build()` options so the build reports every input file it bundled.
2. After a successful build, compute the input records:

```ts
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

async function hashInputs(rootPath: string, inputs: Record<string, unknown>) {
  return Promise.all(
    Object.keys(inputs).map(async path => {
      const absolute = resolve(rootPath, path);
      const bytes = await readFile(absolute);
      return { path, hash: createHash('sha256').update(bytes).digest('hex') };
    }),
  );
}
```

3. Write `config.cache.json` next to the bundle (`join(resolveCacheDir(rootPath), META_FILE)`), shape:

```json
{
  "version": 1,
  "compiledAt": "2026-10-11T00:00:00.000Z",
  "manifest": "<absolute path to .art-workspace.mts>",
  "inputs": [{ "path": ".art-workspace.mts", "hash": "<sha256>" }]
}
```

4. Before calling `build()`, take the read path. Rebuild when any of these hold; otherwise import the cached bundle and skip `build()`:
   1. `config.cache.json` is missing, unparseable, or its `version` is not `1`.
   2. The bundle file is missing.
   3. Any recorded input file is missing or its sha256 no longer matches.
5. Record every file from `metafile.inputs`, not only the manifest, so a change to a file imported by the manifest invalidates the cache too. Store paths relative to `rootPath`.
6. Prefer content hashes over mtime — mtimes reset on `git checkout`, restores, and container binds.
7. Log the decision with `console.info` (`config: reused cached bundle` / `config: rebuilt bundle`). The module has no logger dependency; introducing one is out of scope.
8. Extend `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.test.ts` with:
   - Valid cache → a second call imports the bundle and does **not** call `build()` (spy on `esbuild.build`).
   - Edited manifest → rebuilds and rewrites `config.cache.json`.
   - Edited file imported by the manifest → rebuilds (proves `metafile.inputs` coverage).
   - Missing bundle, missing `config.cache.json`, unparseable metadata, and `version` mismatch → rebuild.
   - Unreadable cache directory → warns and still returns a config (no throw).

**Verification:** from `$ART_WORK`, run `npm run ci` — lint, unit tests, integration tests, and build must all pass.

### Step `2 / 2` — Commit `cache-config-by-source-hash`

---

#### Commit: `cache-config-by-source-hash`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(art-work-cli): Reuse compiled config when sources are unchanged.
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that a second load against an unchanged manifest does not invoke `esbuild.build`.
- Verify that editing the manifest, or a file it imports, triggers a rebuild on the next load.
- Verify that `config.cache.json` records a sha256 for every file in `metafile.inputs`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
