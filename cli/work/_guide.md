# Guide: Art Work Cli

The Art Work CLI package (`@art-work/cli`, binary `art-work-cli`) orchestrates cross-repo work for the Noodlestan ecosystem. It clones repositories, branches across them, symlinks packages for local development, checks repository status, and publishes packages.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — the workspace CLI overview, plan workflow, and agent interactions.
- `architecture/index.md` — How the workspace CLI is structured, how it works, structures, use cases, and auxiliary functions.

## Package Layout

```
architecture/       — architecture index, docs, decision records (records/adr)
src/                — the CLI source (commands, config, shared, private)
CHANGELOG.md
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** - `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- an architecture reference at `architecture/index.md` describing commands, models, reports, configuration, and logs.
- decision records at `architecture/records/adr`.

## Workflows

This project uses the following workflows:

| Workflow / Path                                                       | Purpose                                          |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| **Deploying** `$DOMAINS/deployments/workflows/deploying/workflow.art` | Organizes deployment of artefacts in operations. |

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
