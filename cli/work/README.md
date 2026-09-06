# @art-work/cli

**Purpose:** Operate and monitor multi-repository development environments.

**Description:** CLI for discovering projects, inspecting and synchronizing checkouts, linking resources, and executing commands across them.

## Installation

```bash
npm install -g @art-work/cli
```

## Usage

```bash
art-work-cli --help
```

### Commands

- `sanity` — List checkout statuses.
- `checkout run` — Execute an arbitrary command in all matching checkouts.
- `clone` — Create new checkout from know reops.
- `pull` — Pull from origin.
- `push` — Push to origin.
- `sync` — Pull from origin then push to origin.
- `branch` — Branch across multitple checkouts.
- `link` — Symlink packages for local dev.
- `repo` — List repositories and their packages.

## Development

### Build Targets

This package is meant for use in Node.js environments. The entry point is built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling).

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run build` — Build the CLI package
- **$** `npm run build:types:esm` — Generate ESM type definitions
- **$** `npm run build:types:cjs` — Generate CJS type definitions
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run ci` — Run CI pipeline
- **$** `npm run test` — Run tests

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
