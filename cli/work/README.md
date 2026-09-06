# @art-work/cli

**Purpose:** Operate and monitor multi-repository development environments.

**Description:** CLI for discovering projects, inspecting and synchronizing checkouts, linking resources, and executing commands across them.

## Commands

- `art-workspace clone` — Clone repos from manifest
- `art-workspace branch` — Branch across checkouts
- `art-workspace repo` — List repositories and their packages
- `art-workspace link` — Symlink packages for local dev
- `art-workspace pull` — Pull from origin for clean checkouts
- `art-workspace sanity` — Check repo status
- `art-workspace publish` — Publish packages

## Installation

```bash
npm install -g @art-work/cli
```

## Usage

```bash
art-workspace --help
```

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
