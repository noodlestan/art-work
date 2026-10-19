# Instructions: `scoped-record-paths`

**Plan:** `scoped-record-paths`

**Iteration Id:** `scoped-record-paths`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-scoped-record-paths/instructions/scoped-record-paths__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scoped-record-paths`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scoped-record-paths`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Replace the single-glob `included`/`ignored` record discovery with scoped, additive `paths` scans. Each scan is anchored to a `base` path, so discovery is fast (no whole-tree recursion for "includes"), predictable, and the `included` option is no longer needed. `included` and RegExp patterns are dropped.

## How It Works

`records` is a partial path config plus an optional `paths` array. Everything normalizes to an array of independent, additive scans.

```
type WorkspaceRecordsPath = {
  base: string;              // default '.'
  pattern: string | string[]; // default from records
  ignored: string[];         // default ['node_modules/', '.git/', 'dist/']
  excluded: string[];        // default []
  gitignore: boolean;        // default true
}

records = Partial<WorkspaceRecordsPath> & { paths?: Partial<WorkspaceRecordsPath>[] }

normalizeRecordPaths(records):
  if records.paths is empty:
    return [ { base: records.base ?? '.', pattern, ignored, excluded, gitignore } ]
  return records.paths.map(p => ({
    base:      p.base      ?? records.base      ?? '.',
    pattern:   p.pattern   ?? records.pattern,
    ignored:   p.ignored   ?? records.ignored,            // full override
    excluded:  (p.excluded ?? []) + (records.excluded ?? []),  // merge
    gitignore: p.gitignore ?? records.gitignore,
  }))
```

Each normalized path is an independent scan:

```
for path in normalizeRecordPaths(records):
  exclude = path.ignored + path.excluded          // nested excludes, never the base
  files  += findCandidateFiles(searchPath, path.base, path.pattern, exclude)
  if path.gitignore:
      files = applyGitCheckIgnore(searchPath, files)   // git check-ignore
return dedupe(files)
```

**Key semantics:**

- `base` is resolved relative to the search path (the workspace root): the glob is `join(searchPath, base, pattern)`.
- `ignored`/`excluded` exclude **nested** paths within the base, never the base itself — so `{ base: 'node_modules/', ignored: [] }` scans `node_modules/` while clearing the baseline for its contents.
- `path.ignored` is a **full override** of `records.ignored`; `excluded` **merges** with it.
- `gitignore: true` (default) applies `git check-ignore` as a post-filter; `false` skips it.
- There is **no `included`** — to include something outside the main scan, add another `paths` entry with a different `base`. Results are unioned and deduped.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

- architecture: `$PROJECT/architecture/config.md` — the `records` options and discovery logic to update under `## Options overview`.

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

This section summarises the changes to be made in this iteration.

- Step 1 / 6 — Change the `records` config type to the `paths`-based shape and drop `included`/`dotignored`
- Step 2 / 6 — Add `normalizeRecordPaths` to resolve records into independent additive scans
- Step 3 / 6 — Rework `findRecordFiles`/`findCandidateFiles` to glob each path with `exclude = ignored + excluded` and optional `git check-ignore`
- Step 4 / 6 — Remove the `included`/RegExp machinery (`filterByPatterns`, `getIgnoredSet`, `filterBuiltInExcludes`)
- Step 5 / 6 — Document the new `records` options in `architecture/config.md` (`## Options overview`)
- Step 6 / 6 — Commit `scoped-record-paths` and `document-records-options`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Change the `records` config type to the `paths`-based shape

In `$PROJECT/src/config/types.ts`:

- Define `WorkspaceRecordsPath = { base: string; pattern: string | string[]; ignored: string[]; excluded: string[]; gitignore: boolean }`.
- Change `WorkspaceConfig['records']` to `Partial<WorkspaceRecordsPath> & { paths?: Partial<WorkspaceRecordsPath>[] }`.
- Remove `included` and `dotignored` from the `records` type (replaced by `gitignore: boolean`).
- Update `defineConfig.ts` and `loadWorkspaceConfig.ts` defaults accordingly: `pattern: '*.art'`, `ignored: ['node_modules/', '.git/', 'dist/']`, `gitignore: true`, `base: '.'`, `excluded: []`.

