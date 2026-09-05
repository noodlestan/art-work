# Instructions: `require-all-arg-in-all-commands`

**Plan:** `scope-commands-to-checkouts`

**Iteration Id:** `require-all-arg-in-all-commands`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-scope-commands-to-checkouts/instructions/require-all-arg-in-all-commands__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `require-all-arg-in-all-commands`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `require-all-arg-in-all-commands`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Require `-c <pattern>` or `--all` in `pull`, `push`, `sync`, and `branch`. Remove implicit all-checkouts fallback. Update `-c` description.

## Mandatory Reading

- ::READ `$PROJECT/_backlog/3-now/plan-scope-commands-to-checkouts/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$PROJECT/src/index.ts` (Source) — All command declarations.
- ::READ `$PROJECT/src/commands/pull/runPull.ts` (Source) — Pull command implementation.
- ::READ `$PROJECT/src/commands/push/runPush.ts` (Source) — Push command implementation.
- ::READ `$PROJECT/src/commands/sync/runSync.ts` (Source) — Sync command implementation.
- ::READ `$PROJECT/src/commands/branch/runBranch.ts` (Source) — Branch command implementation.
- ::READ `$PROJECT/architecture/commands.md` (Knowledge) — Command documentation.
- ::READ `$PROJECT/architecture/_pseudo.md` (Knowledge) — Pseudo-code.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

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

- Step 1 / 2 — Update `-c` option description in `src/index.ts` for pull, push, sync, branch
- Step 2 / 2 — Add `--all` to pull, push, sync, branch, remove fallback, update tests and docs

## Steps

### Step `1 / 2` — Update `-c` option description

In `$PROJECT/src/index.ts`, find all occurrences of:

```ts
.option('-c, --checkouts <PATTERN...>', 'checkout location patterns')
```

Replace with:

```ts
.option('-c, --checkouts <PATTERN...>', 'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"')
```

This applies to: `pull`, `push`, `sync`, `branch`.

---

### Step `2 / 2` — Add `--all` and remove fallback

In `$PROJECT/src/index.ts`, add to each of `pull`, `push`, `sync`, `branch`:

```ts
.option('-A, --all', 'Apply to all checkouts')
```

Update action handlers to validate: either `checkouts` or `all` must be provided. If neither: print usage and exit.

Usage message template:

```ts
console.error('No checkouts matched.');
console.error(
  `Usage: Use \`art-workspace ${commandName} [options] -c <pattern>\` or \`art-workspace ${commandName} [options] --all\` if you want to apply the ${commandName} to all checkouts.`,
);
```

In `runPull.ts`, `runPush.ts`, `runSync.ts`:

- Update signatures to accept `{ checkouts?: string[]; all?: boolean }`.
- Add validation at top: if `!options.all && (!options.checkouts || options.checkouts.length === 0)`, print usage and return.
- Remove the fallback `getAllCheckouts()`.

In `runBranch.ts`:

- Update signature to accept `{ branch: string; checkouts?: string[]; all?: boolean }`.
- Add validation as above.
- Remove the fallback `getAllCheckouts()`.

**Tests:** For each command, add tests for: `-c` with patterns, `--all`, neither flag prints usage, `-c` with no matches warns.

**Docs:** Update `$PROJECT/architecture/commands.md` and `$PROJECT/architecture/_pseudo.md`.

---

#### Commit: `require-checkouts-or-all-in-all-commands`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli-one): Require -c or --all in commands; remove implicit fallback.

- Add -A, --all to pull, push, sync, branch
- Update -c description to be more descriptive with examples
- Remove implicit getAllCheckouts() fallback; require -c or --all
- Print usage message when neither -c nor --all provided
- Update tests for all changed commands
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that all 4 commands now require either `-c` or `--all` and print usage when neither is provided.
- Verify that the `-c` option description is updated to the new verbose format.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
