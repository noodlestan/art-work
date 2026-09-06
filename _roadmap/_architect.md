# Architect Briefing: Art Work Roadmap

This file tracks the forward-looking plan: why, principles, NFRs, definitions, conventions, and follow-ups.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `cli/work/architecture/index.md` — How the Art Work Cli is structured, how it works, and its use cases.
- `cli/work/architecture/config.md` — The configuration system.
- `cli/work/architecture/commands.md` — The command surface, procedures, and edge cases.
- `cli/work/architecture/context-model.md` — Records and `WorkspaceContext`, `CheckoutStore`, `Checkout`.
- `cli/work/architecture/operations-log.md` — How operations are logged.
- `cli/work/architecture/reports.md` — How state and operation logs are presented.
- `cli/work/architecture/_pseudo.md` — the CLI pseudo-code contract: data structures, use cases, and auxiliary functions.
- Decision records in `architecture/records/adr/`: `cli.art`, `execution-model.art`, and `publish.art`.

## Why

The Noodlestan ecosystem spans multiple independent repositories (`artificials`, `purrception`, `purrtrait`, `purrpose`, `no-comply`, `workspace-tooling`, ...). Each repo builds standalone, but cross-repo development requires coordination: cloning relevant repositories to controlled checkouts, branching across them, symlinking for local dev, and publishing packages. The workspace meta-repo orchestrates this workflow.

## Principles

- No repo depends on the workspace to build.
- Dependencies point one way when possible; reverse edges via publish-then-symlink, not git URLs.
- Publish packages to npm before they can be consumed across repos.
- The workspace owns cross-repo workflow; repos own their hooks and CI.
- The workspace `context` checkout must never commit to an extracted project.
- Workspace tooling lives in the artificial ecosystem (`@art-work/cli`) and cli libraries in (`@art-lib/lib-*`
- Records are the source of truth; generated files (`.art-workspace.mts`) are derived from records.
- **Imperative first, reactive later.** Commands run as one-shot processes now; the store and log are in-memory per invocation. The design must stay clean enough that `npm run workspace watch` can subscribe to filesystem events and re-scan without rearchitecting. See `architecture/records/adr/execution-model.art`.

## NFRs

- **`git clone <repo>` + `npm install` + `npm run ci` succeeds in every repo independently, without the workspace.**
- Deterministic checkout of all repos from one manifest.
- Each repo's pre-commit runs only its scoped graph, with caching on.
- GitHub Actions runs for all projects and the workspace.
- `.agents/` sits at the root of every checkout (workspace and project).
- **Tested** — every unit carries at least a minimum viable test, BDD specs guide design, and the testing shape follows need ("it depends"), not a prescribed ratio (see `architecture/records/adr/cli.art` → Testing Strategy).
- **`npm run workspace watch`** — future mode that re-scans checkouts on filesystem events and re-reports without re-invocation. Store must be rehydratable from disk at any point.

## Follow-ups

- **repo-ci** — GitHub Actions workflows for all repos (DRAFT, needs instruction file).
