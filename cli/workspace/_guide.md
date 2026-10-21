# Guide: Art Workspace Cli

The Art Workspace Cli package (`@art-works/workspace-cli`, binary `art-workspace-cli`) orchestrates cross-repo work for the Noodlestan ecosystem. It clones repositories, branches across them, symlinks packages for local development, checks repository status, and publishes packages.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — the Art Workspace Cli overview, plan workflow, and agent interactions.
- `knowledge/index.md` — use cases, principles, decision records, and designs for the commands, configuration, context model, operations, reports, and dependencies.

## Package Layout

```
_guide.md           — this file
_roadmap/           — this CLI's roadmap: milestones by stage
_backlog/           — this CLI's backlog: plans, instructions, reports
_records/           — package and deployment records
knowledge/       — index, overview, dependencies, adr/, and design/ docs
src/                — the CLI source (commands, config, shared, private)
CHANGELOG.md
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** - `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- A knowledge reference at `knowledge/index.md`.
- Decision records at `knowledge/adr`.

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

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test:unit # runs the unit tests under src/
npm run build # required before the integration tests, which spawn dist/
npm run test:integration # runs the tests under test/ against the built bundles
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build, and run both test suites
```
