# Plan: Optimize Tests and Update Knowledge

**ID:** `optimize-tests-update-knowledge`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Audit test overlap, simplify expensive tests, fill coverage gaps, and remap architecture knowledge.

**Description:** Analyse the test suite for overlap between layers, identify untested units, redesign the test strategy to reduce expensive git fixture usage, and update architecture knowledge files to reflect the current command/operation/git/scan layering.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`  | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-building` |

## Summary

Audit test overlap across command layers, eliminate redundant git fixture setups, add missing tests, and update architecture knowledge files (commands, operations, git, scan).

## Context

### Upstream Work

| Kind                  | Path                                                               | Role                                                                |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Parking Lot           | `$ART_WORK/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers.     |
| Architecture Briefing | `$ART_WORK/_roadmap/_architect.md`                                 | Art Work principles, NFRs, milestones.                              |
| Milestone             | `$ART_WORK/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Coordinates this plan as Phase 2 of the Art Work Cli One milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK/cli/work/architecture/commands.md` (Model) — Command surface, BDD, edge cases. Relevant for Iterations 2, 3, 4.

::READ `$ART_WORK/cli/work/architecture/index.md` (Model) — Execution model, data model, reports. Relevant for all iterations.

## Scope

Audit and redesign the test suite for `cli/work/src`. Update architecture knowledge files to accurately reflect the command → operation → git/scan layering. Reduce expensive git fixture usage by mocking at appropriate boundaries.

## Work

### Next

- Draft iterations.

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

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

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

| Iteration / Instructions                           | Status  |
| -------------------------------------------------- | ------- |
| Iteration: Audit Test Coverage                     | `DRAFT` |
| Iteration: Update Command Knowledge                | `DRAFT` |
| Iteration: Rewrite Run Command Tests               | `DRAFT` |
| Iteration: Remap Layers and Redesign Test Strategy | `DRAFT` |

### Iteration: Audit Test Coverage

**Id:** `audit-test-coverage`

**Status:** `DRAFT`

**Purpose:** Identify overlap, gaps, and deviations in the test suite.

**Description:** Scan all `.test.ts` files for overlap between layers, list non-test-helper imports, list locally declared mock helpers, identify untested units, flag performance issues, and record deviations from established patterns. Produce `plan__test-coverage-audit.md` as a living attachment.

**Instructions:** `./plan-optimize-tests-update-knowledge/instructions/audit-test-coverage.md`

**Changes:**

Produce audit attachment `plan__test-coverage-audit.md` covering:

1. **Per-test inventory**
   - Files imported that are NOT test helpers (e.g., `scanCheckoutState`, `createOperationSuccess`).
   - Locally declared helpers (`createSomethingMock`, `setupXyzScenario`, etc.) excluding before/after hooks and console spies.
   - Git helpers used (count fixture setups — each `makeGitRepo`, `makeGitBareRepo`, etc. costs ~200-500ms).

2. **Overlap analysis**
   - `run*` tests that also assert git state (integration overlap with `do*` layer).
   - `do*` tests that repeat `git` layer assertions (e.g., asserting behind/ahead counts that `git` helpers already verify).
   - Tests that verify the same behaviour through different entry points.

3. **Untested units**
   - Files in `private/git/` without tests: `cloneCheckout.ts`, `getRemoteUrl.ts`, `pushCheckout.ts`, `remoteFetch.ts`.
   - Files in other dirs without tests (from prior scan): `config/private/normalizeRecordPaths.ts`, `private/async/runWithConcurrency.ts`, `private/repositories/*`, `private/resources/*/*`, etc.

4. **Performance flags**
   - Tests with >2 git fixture setups per test case.
   - Tests that create full workspace contexts when a narrow unit would suffice.

5. **Pattern deviations**
   - Tests importing `Checkout` types when they should only use primitives.
   - Tests using `scanCheckoutState` when the unit under test is a level above.
   - Inconsistent naming (`createCheckoutMock` vs `makeCheckoutMock` — already fixed, but check for stragglers).

**Seed data (already known):**

- `pullCheckout.test.ts` is 68 lines for an 8-line function; it sets up `Checkout` mocks and calls `scanCheckoutState` before/after — integration test disguised as unit.
- `runCheckoutRun.test.ts` is 148 lines; each test creates 2 bare repos + 2 working repos + workspace context + records — ~6 git fixtures per test.
- `private/git/` has 4 untested functions.
- `private/repositories/` and `private/resources/*/` have zero tests.
- `private/commands/workspaces/scanWorkspaceCheckout.ts` has no test despite siblings having tests.

**Note:** Not married to any specific mock strategy — the audit should be descriptive, not prescriptive. Leave recommendations for Iteration 4.

**Dependencies:**

- None.

#### Commits:

| ID                    | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| --------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `audit-test-coverage` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `audit-test-coverage`

**Message:**

```text
docs(tests): audit test coverage, overlap, and gaps
```

### Iteration: Update Command Knowledge

**Id:** `update-command-knowledge`

**Status:** `DRAFT`

**Purpose:** Sync `cli/work/architecture/commands.md` with current implementation.

**Description:** Review all implemented commands against `commands.md`. Update BDD scenarios, edge cases, and implementation status. Remove stale references. Ensure commands.md accurately reflects the current command surface.

**Instructions:** `./plan-optimize-tests-update-knowledge/instructions/update-command-knowledge.md`

**Changes:**

In `$ART_WORK/cli/work/architecture/commands.md`:

1. Update **Implementation Status** section to reflect current state.
2. Review each command's BDD — add missing scenarios discovered during testing (e.g., `checkouts run` inner flags after `--`).
3. Update edge cases to match actual implementation (e.g., `push` tries pull first if behind).
4. Verify all described behaviour is tested or flagged as untested.
5. Remove any stubbed/TODO content that has since been implemented.

**Dependencies:**

- Iteration: Audit Test Coverage (to know which command scenarios are actually tested).

#### Commits:

| ID                         | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| -------------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `update-command-knowledge` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `update-command-knowledge`

**Message:**

```text
docs(architecture): sync commands.md with current implementation
```

### Iteration: Rewrite Run Command Tests

**Id:** `rewrite-run-command-tests`

**Status:** `DRAFT`

**Purpose:** Simplify `run*` command tests to focused orchestration tests.

**Description:** Rewrite `runCheckoutRun.test.ts` and other `run*` command tests to validate orchestration only: argument parsing, checkout matching, iteration, delegating to `do*` ops, and reporting. Mock the `do*` layer and git state. No git fixtures. Update the audit attachment with before/after comparison.

**Instructions:** `./plan-optimize-tests-update-knowledge/instructions/rewrite-run-command-tests.md`

**Changes:**

In `$ART_WORK/cli/work/src/commands/*/*.test.ts` (run command tests):

1. **Test cases to cover** (no git fixtures):
   - Validates arguments (e.g., `-c` or `--all` required).
   - Runs "on" matching checkouts with "param" (command string).
   - Reports success/failure per checkout.
   - Happy path: command runs, operation logged as success.
   - Unhappy path: no matching checkouts → warning, no operation.
   - Unhappy path: checkout not cloned → failure operation logged.
   - Unhappy path: command exits non-zero → failure operation logged.

2. **Mock strategy:**
   - Mock `doPullCheckout`, `doPushCheckout`, `runCheckoutsRun` internals, etc. using `vi.fn()`.
   - Provide a pre-built `Checkout[]` array to the run function — no `scanCheckoutState`, no `makeGitRepo`, no `makeCommandContextMock` with full workspace setup.
   - Use minimal `Checkout` objects created inline (not via `makeCheckoutMock` unless necessary).

3. **Files to rewrite:**
   - `commands/checkouts/runCheckoutRun.test.ts` — reduce from 148 lines to ~60.
   - `commands/pull/runPull.test.ts` — already migrated to new git helpers; verify it doesn't need further simplification.
   - `commands/push/runPush.test.ts` — same.
   - `commands/sanity/runSanity.test.ts` — same.
   - `commands/sync/runSync.test.ts` — same.

4. **Update audit attachment:** Record which run tests were simplified and how many git fixtures were eliminated.

**Dependencies:**

- Iteration: Audit Test Coverage (to know current state).

#### Commits:

| ID                          | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| --------------------------- | ----------------------------------- | ------------ | ---- | ------- |
| `rewrite-run-command-tests` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `rewrite-run-command-tests`

**Message:**

```text
test(commands): rewrite run tests as focused orchestration tests
```

### Iteration: Remap Layers and Redesign Test Strategy

**Id:** `remap-layers-redesign-tests`

**Status:** `DRAFT`

**Purpose:** Document the operation/git/scan layers and redesign mocking boundaries.

**Description:** Create architecture knowledge files for operations, git, and scan layers. Redesign the test strategy: git fixtures only where directly testing git integration or where mocking would be more costly than fixtures. Design mock patterns for groups of related tests.

**Instructions:** `./plan-optimize-tests-update-knowledge/instructions/remap-layers-redesign-tests.md`

**Changes:**

1. **Create `cli/work/architecture/operations.md`**
   - Document the `do*` operation layer: logic, gates, side effects (store updates, logging), error handling.
   - List each `do*` function, its guards, and what it delegates to.
   - Map operations to commands (which command calls which operation).

2. **Create `cli/work/architecture/git.md`**
   - Document the `private/git/` layer: pure git wrappers, signatures, error handling.
   - List each helper, what it wraps, and what it returns.
   - Note which helpers take `Checkout` vs primitives (post-refactor).

3. **Create `cli/work/architecture/scan.md`**
   - Document the scan layer: `scanCheckoutState`, `scanWorkspaceCheckout`, `scanAllCheckoutsStates`.
   - What they scan, what states they produce, how they use `remoteFetch`.
   - Note performance implications (fetching on every scan).

4. **Redesign test strategy**
   - **Git fixtures allowed when:**
     1. Directly testing git integration (e.g., `getBehindAheadCount`, `hasRemote`).
     2. Mocking would require >20 lines of `vi.mock`/`vi.spyOn` setup + cleanup.
   - **Mocking preferred when:**
     1. Testing a layer above git (e.g., `doPullCheckout` should mock `pullCheckout`, not create a bare repo).
     2. The same fixture setup repeats across >3 tests.
   - **Mock patterns to design:**
     - `mockGitRepo(dir)` — returns a `SimpleGit` mock with common methods spied.
     - `mockCheckout(overrides)` — minimal `Checkout` object factory for tests.
     - `mockWorkspaceContext()` — minimal context with stubbed store and log.

5. **Add missing tests** (from audit)
   - `private/git/cloneCheckout.test.ts`
   - `private/git/getRemoteUrl.test.ts`
   - `private/git/pushCheckout.test.ts`
   - `private/git/remoteFetch.test.ts`
   - `private/repositories/*` (if deemed valuable — flag as low priority if too complex).

6. **Update audit attachment** with redesign decisions and mock patterns adopted.

**Dependencies:**

- Iteration: Audit Test Coverage.
- Iteration: Rewrite Run Command Tests.

#### Commits:

| ID                       | Repository / Checkout / Branch      | Policy       | Hash | Status  |
| ------------------------ | ----------------------------------- | ------------ | ---- | ------- |
| `remap-operations-layer` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |
| `remap-git-layer`        | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |
| `remap-scan-layer`       | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |
| `redesign-test-strategy` | Art Work / `$ART_WORK` / `building` | `AUTONOMOUS` |      | `DRAFT` |

##### Commit: `remap-operations-layer`

**Message:**

```text
docs(architecture): document operations layer
```

##### Commit: `remap-git-layer`

**Message:**

```text
docs(architecture): document git layer and add missing tests
```

##### Commit: `remap-scan-layer`

**Message:**

```text
docs(architecture): document scan layer
```

##### Commit: `redesign-test-strategy`

**Message:**

```text
test: add missing tests and adopt mock patterns
```

---

## Coordination

### Not In Scope

- Refactoring production code signatures (e.g., `Checkout` → `dir` in git helpers) — that was completed in prior work.
- `private/scan/states/` and `private/scan/private/` — another agent is working on these.
- `private/commands/operations/` — another agent is working on these.

### Evidence

- None.

### Findings

- `pullCheckout.test.ts` (68 lines) tests integration through `scanCheckoutState` when it should be a narrow unit test (~30 lines).
- `runCheckoutRun.test.ts` (148 lines) sets up 6 git fixtures per test; should mock the `do*` layer.
- `private/git/` has 4 untested functions with zero test culture nearby.
- `private/resources/*/` directories have zero tests across 6 files.

### Decisions

- Git fixtures are reserved for: (1) direct git integration tests, (2) cases where mocking is more expensive than fixtures.
- Run tests validate orchestration only: arguments, matching, iteration, reporting.
- `do*` tests validate guards, side effects, and error handling — git layer mocked.
- `git` tests validate git behaviour — fixtures allowed.

### Knowledge to Update

- `cli/work/architecture/commands.md` — Iteration 2.
- `cli/work/architecture/operations.md` — Iteration 4 (new file).
- `cli/work/architecture/git.md` — Iteration 4 (new file).
- `cli/work/architecture/scan.md` — Iteration 4 (new file).

### Follow Ups

- None identified.

### Feedback

- None.
