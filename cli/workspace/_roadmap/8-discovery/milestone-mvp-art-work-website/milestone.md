# Milestone: Mvp Art Work Website

**ID:** `mvp-art-work-website`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Publish a minimal website for the Art Workspace Cli.

**Description:** Stand up the smallest site that can grow: what the CLI does, how to install and configure it, and where the docs live. Static, deployable, and owned by `cli/workspace`.

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

Publish a minimal, static Art Workspace Cli website — install, configure, commands — so the CLI has a public face that can absorb documentation and reference pages as later milestones produce them.

## Context

### Upstream Work

| Kind        | Path                                      | Role                                                            |
| ----------- | ----------------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$ART_WORKS_CLI/_backlog/_parking-lot.md` | Tracks short-term actionables, pending questions, and blockers. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and downstream work-item artefacts. Required at all times.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work.        |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORKS_CLI/README.md` (Model) — Installation, config sample, commands, and options. Relevant for Planning Work Item.

::READ `$ART_WORKS/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

One static site for the CLI, living under `cli/workspace`. Content is limited to what already exists: installation, configuration, and the command list. No docs pipeline, no API reference, no interactive UI.

## Phases

| Index | Name                 | Status  |
| ----- | -------------------- | ------- |
| 1     | Choose site stack    | `DRAFT` |
| 2     | Publish minimal site | `DRAFT` |

### Phase: 1 — Choose site stack

**Goal:** Pick the static site generator and hosting target.

**Description:** Evaluate the options already proven in the ecosystem (Astro is the current workspace precedent), record the choice as a decision, and confirm the deployment record shape.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 2 — Publish minimal site

**Goal:** A live URL serving the install, configure, and commands pages.

**Description:** Scaffold the site under `cli/workspace`, source the content from the README and the CLI itself, add the deployment record, and publish.

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

- Draft a plan for Phase 1 once the stack question is settled.

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

**Instructions:** (From `$ART_WORKS/_guide.md`)

Run from the `$ART_WORKS` root:

```bash
npm run ci # lint, test and build
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Coordination

### Not In Scope

- **Documentation pipeline** — owned by Milestone: Mvp Art Work Docs.
- **Interactive or live UI** — owned by Milestone: Terminal UI POC and Milestone: Reactive and Persistent.

### Evidence

- None yet.

### Findings

- **README already carries the content** — installation, a config sample, the command list, and the options list exist, so the first site is a re-presentation, not new authoring.

### Decisions

- **Static only** — the first site is build-once, deploy-once; no runtime.

### Knowledge to Update

- `$ART_WORKS_CLI/README.md` — add the site URL once published.

### Follow Ups

- Fold in generated docs when Milestone: Mvp Art Work Docs delivers them.

### Feedback

- None.
