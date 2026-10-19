# Instructions: `update-config-knowledge`

**Plan:** `add-config-cache`

**Iteration Id:** `update-config-knowledge`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config-cache/instructions/update-config-knowledge__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-config-knowledge`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-config-knowledge`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

This section describes the goal(s) of this iteration.

Document the config cache and the `--no-config-cache` flag for users and maintainers: add user-facing config and options sections to the package README, and a Cache subsection to the config design doc covering location, automatic invalidation, and manual busting.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- config design: `$ART_WORK/cli/work/knowledge/design/config.md`
- package README: `$ART_WORK/cli/work/README.md`
- config loader: `$ART_WORK/cli/work/src/config/loadWorkspaceConfig.ts` (source of truth for cache behaviour)
- knowledge: `$ART_WORK/cli/work/knowledge/index.md`
- guide: `$WORKSPACE/_guide.md`

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

- Step 1 / 3 — Add `## Config` and `## Options` to the package README
- Step 2 / 3 — Add `### Cache` to the config design doc
- Step 3 / 3 — Commit `update-config-knowledge`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 3` — Add `## Config` and `## Options` to the package README

**Goal:** a reader can author a config and discover the cache-bypass flag from `$ART_WORK/cli/work/README.md`.

1. Add `## Config` immediately after the `## Installation` section (before `## Usage`), with this sample manifest:

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

2. Add `## Options` after the `### Commands` list (before `## Development`), with one entry:

```md
- `--no-config-cache` — Ignore the config cache, recompile the config, and refresh the cache for this run.
```

### Step `2 / 3` — Add `### Cache` to the config design doc

**Goal:** maintainers know where the cache lives and how it is invalidated.

In `$ART_WORK/cli/work/knowledge/design/config.md`, add `### Cache` under `## Overview` (before `## Configuration Structure`) covering three points:

- **Where** — `<workspace root>/node_modules/.art-work/` holds `config.bundle.mjs` and `config.cache.json`.
- **Automatic invalidation** — `config.cache.json` records a sha256 per esbuild input; a changed, missing, or unreadable input, a missing bundle, unparseable metadata, or a `version` mismatch triggers a rebuild.
- **Manual bust** — run any command with `--no-config-cache`, or delete `node_modules/.art-work/`.

No unit test changes — documentation only.

**Verification:** from `$ART_WORK`, run `npm run ci` — lint must pass (prettier formats the markdown).

### Step `3 / 3` — Commit `update-config-knowledge`

---

#### Commit: `update-config-knowledge`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
docs(art-work-cli): Document config cache and no-config-cache option.
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `## Config` appears after `## Installation` and before `## Usage` in the README.
- Verify `## Options` appears after the `### Commands` list and before `## Development`.
- Verify `### Cache` appears under `## Overview` and before `## Configuration Structure` in the design doc.
- Verify the documented behaviour matches `loadWorkspaceConfig.ts` (location, invalidation triggers, bypass).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
