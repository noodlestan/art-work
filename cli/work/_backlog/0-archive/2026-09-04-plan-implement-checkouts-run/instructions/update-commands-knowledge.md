# Instructions: `update-commands-knowledge`

**Plan:** `implement-checkouts-run`

**Iteration Id:** `update-commands-knowledge`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-checkouts-run/instructions/update-commands-knowledge__report.md`. No separate delegation record is created.
4. Generate the response and send it back to the delegator.
5. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-commands-knowledge`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-commands-knowledge`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Capture the `checkout run` command in the architecture knowledge so the command surface and pseudo-code stay current: add `checkout run <command...> [-c <PATTERN...>] [-A, --all]` to the command surface table in `architecture/commands.md`, document the command under a new `## Checkout Run` section, and add the `checkout run` use case plus the `runCommandInDirectory`/`doCheckoutRun` helpers to `architecture/_pseudo.md`.

## Mandatory Reading

- ::READ `$PROJECT/_backlog/3-now/plan-implement-checkouts-run/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
- ::READ `$PROJECT/architecture/commands.md` (Knowledge) — Command surface and command documentation to update.
- ::READ `$PROJECT/architecture/_pseudo.md` (Knowledge) — Pseudo-code contract to update.
- ::READ `$PROJECT/_backlog/1-done/plan-scope-commands-to-checkouts/instructions/update-commands-knowledge.md` (Reference) — Reference knowledge-update iteration from the scope plan; follow its style.
- ::READ `$PROJECT/src/commands/checkout/runCheckoutRun.ts` (Source) — The implemented handler to document.
- ::READ `$PROJECT/src/private/commands/checkouts/doCheckoutRun.ts` (Source) — The per-checkout helper to document.
- ::READ `$PROJECT/src/private/exec/runCommandInDirectory.ts` (Source) — The exec helper to document.

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

- Step 1 / 3 — Update `architecture/commands.md` (command surface + `## Checkout Run` section)
- Step 2 / 3 — Update `architecture/_pseudo.md` (use case + helpers)
- Step 3 / 3 — Commit `document-checkout-run-command`

## Steps

### Step `1 / 3` — Update `architecture/commands.md`

**1a. Add `checkout run` to the Command Surface table** in `$PROJECT/architecture/commands.md`, after the `sync` row:

| command        | usage                                                     | status      |
| -------------- | --------------------------------------------------------- | ----------- |
| `checkout run` | `checkout run <command...> [-c <PATTERN...>] [-A, --all]` | implemented |

**1b. Add a `## Checkout Run` section** after the `## Sync` section (before `## Repo`), following the style of the other command sections:

````md
## Checkout Run

**Usage:** `checkout run <command...> [-c <PATTERN...>] [-A, --all]`

