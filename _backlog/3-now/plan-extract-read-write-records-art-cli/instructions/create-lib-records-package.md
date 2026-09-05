# Instructions: `create-lib-records-package`

**Plan:** `extract-read-write-records-art-lib`

**Iteration Id:** `create-lib-records-package`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-extract-read-write-records-art-lib/instructions/create-lib-records-package__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-lib-records-package`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-lib-records-package`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the Lib Records package in the art-lib repository: canonical name `@art-lib/fs-records` at path `libs/records`, with package.json, tsconfig, vitest config, a stub entry point, and the package record.

## Mandatory Reading

- ::READ `$ART_DOMAINS/_backlog/3-now/plan-extract-read-write-records-art-cli/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$ART_CLI/package.json` (Source) — Art-cli root package.json; confirms the `libs/**` workspace pattern.
- ::READ `$ART_CLI/_records/project.art` (Source) — Art-cli project record; confirms Package: Lib Records (PLANNED) is registered.
- ::READ `$ART_CLI/tsconfig.json` (Source) — Art-cli root tsconfig to extend.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_CLI/libs/records` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_CLI/_guide.md`)

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

- Step 1 / 4 — Create the Lib Records package skeleton
- Step 2 / 4 — Add the package record
- Step 3 / 4 — Commit `create-lib-records-package` and push
- Step 4 / 4 — Report

## Steps

### Step `1 / 4` — Create the Lib Records package skeleton

**1a. Create the package directory:**

```bash
mkdir -p $ART_CLI/libs/records/src
```

**1b. Create `$ART_CLI/libs/records/package.json`:**

```json
{
  "name": "@art-lib/fs-records",
  "version": "0.0.1",
  "description": "Generic record read/write modules for Art MD record files.",
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist", "LICENSE-MIT", "README.md"],
  "scripts": {
    "build": "tsc --emitDeclarationOnly && esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --format=esm --packages=external",
    "build:clean": "rm -rf dist",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "prettier . -c && eslint . && tsc --noEmit",
    "lint:fix": "prettier . -c --write && eslint . --fix",
    "ci": "npm run lint && npm run build && npm run test"
  },
  "devDependencies": {
    "@types/node": "^25.9.3",
    "esbuild": "^0.28.0",
    "typescript": "5.9.3",
    "vitest": "4.1.8"
  }
}
```

**1c. Create `$ART_CLI/libs/records/tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**1d. Create `$ART_CLI/libs/records/vitest.config.ts`:**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

**1e. Create the stub entry point `$ART_CLI/libs/records/src/index.ts`:**

```ts
export {};
```

**1f. Create `$ART_CLI/libs/records/README.md`:**

```md
# @art-lib/fs-records

> Generic record read/write modules for Art MD record files.

This package is part of the [Art Cli toolkit](../../README.md).

## Development

Make sure you read the [Art Cli README](../../README.md) first.

### Build Targets

This library is packaged for use in bundlers such as Vite and Astro. The main entry point is the TypeScript source code.

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run build` — Build the library
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run ci` — Run CI pipeline
- **$** `npm run test` — Run tests

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
```

**1g. Copy the license:**

```bash
cp $ART_CLI/LICENSE-MIT $ART_CLI/libs/records/LICENSE-MIT
```

**Expected outcome:** `$ART_CLI/libs/records` contains the package skeleton; `npm ci` from `$ART_CLI` picks up the new workspace.

### Step `2 / 4` — Add the package record

Create `$ART_CLI/libs/records/_records/package.art`:

```art
# Module

## Package: Lib Records

**Purpose:** Generic record read/write modules for Art MD record files.

**Description:** Find, read, and filter Art MD record files across a search path, honoring gitignore and configured patterns.

**Owner:** Project: Art Cli

**Namespace:** Namespace: Art Cli

**Author:** Noodlestan Collective

**Path:** `art-lib/libs/fs-records/`

**Canonical Name:** `@art-lib/fs-records`

**Published:** `false`

**Private:** `false`

**Language:** TypeScript

**Engines:**

- Node: `>= 22`

**PackageManager:** `npm@10.2.3`

**PackageFile:** `package.json`

**License:** License: Noodlestan 2026 MIT
```

**Expected outcome:** the package record exists at `$ART_CLI/libs/records/_records/package.art`.

---

#### Commit: `create-lib-records-package`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
scaffold(art-lib): Create lib/records package `@art-lib/fs-records`.

- Create Package: Lib Records at libs/records with canonical @art-lib/fs-records.
- Add package record, scaffold, and stub entry point.
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
- Verify that `$ART_CLI/libs/records` exists with package.json (`@art-lib/fs-records`), tsconfig, vitest config, stub entry point, README, license, and package record.
- Verify that `npm ci` from `$ART_CLI` recognizes the new workspace.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