Expected outcome: the `records` config type and defaults reflect the new `paths`-based shape; `included` and `dotignored` are gone.

### Step `2 / 6` — Add `normalizeRecordPaths` to resolve records into independent additive scans

In `$PROJECT/src/private/records/`:

- Add a `normalizeRecordPaths(records)` helper (e.g. in `private/normalizeRecordPaths.ts`) that returns `WorkspaceRecordsPath[]` per the pseudo-code in "## How It Works": if `paths` is empty, a single path from the top-level defaults (base default `'.'`); otherwise each path inherits top-level defaults overridden by its own fields (`ignored` full override, `excluded` merge).

Expected outcome: `normalizeRecordPaths` returns fully-resolved, independent scans.

### Step `3 / 6` — Rework `findRecordFiles`/`findCandidateFiles` to glob each path

In `$PROJECT/src/private/records/private/findCandidateFiles.ts`:

- Change the signature to `findCandidateFiles(searchPath, base, pattern, exclude)` and glob `join(searchPath, base, pattern)` with `exclude` passed to `globSync` (Node 22.4+; the runtime is Node 24). `pattern` may be a string or string[].

In `$PROJECT/src/private/records/findRecordFiles.ts`:

- Iterate `normalizeRecordPaths(recordsConfig)`, calling `findCandidateFiles` per path with `exclude = path.ignored + path.excluded`.
- When `path.gitignore` is true, apply `git check-ignore` to that path's results (reuse the existing `getIgnoredSet` logic, now driven by the boolean).
- Union and dedupe the results across all paths before returning.

Expected outcome: each path is an independent scoped scan; results are unioned and deduped; `git check-ignore` applies only when `gitignore: true`.

### Step `4 / 6` — Remove the `included`/RegExp machinery

In `$PROJECT/src/private/records/`:

- Remove `filterByPatterns`, `filterBuiltInExcludes`, and any `included`/RegExp handling. `ignored`/`excluded` are now `string[]` only.
- Update `findRecordFiles.test.ts` and any other tests that used `included` or RegExp patterns to the new `paths`-based shape.

Expected outcome: no references to `included`, `dotignored`, or RegExp record patterns remain in the package (excluding `_backlog`).

### Step `5 / 6` — Document the new `records` options in `architecture/config.md`

In `$PROJECT/architecture/config.md`:

- Add a `## Options overview` section immediately **before** the existing `## Authoring Config` section.
- Document the `records` options (`base`, `pattern`, `ignored`, `excluded`, `gitignore`, `paths`) and the discovery logic: each `paths` entry is an independent scoped scan anchored to `base`; `ignored`/`excluded` exclude nested paths (never the base); `path.ignored` overrides `records.ignored` while `excluded` merges; `gitignore: true` applies `git check-ignore`; results are unioned and deduped; there is no `included` — add another `paths` entry instead.
- Update the `WorkspaceConfig` structure example in `## Configuration Structure` to the new `records` shape.

Expected outcome: `config.md` documents the new `records` options and discovery logic before the authoring example.

### Step `6 / 6` — Commit `scoped-record-paths` and `document-records-options`

---

#### Commit: `scoped-record-paths`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(workspace-cli): Introduce config records.paths options for scoped scans.

- Add `paths` array with base/pattern/ignored/excluded/gitignore per scan.
- Normalize records into independent additive scans; drop `included` and RegExp.
- Glob each path with `exclude = ignored + excluded`; apply git check-ignore when enabled.
- Document records options in architecture/config.md.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `WorkspaceConfig['records']` uses the `paths`-based shape and that `included`/`dotignored` are removed.
- Verify that `normalizeRecordPaths` resolves records into independent additive scans.
- Verify that each path globs `join(searchPath, base, pattern)` with `exclude = ignored + excluded` and that `git check-ignore` applies only when `gitignore: true`.
- Verify that `architecture/config.md` has a `## Options overview` section before `## Authoring Config` documenting the new `records` options.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