Run an arbitrary shell command in each selected checkout. The command string is the only positional; inner flags must be passed after `--` (e.g. `checkout run npm run ci -- --filter x`). See [Command Arguments](#command-arguments) for `--checkouts` and `--all` behaviour.

**BDD:**

```gherkin
Feature: Run a command across checkouts
  Scenario: run executes the command in matching checkouts
    Given checkout "Artificial" is cloned at "checkouts/artificial"
    And checkout "Purrception" is cloned at "checkouts/purrception"
    When I run "art-workspace checkout run touch marker.txt -c art*"
    Then a file "marker.txt" exists in checkout "Artificial"
    And no file "marker.txt" exists in checkout "Purrception"
    And a run operation is logged with outcome success for "Artificial"

  Scenario: run --all executes in every checkout
    Given checkout "Artificial" is cloned
    And checkout "Purrception" is cloned
    When I run "art-workspace checkout run touch marker.txt --all"
    Then a file "marker.txt" exists in checkout "Artificial"
    And a file "marker.txt" exists in checkout "Purrception"

  Scenario: run without -c or --all prints usage and exits
    When I run "art-workspace checkout run touch marker.txt"
    Then a usage message is printed
    And no run operation is logged

  Scenario: run logs failure on non-zero exit
    Given checkout "Artificial" is cloned
    When I run "art-workspace checkout run sh -c 'exit 1' --all"
    Then a run operation is logged with outcome failure for "Artificial"

  Scenario: run skips uncloned checkouts with a failure
    Given checkout "Purrception" is recorded but not cloned
    When I run "art-workspace checkout run touch marker.txt --all"
    Then a run operation is logged with outcome failure for "Purrception"
    And the failure message is "checkout not cloned"

  Scenario: run warns when no checkout matches
    When I run "art-workspace checkout run touch marker.txt -c nonexistent"
    Then a warning is printed for "no checkout matches pattern"
    And no run operation is logged
```

**Edge cases:**

- Neither `-c` nor `--all` → usage message, no operation.
- No checkout matches the pattern → warning, no operation.
- Checkout not cloned → failure operation `checkout not cloned`, continue.
- Command exits non-zero → failure operation, continue with other checkouts.
- Spawn error (unknown command) → failure operation, continue.
- Inner flags must be passed after `--` (e.g. `checkout run npm run ci -- --filter x`).
````

**Expected outcome:** `checkout run` appears in the Command Surface table and has a full `## Checkout Run` section documenting usage, the `-c`/`--all` requirement, the `--` convention, BDD scenarios, and edge cases.

---

### Step `2 / 3` — Update `architecture/_pseudo.md`

**2a. Update the Entry Point route line** in `$PROJECT/architecture/_pseudo.md` to include `checkout run`:

```pseudo
  route to: clone | branch | repo | link | links | unlink | sanity | pull | push | sync | checkout run | publish
```

**2b. Update the Operation Logs section** — add the `run` kind and its factories:

```md
- **Kinds** — `clone`, `push`, `pull`, `publish`, `branch`, `linked`, `unlink`, `run`
- **Factories** — one per kind in `src/private/operations/`: `createCloneSuccess`, `createPushSuccess`, `createPushFailure`, `createPullSuccess`, `createPullFailure`, `createBranchSuccess`, `createBranchFailure`, `createLinkedSuccess`, `createLinkedFailure`, `createUnlinkSuccess`, `createUnlinkFailure`, `createCheckoutRunPending`, `createCheckoutRunSuccess`, `createCheckoutRunFailure`, etc. Read-only commands (`repo`, `links`) never log operations — their failures surface as report states.
```

**2c. Add the `checkout run` use case** after the `sync` use case (before `publish`), following the `pull`/`push`/`sync` pseudo pattern:

```pseudo
### Command: checkout run <command...> [-c <PATTERN...>] [-A, --all]

**Responsibility:** Run an arbitrary shell command in each selected checkout. Either `-c` or `--all` must be provided. Inner flags are passed after `--`. See [Command Arguments](#command-arguments) for `--checkouts` and `--all` behaviour.

checkout run(command, options)
  ctx = createWorkspaceContext(config, store, log)
  hydrate(ctx)
  scanAllCheckoutsStates(ctx)

  if not options.all and (not options.checkouts or options.checkouts is empty):
    print "No checkouts matched."
    print "Usage: Use `art-workspace checkout run [options] -c <pattern>` or `art-workspace checkout run [options] --all` if you want to run the command in all checkouts."
    return

  if options.all:
    targets = ctx.store.getAllCheckouts()
  else:
    targets = ctx.store.getCheckoutsByPattern(options.checkouts)

  for checkout in targets:
    doCheckoutRun(ctx, checkout, command)

  presentCheckoutReport(ctx.config, ctx.store.getAllCheckouts())
  presentOperationsReport(ctx.log)
```

**2d. Add the exec helpers to the Auxiliary Functions section** (after `pushCheckout`), documenting the actual implementation read in Mandatory Reading:

```pseudo
### Function: runCommandInDirectory(dir, command)

**Responsibility:** Execute a shell command in a directory via spawn with `cwd` = dir. Resolves on exit code 0; rejects on non-zero exit or spawn error. Reusable by the future `package run` command.

runCommandInDirectory(dir, command)
  [cmd, ...args] = command
  child = spawn(cmd, args, { cwd: dir, stdio: "inherit" })
  child.on("error", reject)
  child.on("exit", code =>
    if code === 0: resolve()
    else: reject("command exited with code " + code))
```

```pseudo
### Function: doCheckoutRun(ctx, checkout, command)

**Responsibility:** Run a command in a single checkout, logging pending → success/failure operations. Uncloned checkouts log a failure operation and are skipped.

doCheckoutRun(ctx, checkout, command)
  commandLine = command.join(" ")

  if not checkout.scan?.state("exists").exists:
    ctx.log.log(createCheckoutRunFailure(checkout, commandLine, "checkout not cloned"))
    return null

  try:
    ctx.log.log(createCheckoutRunPending(checkout, commandLine))
    await runCommandInDirectory(checkout.path, command)
    ctx.log.log(createCheckoutRunSuccess(checkout, commandLine))
    return checkout
  catch error:
    ctx.log.log(createCheckoutRunFailure(checkout, commandLine, error))
    return null
```

**Expected outcome:** `_pseudo.md` documents the `checkout run` use case, the `run` operation kind and factories, and the `runCommandInDirectory`/`doCheckoutRun` helpers — consistent with the implemented code.

---

#### Commit: `document-checkout-run-command`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
knowledge(architecture): Document checkout run command.

- Add checkout run to the command surface in commands.md.
- Document usage, --checkouts/--all behaviour, and the `--` convention for inner flags.
- Add checkout run pseudo-code and exec helpers to _pseudo.md.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed according to the commit's policy.
- Verify that `checkout run` appears in the Command Surface table in `commands.md` with usage `checkout run <command...> [-c <PATTERN...>] [-A, --all]`.
- Verify that the `## Checkout Run` section documents usage, the `-c`/`--all` requirement, the `--` convention for inner flags, BDD scenarios, and edge cases.
- Verify that `_pseudo.md` contains the `checkout run` use case and the `runCommandInDirectory`/`doCheckoutRun` auxiliary functions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
