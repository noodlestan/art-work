# Art Work Cli Architecture

## Documents

| Document                               | Description                                                               |
| -------------------------------------- | ------------------------------------------------------------------------- |
| [overview.md](overview.md)             | Purpose, benefits, definitions, use cases, and how the CLI works          |
| [commands.md](commands.md)             | Command surface, procedures, and edge cases                               |
| [config.md](config.md)                 | `.art-workspace.mts` manifest: structure, authoring, loading, and exports |
| [context-model.md](context-model.md)   | `WorkspaceContext`, `CheckoutStore`, and the records behind them          |
| [operations-log.md](operations-log.md) | Append-only side-effect log of a command invocation                       |
| [reports.md](reports.md)               | Markdown table reports of findings and side effects                       |
| [dependencies.md](dependencies.md)     | Dependency observations and choices                                       |
| [\_pseudo.md](_pseudo.md)              | Pseudo-code and BDD expectations for use cases                            |

## Decision Records

| Record                                             | Decisions                                                                   |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| [adr/cli.art](adr/cli.art)                         | Package layout, manifest format, records, tooling, testing, and type safety |
| [adr/execution-model.art](adr/execution-model.art) | Imperative one-shot execution now, reactive layer later                     |
