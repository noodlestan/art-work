# Art Work Cli — Configuration

The configuration system of the Art Work Cli: the `.art-workspace.mts` manifest, its structure, authoring, loading mechanism, package exports, and type safety.

## Overview

The workspace configuration is a TypeScript module (`.art-workspace.mts`) at the workspace root that exports workspace paths. It provides type-safe access to workspace structure via `defineConfig` and the `WorkspaceConfig` type.

The config is **manually authored, not generated**. The config points the CLI at the record discovery pattern.

## Configuration Structure

```typescript
interface WorkspaceConfig {
  root: { path: string };
  clone: { path: string };
  checkouts: { path: string; template: string };
  records: { paths: WorkspaceRecordsPath[] };
}

interface WorkspaceRecordsPath {
  base: string; // default '.'
  pattern: string | string[]; // default '*.art'
  ignored: string[]; // default ['node_modules/', '.git/', 'dist/']
  excluded: string[]; // default []
  gitignore: boolean; // default true
}
```

## Options overview

The `records` option controls how the CLI discovers record files. It is a partial path config plus an optional `paths` array; everything normalizes to a list of independent, additive scans.

| Option      | Type                 | Default                               | Meaning                                                                  |
| ----------- | -------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `base`      | `string`             | `'.'`                                 | Scan root, relative to the workspace root.                               |
| `pattern`   | `string \| string[]` | `'*.art'`                             | Glob pattern(s) for record files within the base.                        |
| `ignored`   | `string[]`           | `['node_modules/', '.git/', 'dist/']` | Baseline nested excludes.                                                |
| `excluded`  | `string[]`           | `[]`                                  | Additional nested excludes, merged with `ignored`.                       |
| `gitignore` | `boolean`            | `true`                                | Whether to apply `git check-ignore` as a post-filter.                    |
| `paths`     | `array`              | `[]`                                  | Scoped scans; each inherits the top-level defaults, overridden per path. |

**Discovery logic:**

- Each `paths` entry is an independent scan anchored to its `base`; the glob is `join(root, base, pattern)`.
- `ignored`/`excluded` exclude **nested** paths within the base, never the base itself — so `{ base: 'node_modules/', ignored: [] }` scans `node_modules/` while clearing the baseline for its contents.
- `path.ignored` **overrides** `records.ignored`; `excluded` **merges** with it.
- `gitignore: true` (default) applies `git check-ignore`; `false` skips it.
- Results across all paths are unioned and deduped.
- There is **no `included`** — to include something outside the main scan, add another `paths` entry with a different `base`.

Example:

```typescript
records: {
  pattern: '*.art',
  paths: [
    { base: '.', excluded: ['checkouts/'] },
    { base: '_records/checkouts' },
    { base: 'node_modules/', pattern: '*.{art,md}', ignored: [] },
    { base: 'generated/', gitignore: false },
  ],
}
```

## Authoring Config

The manifest imports `defineConfig` from the `/config` subpath:

```typescript
import { defineConfig } from '@art-work/cli/config';

export default defineConfig({
  clone: { path: 'repos' },
  checkouts: {
    path: '_records/checkouts/',
    template: '.agents/domains/workspace/templates/checkout.art.njk',
  },
  records: { pattern: '*.art' },
});
```

## Loading Mechanism

The CLI loads the config at runtime using esbuild bundle-at-runtime (Vite-style):

1. Read `.art-workspace.mts`.
2. Run `esbuild.build({ entryPoints, bundle: true, write: false, format: 'esm', platform: 'node' })`.
3. Write the bundled output to a temp `.mjs` file.
4. `await import()` the temp file.

The config's `import { defineConfig } from '@art-work/cli/config'` is resolved from the consumer `node_modules` and inlined. The `/config` subpath has zero runtime deps beyond `esbuild` (ESM-friendly), so the CLI command surface (commander, simple-git) never enters the manifest bundle. `esbuild` is therefore a **runtime dependency** of `@art-work/cli` (see `records/adr/cli.art` — "Runtime Config Loading — esbuild Bundle-at-Runtime").

## Package Exports

The CLI package exports two surfaces:

- **`@art-work/cli/config`** — Authoring API for the manifest: `defineConfig`, the `WorkspaceConfig` type, and `loadWorkspaceConfig`.
- **`@art-work/cli`** — Main entry (the `art-workspace` binary) re-exports the config module for the CLI commands and backwards compatibility.

The `exports` map (`./config` → `types` + `import`) keeps the authoring surface stable: renaming types or exports is a breaking change once consumers exist — the manifest is the first consumer.

## Type Safety

The config types mirror the workspace structures:

- `WorkspaceConfig` — top-level config with paths (`root.path`, `clone.path`, `checkouts.*`, `records.*`).
- `RepositoryRecord` — repository facts (name, remote, purpose, description, consumers).
- `CheckoutRecord` — checkout state (name, location, branch, repository).

Type declarations are emitted (`dist/index.d.ts`) and the `exports` map ensures imports resolve and type-check in the `.mts` manifest.

## Why `.mts`?

The root `package.json` has no `"type": "module"`. The explicit `.mts` extension:

- Pins ESM for Node and bundlers.
- Is unambiguous under Node's native type-stripping.
- Signals TypeScript authoring to editors and tooling.

## Design Decisions

The configuration design is captured in `records/adr/cli.art`:

- **Type-safe Configuration in Workspace Root** — `.art-workspace.mts` as a TypeScript ESM module; `/config` subpath for the authoring API; main entry re-exports for the CLI.
- **Runtime Config Loading — esbuild Bundle-at-Runtime** — the manifest is bundled and imported at runtime; `esbuild` becomes a runtime dependency. Reconsider Node native type-stripping when the minimum Node version is guaranteed (≥ 22.6).
- **Manifest Mirrors Records Structures; Checkouts Derived at Entry Point** — superseded in part by the Checkout record decision below.
- **Checkouts as CLI-Managed Records — Structure: Checkout** — status Proposed in the ADR but effectively adopted in implementation: checkouts are persisted in their own records (`_records/checkouts/{repo}.art`) and managed by CLI commands.
- **Records as Source of Truth** — generated files (`.art-workspace.mts`) are derived from records, not maintained separately.
