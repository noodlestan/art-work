# Milestone: Mvp Art Work Docs

**ID:** `mvp-art-work-docs`

**Status:** `DRAFT`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Define and deliver the minimal documentation set for the Art Workspace Cli, with API docs extracted by a library.

**Description:** Establish what must be documented, then extract API documentation from source using a library. Candidates are `@purrception/lang-ts` extract — which may need rebuilding and republishing — and the language-agnostic `tree-sitter-language-pack`. A further option is to migrate `@purrception/lang-ts` onto tree-sitter and keep only the classification and bundling needed for the symbol-resolution and type-resolution use cases.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable         | Resolved Path                | Purpose                                                             |
| ---------------- | ---------------------------- | ------------------------------------------------------------------- |
| `$WORKSPACE`     | Current working directory    | Workspace root directory                                            |
| `$DOMAINS`       | `$WORKSPACE/.agents/domains` | Domain resources directory                                          |
| `$ART_WORKS`     | Provided with prompt.        | Art Work repository. Example: `$WORKSPACE/checkouts/art-works`      |
| `$ART_WORKS_CLI` | `$ART_WORKS/cli/workspace`   | The Art Workspace Cli package, and its roadmap and backlog.         |
| `$PURRCEPTION`   | Provided with prompt.        | Purrception repository. Example: `$WORKSPACE/checkouts/purrception` |

## Summary

Decide the minimal documentation set for the CLI and the extraction library that produces its API reference — evaluating `@purrception/lang-ts` and `tree-sitter-language-pack`, including the option of migrating `lang-ts` onto tree-sitter — so documentation can be generated rather than hand-maintained.

## Context

### Upstream Work

| Kind        | Path                                                                              | Role                                                            |
| ----------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$ART_WORKS_CLI/_backlog/_parking-lot.md`                                         | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$ART_WORKS_CLI/_roadmap/8-discovery/milestone-mvp-art-work-website/milestone.md` | Where the generated docs are ultimately published.              |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders milestone and downstream work-item artefacts. Required at all times.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmapping lifecycle for discovering, strategising, and coordinating work.        |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_WORKS_CLI/knowledge/index.md` (Model) — The knowledge surface this milestone must cover. Relevant for Planning Work Item.

::READ `$ART_WORKS/_guide.md` (Guide) — Repository setup and verification. Relevant for Setting Up, Verifying Completion.

## Scope

The minimal documentation set for `cli/workspace`, and the library that extracts API docs from its TypeScript source. Purrception library work is upstream, not in this CLI.

## Phases

| Index | Name                                 | Status  |
| ----- | ------------------------------------ | ------- |
| 1     | Define the minimal documentation set | `DRAFT` |
| 2     | Evaluate extraction libraries        | `DRAFT` |
| 3     | Extract and publish API docs         | `DRAFT` |

### Phase: 1 — Define the minimal documentation set

**Goal:** A short, agreed list of what must exist.

**Description:** Decide the smallest set that is worth publishing — install, configuration, command reference, and generated API reference — and what is explicitly deferred.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 2 — Evaluate extraction libraries

**Goal:** A chosen extraction path, recorded as a decision.

**Description:** Evaluate `@purrception/lang-ts` extract (checking whether it needs rebuilding and republishing), `tree-sitter-language-pack`, and the hybrid option: migrate `@purrception/lang-ts` to tree-sitter and retain only the classification and bundling needed for the symbol-resolution and type-resolution use cases. Compare coverage of the CLI's surface, maintenance cost, and packaging readiness.

**Status:** `DRAFT`

**Dependencies:**

- None.

### Phase: 3 — Extract and publish API docs

**Goal:** Generated API reference, published with the site.

**Description:** Wire the chosen extractor into the docs build, render the API reference, and serve it from the site produced by Milestone: Mvp Art Work Website.

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

- Draft the Phase 1 plan — the documentation set decides everything downstream.

### Blockers

- **Extraction library readiness** — `@purrception/lang-ts` may need rebuilding and republishing before it can be evaluated as-is; Purrception is currently frozen on limited human bandwidth.

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

- **Site stack and hosting** — owned by Milestone: Mvp Art Work Website.
- **Purrception library changes** — rebuilding, republishing, or migrating `@purrception/lang-ts` belongs to `$PURRCEPTION`.

### Evidence

- None yet.

### Findings

- **Two extraction paths** — a TypeScript-specific extractor (`@purrception/lang-ts`) versus a language-agnostic parser pack (`tree-sitter-language-pack`); the second generalises but needs more classification work on top.
- **Hybrid is on the table** — keep `lang-ts`'s classification and bundling, swap its parsing for tree-sitter, and scope it to symbol and type resolution only.

### Decisions

- **Evaluate before committing** — Phase 2 produces a recorded decision; no extractor is adopted before that.

### Knowledge to Update

- `$ART_WORKS_CLI/knowledge/index.md` — record the docs extraction decision once Phase 2 lands.

### Follow Ups

- Revisit the extractor choice when a second CLI in this repository needs the same pipeline.

### Feedback

- None.
