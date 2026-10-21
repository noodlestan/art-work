# Plan: Scope Commands to Location

**ID:** `scope-commands-to-checkouts`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Add `--checkouts <PATTERN...>` option to `pull`, `push`, and `sync` so the operation can be scoped to one or more checkout locations instead of always iterating all checkouts.

**Description:** Add a variadic `--checkouts` option (shorthand `-c`) to `pull`, `push`, and `sync`. Patterns support exact match and wildcard/glob matching against checkout name and location. When omitted, all checkouts are processed (unchanged behaviour).

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Let `pull`, `push`, and `sync` accept `--checkouts <PATTERN...>` to scope the operation to specific checkouts. Patterns support exact match and wildcard/glob matching against checkout name and location (e.g. `"purr*"` matches `purrception`, `purrtrait`; `"* @ planning"` matches all planning checkouts). When omitted, all checkouts are processed.

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                            |
| --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                                | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `_roadmap/_architect.md`                                           | Workspace principles, NFRs, milestones.                         |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-workspace-cli-one/milestone.md` | Coordinates this plan within the Workspace CLI One milestone.   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.
::READ `architecture/commands.md` (Design) — Designed behaviour and BDD scenarios for pull, push, sync. Relevant for Planning Work Item.
::READ `architecture/_pseudo.md` (Pseudo-code) — `resolveCheckoutByName(store, input)` design at line 216. Relevant for Planning Work Item.

## Scope

Update the `pull`, `push`, and `sync` command handlers in `$PROJECT/src/commands/` to accept `--checkouts <PATTERN...>` and filter by resolved checkout locations. Add `getCheckoutsByPattern` to the store API. Standardise command argument declarations across all commands.

## Work

### Next

Delegate.

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

## Items:

| Iteration / Instructions                   | Status |
| ------------------------------------------ | ------ |
| Iteration: Add Checkout Arg                | `DONE` |
| Iteration: Improve Command Declaration     | `DONE` |
| Iteration: Change Branch Argument          | `DONE` |
| Iteration: Update Commands Knowledge       | `DONE` |
| Iteration: Require All Arg In All Commands | `DONE` |

### Iteration: Add Checkout Arg

**Id:** `add-checkout-arg`

**Status:** `DONE`

**Purpose:** Let `pull`, `push`, and `sync` operate on a subset of checkout locations via `--checkouts` patterns.

**Description:** Add `--checkouts <PATTERN...>` (shorthand `-c`) to pull/push/sync. Add `getCheckoutsByPattern` to the store API. Resolve patterns against checkout name and location with exact match first, then wildcard/glob fallback. Filter the concurrency loop to resolved checkouts only.

**Instructions:** `./plan-scope-commands-to-checkouts/instructions/add-checkout-arg.md`

**Changes:**

- Add `.option('-c, --checkouts <PATTERN...>', 'checkout location patterns')` to pull, push, sync in `src/index.ts`.
- Add `getCheckoutsByPattern(patterns: string[]): Checkout[]` method to the `CheckoutStore` API in `$PROJECT/src/private/store/createCheckoutStore.ts`:
  - Extract existing `getCheckoutForLocation` and `getCheckoutByName` implementations to module-level constants/functions so they can be reused without `this.`.
  - For each pattern, iterate all checkouts and test against:
    - **name** (case-insensitive): exact match first (reuse `getCheckoutByName`), then glob match (e.g. `"art-js @ planning"` exact, `"* @ planning"` glob).
    - **location** (case-insensitive): exact match first (reuse `getCheckoutForLocation`), then glob match (e.g. `"art-js-planning"` exact, `"art-*-planning"` glob).
  - Collect matches in a `Set<Checkout>` keyed by `record.location` for deduplication (same checkout matched by multiple patterns or by both name and location appears once).
  - Warn on patterns with zero matches.
  - Return deduplicated array of matched checkouts.
- Update `runPull`, `runPush`, `runSync` to accept `{ checkouts?: string[] }` and call `ctx.store.getCheckoutsByPattern(checkouts)` when patterns provided.
- Keep the no-argument behaviour (all checkouts) unchanged.
- Add/update tests covering exact match, wildcard match, no-match warning, deduplication, and unscoped invocations.

**Dependencies:**

- None.

#### Commits:

| ID                                   | Repository / Checkout / Branch  | Policy       | Hash      | Status      |
| ------------------------------------ | ------------------------------- | ------------ | --------- | ----------- |
| `add-checkouts-option-to-commands`   | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `52b8b36` | `COMMITTED` |
| `implement-pattern-resolver-utility` | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `1e043ae` | `COMMITTED` |
| `wire-resolver-into-run-functions`   | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `426bf73` | `COMMITTED` |
| `test-checkout-pattern-matching`     | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `52b8b36` | `COMMITTED` |

##### Commit: `add-checkouts-option-to-commands`

**Hash:** `52b8b36`

**Message:**

```
build(workspace-cli-one): Add --checkouts option to pull, push, sync commands.

