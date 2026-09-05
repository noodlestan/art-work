# Guide: Workspace CLI

The workspace CLI package (`@art-domains/workspace-cli`, binary `art-workspace`) orchestrates cross-repo work for the Noodlestan ecosystem. It clones repositories, branches across them, symlinks packages for local development, checks repository status, and publishes packages.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — the workspace CLI overview, plan workflow, and agent interactions.
- `_backlog/_parking-lot.md` — the backlog work-in-progress tracker with actionable items, pending work, blockers, and follow-ups.
- `_roadmap/_parking-lot.md` — the roadmapping tracker for forward-looking milestones and actionables.
- `_roadmap/_architect.md` — the forward-looking architect plan with principles, NFRs, and follow-ups.
- `architecture/index.md` — How the workspace CLI is structured, how it works, structures, use cases, and auxiliary functions.

## Package Layout

```
_backlog/           — parking lot, plans, instructions, reports
_roadmap/           — milestones, briefing, and roadmapping parking lot
_records/           — project, package, and deployment records
architecture/       — architecture index, topic docs, and decision records (records/adr)
src/                — the CLI source (commands, config, shared, private)
CHANGELOG.md
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Project:** `_records/project.art`
- **Package:** `_records/package.art`
- **Deployment:** - `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- an architecture reference at `architecture/index.md` describing commands, models, reports, configuration, and logs.
- decision records at `architecture/records/adr`.

## Workflows

This project uses the following workflows:

| Workflow / Path                                                        | Purpose                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Roadmapping** `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art` | Organize roadmap creation and maintenance and coordination of downstream work items.              |
| **Planning Work** `$DOMAINS/work/workflows/planning-work/workflow.art` | Create and manage work item lifecycles, collecting operational instructions according to context. |

### Roadmapping

- The roadmap lives at `_roadmap/` with subdirectories such as `/3-now` and `/4-next/`.
- The short-term roadmapping focus is captured in `_roadmap/_parking-lot.md`.
- The requirements, use cases, and principles are captured in `_roadmap/_architect.md`.

### Planning Work

- The backlog lives at `_backlog/` with subdirectories such as `/3-now` and `/4-next/`.
- The short-term focus is captured in `_backlog/_parking-lot.md` .

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```
