# Plan: Update Knowledge Resources

**ID:** `update-knowledge-resources`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Update the Art Work Cli architecture knowledge resources to reflect implemented commands and planned changes.

**Description:** The architecture docs currently describe an earlier state of the codebase; this plan brings them current with the actual `src/` structure, completed plans, and planned changes.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Update 8 architecture knowledge resource files to reflect implemented commands (pull, push, sync), planned configuration changes, and updated function signatures.

## Context

### Upstream Work

| Kind        | Path                                                              | Role                                                            |
| ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Defines this plan as part of the Art Work Cli One milestone.    |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/architecture/index.md` (Architecture) — CLI execution model and data model. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/config.md` (Config) — WorkspaceConfig interface. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/context-model.md` (Model) — Reader organization and record functions. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/commands.md` (Commands) — Command surface and implementation status. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/operations-log.md` (Operations) — Operation kinds. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/_pseudo.md` (Pseudo) — Pseudo-code contracts. Relevant for Planning Work Item.
::READ `$PROJECT/architecture/reports.md` (Reports) — Report formats. Relevant for Planning Work Item.

## Scope

Update 8 architecture files in `$PROJECT/architecture/` to reflect the current state of the codebase.

## Work

### Next

Delegate the first `DRAFT` iteration: `update-architecture-index`.

### Blockers

- None.

---

## Operating Instructions

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

---

## Items:

| Iteration / Instructions             | Status  |
| ------------------------------------ | ------- |
| Iteration: Update Architecture Index | `DRAFT` |
| Iteration: Update Config             | `DRAFT` |
| Iteration: Update Context Model      | `DRAFT` |
| Iteration: Update Commands           | `DRAFT` |
| Iteration: Update Operations Log     | `DRAFT` |
| Iteration: Update Pseudo Code        | `DRAFT` |
| Iteration: Update Reports            | `DRAFT` |
| Iteration: Update ADRs               | `DRAFT` |

### Iteration: Update Architecture Index

**Id:** `update-architecture-index`

**Status:** `DRAFT`

**Purpose:** Update `architecture/index.md` to reflect implemented commands and current milestone.

**Description:** Replace stale plan reference with current milestone, update CLI execution model to show implemented vs planned commands, review data model consistency.

**Changes:**

- Replace the fields at the top **Status:**, **Pseudo:**, **Plans:** by a **Purpose:** of this document (overview and index of the Art Work Cli architecure).
- Promote **Description:** to a ## What section (describes the CLI) and nest "### Why", "### Key Benefits"
- Remove "### Definitions"
- Add "## Index" with a table of nested documents with columns "Title / Path" and "Purpose" \*where path is relative to architecture and purpose is **Purpose:** field of the document, fallback to **Description:**, fallback to generate terse summary of doc.
- Move "## Use Cases" to after "## Index" and review to update to latest command compositions and options.
- Review the "Data Model" section against `context-model.md` updates.

**Dependencies:**

- None.

### Iteration: Update Config

**Id:** `update-config`

**Status:** `DRAFT`

**Purpose:** Update `architecture/config.md` to reflect planned WorkspaceConfig restructuring.

**Description:** Update the WorkspaceConfig interface to show the planned shape, update authoring example, add transition note.

**Changes:**

- Update the `WorkspaceConfig` interface to show the planned shape: top-level `checkouts.path` and `checkouts.template`, and `records.pattern`.
- Update the authoring example to match the new config shape.
- Add a note about the `records.checkouts` restructuring.

**Dependencies:**

- None.

### Iteration: Update Context Model

**Id:** `update-context-model`

**Status:** `DRAFT`

**Purpose:** Update `architecture/context-model.md` to reflect actual reader organization and function signatures.

**Description:** Update directory tree, saveCheckoutRecord signature, loadProjectGraph, and Checkout interface.

**Changes:**

- Update the "Reader Organization" directory tree to match the actual `src/private/records/` structure.
- Update `saveCheckoutRecord` signature to data-first: `saveCheckoutRecord(config, data, filename?)`.
- Add `filename` field to `RepositoryCheckoutRecord`.
- Update `loadProjectGraph` to show it will accept `(config, checkoutPath)`.
- Review `hydrateStoreFromRecords` against actual implementation.
- Ensure `Checkout` interface matches `src/private/store/createCheckout.ts`.