- Add .option('-c, --checkouts <PATTERN...>', 'checkout location patterns') to pull, push, sync
- Pass options.checkouts through from commander action handlers
- Update runPull, runPush, runSync signatures to accept { checkouts?: string[] }
```

##### Commit: `implement-pattern-resolver-utility`

**Hash:** `1e043ae`

**Message:**

```
build(workspace-cli-one): Add getCheckoutsByPattern to CheckoutStore API.

- Extract matchCheckoutByName and matchCheckoutByLocation to module-level functions
- Add getCheckoutsByPattern(patterns) method to createCheckoutStore
- Exact match when pattern has no *, wildcard regex match when pattern contains *
- Deduplicate via Map keyed by record.location
- Warn on patterns with zero matches
```

##### Commit: `wire-resolver-into-run-functions`

**Hash:** `426bf73`

**Message:**

```
build(workspace-cli-one): Wire checkout pattern resolver into pull/push/sync.

- When checkouts provided, resolve via resolveCheckoutsByPatterns and filter loop
- When no checkouts provided, use all checkouts (unchanged behaviour)
- Update createOperationPending calls to include checkouts
```

##### Commit: `test-checkout-pattern-matching`

**Hash:** `52b8b36`

**Message:**

```
test(cli): add checkout pattern matching tests.

- Test exact match via getCheckoutForLocation
- Test wildcard/glob match against CheckoutRecord.location
- Test multiple patterns with deduplication
- Test no-match warning on unknown patterns
- Test unscoped invocation defaults to all checkouts
```

### Iteration: Improve Command Declaration

**Id:** `improve-command-declaration`

**Status:** `DONE`

**Purpose:** Standardise command argument declarations across all commands with verbose syntax and shorthand flags.

**Description:** Review all command `.option()` declarations in `src/index.ts` and ensure every argument has a verbose `--name` form with a shorthand (single letter, avoiding clashes). Apply consistent variadic `...` syntax where multiple values are accepted.

**Instructions:** `./plan-scope-commands-to-checkouts/instructions/improve-command-declaration.md`

**Changes:**

- Review all commands in `src/index.ts` for argument declaration consistency.
- Add shorthand flags to all options (avoiding letter clashes — pick next available letter per command).
- Ensure variadic options use `<NAME...>` syntax consistently.
- No behavioural changes — declaration-only refactor.

**Dependencies:**

- `add-checkout-arg` — establishes the `--checkouts` pattern.

#### Commits:

| ID                                 | Repository / Checkout / Branch  | Policy       | Hash | Status    |
| ---------------------------------- | ------------------------------- | ------------ | ---- | --------- |
| `standardise-command-declarations` | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | -    | `SKIPPED` |

##### Commit: `standardise-command-declarations`

**Hash:** `-`

**Message:**

```
build(workspace-cli-one): Standardise command argument declarations with shorthand flags.

- Add shorthand flags to all --auto, --all, --checkouts options
- Ensure variadic options use <NAME...> syntax consistently
- No behavioural changes
```

### Iteration: Change Branch Argument

**Id:** `change-branch-argument`

**Status:** `DONE`

**Purpose:** Change `branch` command from positional `[checkouts...]` to `--checkouts <PATTERN...>` (shorthand `-c`) for consistency.

**Description:** Replace the positional `[checkouts...]` argument in the `branch` command with the same `--checkouts <PATTERN...>` option used by pull/push/sync. Update `runBranch` to use `ctx.store.getCheckoutsByPattern()` instead of the current `getCheckoutForLocation` loop.

**Instructions:** `./plan-scope-commands-to-checkouts/instructions/change-branch-argument.md`

**Changes:**

- Replace `.argument('[checkouts...]', ...)` with `.option('-c, --checkouts <PATTERN...>', ...)` in `src/index.ts` for the `branch` command.
- Update `runBranch` signature to accept `{ branch: string; checkouts?: string[] }`.
- Replace the current `getCheckoutForLocation` loop with `ctx.store.getCheckoutsByPattern(checkouts)`.
- Update tests to use `--checkouts` / `-c` syntax.

**Dependencies:**

- `add-checkout-arg` — provides `getCheckoutsByPattern` and the `--checkouts` pattern.

#### Commits:

| ID                                  | Repository / Checkout / Branch  | Policy       | Hash      | Status      |
| ----------------------------------- | ------------------------------- | ------------ | --------- | ----------- |
| `change-branch-to-checkouts-option` | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `1bdc448` | `COMMITTED` |

##### Commit: `change-branch-to-checkouts-option`

**Hash:** `1bdc448`

**Message:**

```
build(workspace-cli-one): Change branch command from positional checkouts to --checkouts option.

- Replace [checkouts...] argument with -c, --checkouts <PATTERN...> option
- Update runBranch to use getCheckoutsByPattern instead of getCheckoutForLocation loop
- Update tests for new signature and add wildcard/zero-match tests
```

### Iteration: Update Commands Knowledge

**Id:** `update-commands-knowledge`

**Status:** `DONE`

**Purpose:** Update architecture documentation to reflect the new `--checkouts` pattern, `getCheckoutsByPattern` store method, and standardised command declarations.

**Description:** Update `architecture/commands.md` with a shared `### Command Arguments` section documenting `--checkouts` (and other standardised arguments) to avoid repetition. Update `architecture/_pseudo.md` to reflect the new `getCheckoutsByPattern` store method and changes to `resolveCheckoutByName`.

