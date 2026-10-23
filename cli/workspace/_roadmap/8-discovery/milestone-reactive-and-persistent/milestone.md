# Milestone: Reactive and Persistent

**ID:** `reactive-and-persistent`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Make the CLI usable as a long-running, reactive session rather than one-shot commands.

**Description:** Refactor the CLI for reactivity, add a file watcher, keyboard commands, an operation queue, and streaming commands in the UI, so state persists across invocations and the interface stays live.

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

Turn the CLI from a sequence of one-shot commands into a reactive, persistent session: a reactivity refactor at the core, a watcher feeding it, keyboard commands to drive it, an operation queue to order work, and a UI that streams results.

## Context

### Upstream Work

| Kind        | Path                                                                         | Role                                                            |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$ART_WORKS_CLI/_backlog/_parking-lot.md`                                    | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$ART_WORKS_CLI/_roadmap/8-discovery/milestone-terminal-ui-poc/milestone.md` | The display surface this milestone's streaming lands in.        |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and downstream work-item artefacts. Required at all times.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work.        |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORKS_CLI/knowledge/index.md` (Model) — Execution model, operations, and reports. Relevant for Planning Work Item.

::READ `$ART_WORKS/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Core CLI reactivity and session behaviour: state model, watcher, keyboard input, operation queue, and command streaming. Display technology is chosen by Milestone: Terminal UI POC; this milestone produces what it renders.

## Phases

| Index | Name                      | Status  |
| ----- | ------------------------- | ------- |
| 1     | Refactor for reactivity   | `DRAFT` |
| 2     | Add the file watcher      | `DRAFT` |
| 3     | Add the operation queue   | `DRAFT` |
| 4     | Add keyboard commands     | `DRAFT` |
| 5     | Stream commands in the UI | `DRAFT` |

### Phase: 1 — Refactor for reactivity

**Goal:** A core state model that other phases can subscribe to.

**Description:** Reshape the context and store so state changes are observable, without changing command behaviour.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 2 — Add the file watcher

**Goal:** Filesystem changes reach the state model.

**Description:** Watch checkouts, records, and config, feeding changes into the reactive core.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 3 — Add the operation queue

**Goal:** Work is ordered and observable, not fire-and-forget.

**Description:** Queue operations, expose their lifecycle, and keep prior results available across invocations.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 4 — Add keyboard commands

**Goal:** A session can be driven without restarting.

**Description:** Map keyboard input to queue actions, refreshes, and navigation.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 5 — Stream commands in the UI

**Goal:** Running commands stream into the live display.

**Description:** Route operation output through the queue and into whatever display Milestone: Terminal UI POC establishes.

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

- Draft a plan for Phase 1 — nothing downstream can start until the core is observable.

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

- **Display technology** — chosen and proven by Milestone: Terminal UI POC.
- **Hashing and caching** — owned by Milestone: Optimizations.

### Evidence

- None yet.

### Findings

- **Today is one-shot** — every command builds a context, runs, reports, and exits; nothing is observable after the process ends.

### Decisions

- **Reactivity first** — the other four phases depend on Phase 1; nothing is built on the current imperative context.

### Knowledge to Update

- `$ART_WORKS_CLI/knowledge/index.md` — record the reactive model once Phase 1 lands.

### Follow Ups

- Revisit persistence format once the operation queue proves what needs to survive a restart.

### Feedback

- None.