**Dependencies:**

- None.

### Iteration: Update Commands

**Id:** `update-commands`

**Status:** `DRAFT`

**Purpose:** Update `architecture/commands.md` to reflect implemented command status.

**Description:** Update command surface table and implementation status section.

**Changes:**

- Update the command surface table: `pull`, `push`, `sync` → `implemented`.
- Update the "Implementation Status" section to reflect all implemented commands.
- Note that `link`, `unlink`, `publish` remain `designed`.
- Verify BDD scenarios for `pull`, `push`, `sync` against actual test files.

**Dependencies:**

- None.

### Iteration: Update Operations Log

**Id:** `update-operations-log`

**Status:** `DRAFT`

**Purpose:** Update `architecture/operations-log.md` to include `pull` operation kind.

**Description:** Add pull to operation kinds and verify operation factory exports.

**Changes:**

- Update `architecture/operations-log.md` to document `pending` as an outcome and the streaming/logger concept (feedback from `plan-log-process-as-it-happens`).
- Add `pull` to the operation kinds list.
- Verify the `Operation` kind field matches what `src/private/operations/` actually exports.
- Confirm no other new operation kinds were introduced.

**Dependencies:**

- None.

### Iteration: Update Pseudo Code

**Id:** `update-pseudo-code`

**Status:** `DRAFT`

**Purpose:** Update `architecture/_pseudo.md` to reflect current function signatures and add missing pseudo-code.

**Description:** Add resolveCheckoutByName, update saveCheckoutRecord, add pull command pseudo-code, review pull/push/sync pseudo-code.

**Changes:**

- Compact big function declarations to terse and pseudo pseudo.
  - Remove details, like path,
  - Remove all literal code with no business logic value. Example: "const p = path.join".
  - Keep details that implement the responsibility of the unit, but reword to english. Example: "normalized = remove Repository: prefix.
  - Identify local patterns that can be extracted from the logic, such as 3 instructions related to create operation pending, failure, success can be summarised in a "instrumented operation: {terse details of success/error if any | only pending is tracked}"
  - Identify patterns of groups of expressions repeated in different commands. Example: "load repositories, load checkouts, .." => "Hydrate Records".
  - Identify patterns that are more granular but still repeat or more granular "Scan Workspace (refetch = true)".
- Add pseudo for each command pseudo-code and compact. Extract repeated operations.
- Review `pull`, `push`, `sync` pseudo-code against actual implementations.
- Update operation kind factories list.

**Dependencies:**

- None.

### Iteration: Update Reports

**Id:** `update-reports`

**Status:** `DRAFT`

**Purpose:** Verify `architecture/reports.md` matches actual presentation code.

**Description:** Verify report formats match `src/private/present/` implementations.

**Changes:**

- Verify that all report formats match actual presentation code in `src/private/present/`.
- Check if any report columns or formatting changed during implementation.
- This file may need no changes — verify and confirm.

**Dependencies:**

- None.

### Iteration: Update ADRs

**Id:** `update-adrs`

**Status:** `DRAFT`

**Purpose:** Verify `architecture/records/adr/*` is streamlined and reflects

**Description:** Verify report formats match `src/private/present/` implementations.

**Changes:**

Notes for planner: explore the current ADRs, apply the rules below and refine concrete instructions.

Update rules for `cli/workspace/architecture/records/adr/*`

- Remove any decision related exclusively to initial migration steps.
- Remove from any other decision any context that describes previous unfinshjed state, reword it to be independent.
- Check for contradictions.
- Check for omissions in relation to big patterns emerging from design and implementation.
- Identify opportunities to merge and compact different items.
- Identify excessive verbosity. Example "Decision: Type-safe Configuration in ..." is way too long for something so basic. Even the title is long.
- Identify opportunities to extract to 2 different files. Example: CLI is to broad.

**Dependencies:**

- None.

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- None.

### Knowledge to Update

- None.

### Follow Ups

- After this plan lands, the architecture docs will reflect the current state. Future plans should update the docs as part of their own commits rather than creating separate knowledge-update plans.
- Consider adding a "last verified" timestamp or commit hash to each architecture file so staleness is easier to detect.

### Feedback

- No implementation feedback yet.
