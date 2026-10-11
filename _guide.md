# Guide: Art Work

> Host and manage the Art Work orchestration tools and applications, and their planning artefacts.

Monorepo containing the Art Work orchestration tools and applications. Hosts more than one CLI under `cli/`, and each CLI owns its own roadmap and backlog.

Uses Workflow: Planning Work with one backlog per CLI package, coordinating with Workflow: Roadmapping from one roadmap per CLI package.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: system overview, layout, setup, verification.
- `_records/project.art` — the project record.
- `_records/repository.art` — the repository record.

## Repository Layout

```
_guide.md           — this file
_records/           — project, repository, namespace, and license records
architecture/       — repository-level architecture documentation
cli/                — CLI packages; each owns its _roadmap/ and _backlog/
cli/work            — `@art-work/cli`, plus _roadmap/ and _backlog/
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Project:** `_records/project.art`
- **Repository:** `_records/repository.art`
- **Namespace:** `_records/namespace.art`
- **License:** `_records/license.art`

## Knowledge References

This repository maintains architecture references at:

- `architecture/index.md` — Repository-level architecture index.
- `cli/work/architecture/index.md` — Art Work Cli architecture index.

## Conventions

This repository follows strict conventions.

Read the convention indexes listed below and follow them when planning and executing work.

The following conventions apply to all packages in this repository:

::READ `./node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
::READ `./node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Unit Test conventions.

In case of ambiguity or conflict applying conventions, follow links from the convention indexes to extended convention files and read the examples there for what to follow and what to avoid.

## Workflows

Projects in this repository use the following workflows:

| Workflow / Path                                                            | Purpose                                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Planning Work** `$DOMAINS/work/workflows/planning-work/workflow.art`     | Create and manage work item lifecycles, collecting operational instructions according to context. |
| **Delegating Work** `$DOMAINS/work/workflows/delegating-work/workflow.art` | Organize work delegation to sub-agents with validation, execution, and verification.              |
| **Executing Work** `$DOMAINS/work/workflows/executing-work/workflow.art`   | Organize work execution by sub-agents to produce completed, verified outcomes and feedback.       |
| **Deploying** `$DOMAINS/deployments/workflows/deploying/workflow.art`      | Organizes deployment of artefacts in operations.                                                  |

### Roadmapping

Roadmaps live with the CLI they describe, one per package:

- `cli/work/_roadmap/` — subdirectories such as `3-now`, `4-next`, `6-plan`, `8-discovery`, and `9-inbox`.
- The short-term roadmapping focus is captured in `cli/work/_roadmap/_parking-lot.md`.
- The requirements, use cases, and principles are captured in `cli/work/_roadmap/_architect.md`.

### Planning Work

Backlogs live with the CLI they describe, one per package:

- `cli/work/_backlog/` — subdirectories such as `3-now`, `4-next`, and `6-plan`.
- The short-term focus is captured in `cli/work/_backlog/_parking-lot.md`.
- Planning coordination and constraints are captured in `cli/work/_backlog/_architect.md`.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```
