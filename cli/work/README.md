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

- `npm run dev` — rebuild on change
- `npm run build` — produce the full build
- `npm run build:clean` — remove `dist/`
- `npm run lint` — report prettier, eslint, and `tsc --noEmit` issues
- `npm run lint:fix` — fix formatting and lint issues
- `npm run test` — start vitest over every test in watch mode
- `npm run test:unit` — run the unit tests under `src/` once
- `npm run test:integration` — run the tests under `test/` against `dist/`
- `npm run ci` — lint, build, and run both test suites

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
