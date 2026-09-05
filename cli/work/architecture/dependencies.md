# Workspace CLI - Dependencies

## Commander

### Observations (verified on commander 12.1.0)

- Nested commands work two ways: chained `.command('checkout').command('run')` and single-string `.command('checkout run')`.
- Flat and nested commands coexist: `clone` and `checkout clone` can both exist.
- A group command alone (`checkout`) prints the group help and exits 1.
- For `checkout run <command...>` with `-c, --checkouts <PATTERN...>`: default parsing is sufficient; inner flags need `--` (e.g. `checkout run npm run ci -- --filter x`); a quoted command string works; option-before-positionals fails with "missing required argument".
- `passThroughOptions()`/`enablePositionalOptions()` interact subtly with nested parents (the parent greedily consumes positionals before the child parser runs) — avoid unless needed.
