# Milestone: Mvp Art Records

**ID:** `mvp-art-records`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Read and write `.art` files through the Art JS libraries rather than bespoke parsing.

**Description:** Adopt the Art JS codecs in the Art Work Cli so that record discovery, reading, and writing go through the shared libraries, replacing the ad-hoc file handling currently in `private/resources/`.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable        | Resolved Path                | Purpose                                                                                             |
| --------------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `$WORKSPACE`    | Current working directory    | Workspace root directory                                                                            |
| `$DOMAINS`      | `$WORKSPACE/.agents/domains` | Domain resources directory                                                                          |
| `$ART_WORK`     | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-work-planning`                              |
| `$ART_WORK_CLI` | `$ART_WORK/cli/work`         | The Art Work Cli package, and its roadmap and backlog.                                              |
| `$ART_JS`       | Provided with prompt.        | Art JS repository (extract, validate, project art). Example: `$WORKSPACE/checkouts/art-js-planning` |

## Summary

Make the Art Work Cli read and write `.art` files through the Art JS libraries so record handling stops being bespoke, stays consistent with the rest of the ecosystem, and picks up codec fixes for free — scoped to the record resources in `private/resources/` and the scan layer that feeds them.

## Context

### Upstream Work

| Kind        | Path                                                                   | Role                                                                   |
| ----------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Parking Lot | `$ART_WORK_CLI/_backlog/_parking-lot.md`                               | Tracks short-term actionables, pending questions, and blockers.        |
| Milestone   | `$ART_JS/_roadmap/3-now/milestone-art-records/milestone.md`            | Art JS side of records: the libraries this CLI will consume.           |
| Milestone   | `$ART_WORK_CLI/_roadmap/3-now/milestone-art-work-cli-one/milestone.md` | Current CLI milestone; its Phase 3 decompose work feeds into this one. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and downstream work-item artefacts. Required at all times.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work.        |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORK_CLI/knowledge/index.md` (Model) — Command surface, data model, and record loading. Relevant for Planning Work Item.

::READ `$ART_WORK/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Replace the bespoke `.art` file handling under `$ART_WORK_CLI/private/resources/` and the scan layer that feeds it with calls into the Art JS libraries. No command surface change, no config schema change.

## Phases

| Index | Name                         | Status  |
| ----- | ---------------------------- | ------- |
| 1     | Evaluate Art JS record libs  | `DRAFT` |
| 2     | Read records through Art JS  | `DRAFT` |
| 3     | Write records through Art JS | `DRAFT` |

### Phase: 1 — Evaluate Art JS record libs

**Goal:** Confirm which Art JS packages cover the CLI's read and write needs.

**Description:** Inventory the current bespoke record loading and writing, map each onto an Art JS library API, and record any gaps as blockers or follow-ups.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 2 — Read records through Art JS

**Goal:** All record reads go through the Art JS libraries.

**Description:** Replace the loaders under `private/resources/checkout`, `private/resources/repository`, `private/resources/namespace`, `private/resources/package`, and `private/resources/project` with library calls, preserving the existing record shapes consumed by commands.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 3 — Write records through Art JS

**Goal:** All record writes go through the Art JS libraries.

**Description:** Replace the record writers so clone and any other record-producing path emit files through the shared serializer, keeping templates and naming conventions intact.

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

- Refine the phases, then draft plans for Phase 1 and Phase 2.

### Blockers

- None yet. Gaps found in Phase 1 evaluation become blockers here.

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

- **Command surface** — commands, flags, and reports stay as they are.
- **Art JS library development** — gaps belong to `$ART_JS`, not to this CLI.

### Evidence

- None yet.

### Findings

- **Bespoke loaders today** — `private/resources/*/load*.ts` hand-roll record discovery and parsing; the ecosystem already has shared codecs.

### Decisions

- **Reads before writes** — Phase 2 lands before Phase 3 so the read path proves the library contract before the write path depends on it.
- **No behaviour change** — record shapes consumed by commands are preserved; this is a substrate swap.

### Knowledge to Update

- `$ART_WORK_CLI/knowledge/index.md` — document the records substrate once Phase 2 lands.

### Follow Ups

- Confirm whether `@art-lib/fs-records` and the Art JS codecs converge or one supersedes the other.

### Feedback

- None.