**Instructions:** `./plan-scope-commands-to-checkouts/instructions/update-commands-knowledge.md`

**Changes:**

- Add `### Command Arguments` section to `architecture/commands.md` documenting `--checkouts <PATTERN...>` (shorthand `-c`), its matching behaviour, and usage examples.
- Update individual command sections (pull, push, sync, branch) to reference the shared arguments section instead of repeating details.
- Update `architecture/_pseudo.md`:
  - Add `getCheckoutsByPattern` pseudo-code to the store section.
  - Update `resolveCheckoutByName` to note it is superseded by `getCheckoutsByPattern` for pattern-based resolution.
  - Update branch command pseudo to use `--checkouts` option.
  - Update all command pseudos to use current version in src/index.ts.

**Dependencies:**

- All previous iterations must be complete.

#### Commits:

| ID                                    | Repository / Checkout / Branch  | Policy       | Hash      | Status      |
| ------------------------------------- | ------------------------------- | ------------ | --------- | ----------- |
| `document-checkouts-pattern-matching` | Workspace / `$PROJECT` / `main` | `AUTONOMOUS` | `83ba6a5` | `COMMITTED` |

##### Commit: `document-checkouts-pattern-matching`

**Hash:** `83ba6a5`

**Message:**

```
knowledge(architecture): Document --checkouts pattern matching and update command pseudo-code.

- Add shared Command Arguments section to commands.md with --checkouts rules and examples
- Update pull, push, sync, branch usage lines to reference shared section
- Add getCheckoutsByPattern pseudo-code to _pseudo.md
- Update resolveCheckoutByName note and branch command pseudo
```

### Iteration: Require All Arg In All Commands

**Id:** `require-all-arg-in-all-commands`

**Status:** `DONE`

**Purpose:** Require `-c <pattern>` or `--all` in all commands that iterate checkouts (`pull`, `push`, `sync` and `branch`) Remove implicit all-checkouts fallback. Update `-c` description.

**Instructions:** `./plan-scope-commands-to-checkouts/instructions/require-all-arg-in-all-commands.md`

**Changes:** Add `--all` to pull, push, sync, branch. Remove `getAllCheckouts()` fallback and print warning and usage message. Update `-c` description across commands. Update tests and docs.

**Dependencies:** All previous iterations complete.

#### Commits:

| ID                                         | Repository / Checkout / Branch      | Policy       | Hash      | Status      |
| ------------------------------------------ | ----------------------------------- | ------------ | --------- | ----------- |
| `require-checkouts-or-all-in-all-commands` | Workspace / `$PROJECT` / `building` | `AUTONOMOUS` | `03c664a` | `COMMITTED` |

##### Commit: `require-checkouts-or-all-in-all-commands`

**Hash:** `03c664a`

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

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- `runPull`, `runPush`, and `runSync` each iterate `ctx.store.getAllCheckouts()` unconditionally; there is no way to scope the operation to specific checkout locations.
- `runBranch` already implements this pattern: accepts `checkoutLocations: string[]`, resolves via `getCheckoutForLocation(location)`, and iterates only matched checkouts.
- `runRepo` accepts `locations?: string[]` and resolves via `getCheckoutByName(name) ?? getCheckoutForLocation(name)`.
- `CheckoutRecord.location` is already the relative portion under the checkouts directory (e.g. `"artificial"` maps to `checkouts/artificial`).
- `architecture/_pseudo.md:216` has a previous design for `resolveCheckoutByName(store, input)` — handles exact name, "Repository:" prefix, slug format, and location fallback.
- Commander's variadic `...` syntax collects all following arguments until the next flag, so `--checkouts "purr*" "art*"` produces `["purr*", "art*"]`.
- Store methods `getCheckoutForLocation` and `getCheckoutByName` exist for exact matches but are currently inline in the store's return object — need extracting to module-level for reuse.

### Decisions

- Use named `--checkouts <PATTERN...>` option (shorthand `-c`) instead of positional argument — future-proofs for `checkout-cmd` and `package-cmd` which have other positional args.
- Resolution strategy: exact match first (name and location), then wildcard/glob fallback. Match against both `CheckoutRecord.name` (case-insensitive) and `CheckoutRecord.location` (case-insensitive).
- `getCheckoutsByPattern` lives in the store API (`createCheckoutStore.ts`) — reuse existing exact-match methods by extracting them to module-level functions.
- Deduplication via `Set` keyed by `record.location` — same checkout matched by multiple patterns or by both name and location appears once.
- Patterns with zero matches produce a warning but do not fail the command.

### Knowledge to Update

- `architecture/commands.md` — add shared `### Command Arguments` section, document `--checkouts <PATTERN...>`.
- `architecture/_pseudo.md` — add `getCheckoutsByPattern` pseudo, update `resolveCheckoutByName`, update branch command.

### Follow Ups

- Reuse `getCheckoutsByPattern` in `checkout-cmd` and `package-cmd` plans.

### Feedback

- None.
