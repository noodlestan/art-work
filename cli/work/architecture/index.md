# Architecture: Art Work Cli

## Documents

| Document                           | Purpose                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| [overview.md](overview.md)         | Overview of the Art Work Cli: benefits, definitions, use cases, and how it works |
| [dependencies.md](dependencies.md) | Dependency observations and choices behind this CLI                              |

## Design Documents

| Document                                             | Purpose                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [design/commands.md](design/commands.md)             | Command surface of the Art Work Cli: arguments, procedures, reports, and edge cases        |
| [design/config.md](design/config.md)                 | The `.art-workspace.mts` manifest: structure, authoring, loading, exports, and type safety |
| [design/context-model.md](design/context-model.md)   | Per-command data model: `WorkspaceContext`, `CheckoutStore`, and the records behind them   |
| [design/operations-log.md](design/operations-log.md) | Append-only side-effect log of a command invocation                                        |
| [design/reports.md](design/reports.md)               | Markdown table reports of findings and side effects                                        |
| [design/\_pseudo.md](design/_pseudo.md)              | Pseudo-code and BDD expectations for the Art Work use cases                                |

## Decision Records

| Record                                             | Purpose                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [adr/cli.art](adr/cli.art)                         | How the CLI is structured and delivered: package layout, manifest format, records, tooling, and type safety |
| [adr/execution-model.art](adr/execution-model.art) | How Art Work commands execute: imperative one-shot now, reactive layer later                                |
| [adr/distribution.art](adr/distribution.art)       | How this CLI is shaped for its consumers: module format, compiled output, and declarations                  |
