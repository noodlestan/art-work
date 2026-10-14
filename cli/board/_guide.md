# Guide: Art Board Cli

The Art Board Cli package (`@art-board/cli`, binary `art-board-cli`) coordinates agent sessions around a whiteboard. A POC CLI that monitors whiteboard participant sessions and dispatches "next turn" prompts.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — the Art Board Cli overview, layout, and agent interactions.
- `knowledge/index.md` — use cases, principles, and designs for the commands and session monitoring.

## Package Layout

```
_guide.md           — this file
_roadmap/           — this CLI's roadmap: milestones by stage
_backlog/           — this CLI's backlog: plans, instructions, reports
_records/           — package and deployment records
knowledge/          — index and design docs
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- A knowledge reference at `knowledge/index.md`.

## Conventions

This package follows strict conventions.

::READ `../../_guide.md` for repository-wide conventions.

## Workflows

This CLI uses the following workflows:

| Workflow / Path                                                            | Purpose                                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Roadmapping** `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`     | Organize roadmap creation and maintenance.                                                        |
| **Planning Work** `$DOMAINS/work/workflows/planning-work/workflow.art`     | Create and manage work item lifecycles, collecting operational instructions according to context. |
| **Delegating Work** `$DOMAINS/work/workflows/delegating-work/workflow.art` | Organize work delegation to sub-agents with validation, execution, and verification.              |
| **Executing Work** `$DOMAINS/work/workflows/executing-work/workflow.art`   | Organize work execution by sub-agents to produce completed, verified outcomes and feedback.       |
| **Deploying** `$DOMAINS/deployments/workflows/deploying/workflow.art`      | Organizes deployment of artefacts in operations.                                                  |

### Roadmapping

- This CLI's roadmap lives at `_roadmap/` with subdirectories such as `3-now`, `4-next`, `6-plan`, `8-discovery`, and `9-inbox`.
- The short-term roadmapping focus is captured in `_roadmap/_parking-lot.md`.

### Planning Work

- This CLI's backlog lives at `_backlog/` with subdirectories such as `3-now`, `4-next`, and `6-plan`.
- The short-term focus is captured in `_backlog/_parking-lot.md`.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```
