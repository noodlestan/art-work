# Milestone: Art Work 9000

**ID:** `art-work-9000`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Capture long-term ideas for the Art Work CLis.

**Description:** An inbox for ideas that are real but not yet schedulable — ambitious directions, ecosystem plays, and research bets — kept where they can be found without cluttering the active roadmap.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable        | Resolved Path                | Purpose                                                                |
| --------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `$WORKSPACE`    | Current working directory    | Workspace root directory                                               |
| `$DOMAINS`      | `$WORKSPACE/.agents/domains` | Domain resources directory                                             |
| `$ART_WORK`     | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-planning` |
| `$ART_WORK_CLI` | `$ART_WORK/cli/workspace`    | The Art Workspace Cli package, and its roadmap and backlog.            |

## Summary

Hold the long-term ideas for the Art Work CLis in one place, promoted into real milestones when their time comes and pruned when they do not.

## Context

### Upstream Work

| Kind        | Path                                     | Role                                                            |
| ----------- | ---------------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$ART_WORK_CLI/_backlog/_parking-lot.md` | Tracks short-term actionables, pending questions, and blockers. |

### Required Skills

- `write-milestone` — Writes milestones from roadmaps and parking lots. Required for Contextualizing, Drafting.

### Domains

| Domain / Path                                 | Description                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work. |

### Knowledge

::READ `$ART_WORK/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Long-term ideas only. Anything with a clear next step belongs in a real milestone or backlog stage, not here.

## Phases

| Index | Name   | Status  |
| ----- | ------ | ------- |
| -     | (none) | `DRAFT` |

This milestone has no phases by design — ideas arrive as items and leave by promotion.

## Items:

| Phase | Resource / Record | Status |
| ----- | ----------------- | ------ |
| -     |                   |        |

### Plan: Promote Ideas Into Real Milestones

**Status:** `DRAFT`

**Purpose:** Keep the inbox honest.

**Description:** Review this milestone when a nearby milestone is being planned; promote anything that suddenly has a next step, and drop anything that has gone stale.

**Changes:**

- Periodically review the captured ideas against the active roadmap.
- Promote an idea into a `6-plan` or `8-discovery` milestone when it gains a clear next step.
- Drop an idea when it is superseded, rejected, or has gone stale.

**Dependencies:**

- None.

## Work

### Next

- Capture the first ideas as they surface; nothing to schedule yet.

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
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_WORK/_guide.md`)

Run from the `$ART_WORK` root:

```bash
npm run ci # lint, test and build
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Coordination

### Not In Scope

- **Anything schedulable** — if it has a next step it belongs in `3-now`, `4-next`, `6-plan`, or `8-discovery`.

### Evidence

- None yet.

### Findings

- None yet.

### Decisions

- **No phases** — ideas are not sequenced; they are promoted whole or dropped.

### Knowledge to Update

- None.

### Follow Ups

- Revisit whenever a `8-discovery` milestone is being planned.

### Feedback

- None.
