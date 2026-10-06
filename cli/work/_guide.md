# Guide: Art Work Cli

The Art Work Cli package (`@art-work/cli`, binary `art-work-cli`) orchestrates cross-repo work for the Noodlestan ecosystem. It clones repositories, branches across them, symlinks packages for local development, checks repository status, and publishes packages.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — the Art Work Cli overview, plan workflow, and agent interactions.
- `architecture/index.md` — use cases, principles, decision records, and designs for the commands, configuration, context model, operations, reports, and dependencies.

## Package Layout

```
architecture/       — index, overview, dependencies, adr/, and design/ docs
src/                — the CLI source (commands, config, shared, private)
CHANGELOG.md
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** - `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- An architecture reference at `architecture/index.md`.
- Decision records at `architecture/adr`.

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
