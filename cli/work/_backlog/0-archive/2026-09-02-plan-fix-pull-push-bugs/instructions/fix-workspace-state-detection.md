# Instructions: `fix-workspace-state-detection`

**Plan:** `fix-pull-push-bugs`

**Iteration Id:** `fix-workspace-state-detection`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-fix-pull-push-bugs/instructions/fix-workspace-state-detection__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fix-workspace-state-detection`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fix-workspace-state-detection`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Fix the workspace report showing "unknown project" incorrectly and improve workspace state presentation by converting the workspace output from a table to a list of fields.

## Mandatory Reading

- Bugs: `$PROJECT/_backlog/3-now/plan-fix-pull-push-bugs/plan__bugs.md` — bug scenarios and evidence.
- Architecture: `$PROJECT/architecture/commands.md` — command behaviour and BDD scenarios.
- Pseudo-code: `$PROJECT/architecture/_pseudo.md` — pseudo-code contracts.
- Briefing: `$PROJECT/_roadmap/_architect.md` — workspace principles and NFRs.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

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

Fix the workspace report showing "unknown project" incorrectly and improve workspace state presentation. Filter out inapplicable issues and convert the workspace output from a table to a list of fields.

- Step 1 / 4 — Filter inapplicable workspace issues
- Step 2 / 4 — Convert workspace output to field list
- Step 3 / 4 — Add/update tests
- Step 4 / 4 — Commit `fix-workspace-state-detection`

## Steps

### Step `1 / 4` — Filter inapplicable workspace issues

**Goal:** Stop the workspace report from showing "unknown project" (and other inapplicable issues) for the workspace root.

**Preparatory instructions:**

Read the workspace scan and presentation flow:

- `$PROJECT/src/commands/sanity/runSanity.ts`
- `$PROJECT/src/private/scan/scanCheckoutState.ts`
- `$PROJECT/src/private/scan/private/createCheckoutScan.ts`
- `$PROJECT/src/private/present/presentWorkspaceReport.ts`

**Detailed execution instructions:**

1. The workspace root is scanned as a normal checkout with `repo: undefined` (see `runSanity.ts` where `createCheckout(ctx.config, '.', undefined, 'main', 'Workspace')` is used). This triggers the "unknown project" issue in `createCheckoutScan.issues()`.
2. In `$PROJECT/src/commands/sanity/runSanity.ts`, where the workspace scan issues are produced (the `workspace.scan?.issues().join` path), filter out issues that do not apply to the workspace root. At minimum filter out "unknown project".
3. Inspect the other possible issues and filter any that do not apply to the workspace root (e.g. issues that only make sense for a named checkout with a repo record). Keep issues that genuinely apply (e.g. "1 commit behind", "uncommitted files", "wrong branch", "no remote").
4. Do not change the underlying `createCheckoutScan` behaviour for normal checkouts — only the workspace presentation.

**Expected outcome:** The workspace report no longer shows "unknown project" while still surfacing genuine workspace issues.

### Step `2 / 4` — Convert workspace output to field list

**Goal:** Present the workspace as a list of fields instead of a table row.

**Detailed execution instructions:**

1. In `$PROJECT/src/private/present/presentWorkspaceReport.ts`, replace the table output with a list of fields, one per line under the `Workspace:` header.
2. The fields MUST be: `remote` (the git remote of the workspace), `path` (the absolute path), `branch`, and `issues`.
3. Keep the `Workspace:` header line. Remove the `formatTable` usage for the workspace report.
4. Preserve the early return when `workspace` is undefined.

**Expected outcome:** The workspace report prints `Workspace:` followed by `remote`, `path`, `branch`, and `issues` as a field list.

### Step `3 / 4` — Add/update tests

**Goal:** Cover the filtered issues and the new field-list presentation.

**Detailed execution instructions:**

1. In `$PROJECT/src/private/present/presentWorkspaceReport.test.ts`, update the tests to assert the new field-list output (remote, path, branch, issues) instead of the table.
2. Add/update a test asserting that "unknown project" is filtered out of the workspace issues.
3. In `$PROJECT/src/commands/sanity/runSanity.test.ts`, update any assertions that expect "unknown project" in the workspace report.
4. Run the focused tests for the changed files before the full suite.

**Expected outcome:** Tests cover the filtered issues and the field-list presentation and pass.

### Step `4 / 4` — Commit `fix-workspace-state-detection`

---

#### Commit: `fix-workspace-state-detection`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
fix(workspace-cli): fix workspace state detection and presentation.

- Filter inapplicable issues (e.g. "unknown project") in workspace scan.
- Convert workspace output from table to field list (remote, path, branch, issues).
- Add/update tests for workspace state detection.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that the workspace report no longer shows "unknown project" and presents `remote`, `path`, `branch`, and `issues` as a field list.
- Verify that normal checkout reports are unchanged.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
