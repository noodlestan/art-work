# Milestone: Terminal UI Poc

**ID:** `terminal-ui-poc`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Prove a terminal UI that displays the workspace live.

**Description:** Build a static-display terminal UI showing live checkout states, operations, a stream, and the operation queue — enough to judge the interaction model before committing to the reactive refactor.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable         | Resolved Path                | Purpose                                                        |
| ---------------- | ---------------------------- | -------------------------------------------------------------- |
| `$WORKSPACE`     | Current working directory    | Workspace root directory                                       |
| `$DOMAINS`       | `$WORKSPACE/.agents/domains` | Domain resources directory                                     |
| `$ART_WORKS`     | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-works` |
| `$ART_WORKS_CLI` | `$ART_WORKS/cli/workspace`   | The Art Workspace Cli package, and its roadmap and backlog.    |

## Summary

Build a static-display terminal UI — live checkout states, an operations panel, a stream, and a queue — as a proof of concept that decides the interaction model before Milestone: Reactive and Persistent invests in the full refactor.

## Context

### Upstream Work

| Kind        | Path                                                                                 | Role                                                            |
| ----------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$ART_WORKS_CLI/_backlog/_parking-lot.md`                                            | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$ART_WORKS_CLI/_roadmap/8-discovery/milestone-reactive-and-persistent/milestone.md` | Supplies the live state this POC renders.                       |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and downstream work-item artefacts. Required at all times.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work.        |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORKS_CLI/knowledge/index.md` (Model) — Present layer, operations log, and report model. Relevant for Planning Work Item.

::READ `$ART_WORKS/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

A proof-of-concept terminal UI in `cli/workspace`: four panels — checkout states, operations, stream, queue — driven by existing scan and operation data. Static display first; live updates come from the reactive milestone.

## Phases

| Index | Name                            | Status  |
| ----- | ------------------------------- | ------- |
| 1     | Choose the terminal UI library  | `DRAFT` |
| 2     | Render static panels            | `DRAFT` |
| 3     | Wire live state into the panels | `DRAFT` |

### Phase: 1 — Choose the terminal UI library

**Goal:** A recorded library choice.

**Description:** Evaluate the terminal UI options for a static display with panels, and record the decision with its costs.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 2 — Render static panels

**Goal:** Four panels rendering captured data.

**Description:** Render checkout states, operations, stream, and queue from a captured snapshot, with no live wiring.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 3 — Wire live state into the panels

**Goal:** Panels refresh as state changes.

**Description:** Feed the POC from the reactive core once Milestone: Reactive and Persistent Phase 1 lands, keeping the display static in structure but current in content.

**Status:** `DRAFT`

**Dependencies:**

- None.

## Items:

| Phase | Resource / Record | Status |
| ----- | ----------------- | ------ |
| -     |                   |        |

No downstream work items are captured yet.

## Work

### Next

- Draft the Phase 1 plan once the display question from Milestone: Mvp Art Work Website is settled, so the two surfaces do not diverge.

### Blockers

- None yet.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_WORKS/_guide.md`)

Run from the `$ART_WORKS` root:

```bash
npm run ci # lint, test and build
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Coordination

### Not In Scope

- **The reactive core** — owned by Milestone: Reactive and Persistent; this POC consumes it, it does not build it.
- **The website** — owned by Milestone: Mvp Art Work Website.

### Evidence

- None yet.

### Findings

- **The present layer already shapes data** — `private/present/` formats checkout reports and operations logs; the POC is a new sink for the same shapes.

### Decisions

- **Static display first** — prove the panel layout before investing in live wiring.

### Knowledge to Update

- `$ART_WORKS_CLI/knowledge/index.md` — record the terminal UI choice once Phase 1 lands.

### Follow Ups

- Decide whether the POC graduates into the product or is discarded after the decision it was built to inform.

### Feedback

- None.
