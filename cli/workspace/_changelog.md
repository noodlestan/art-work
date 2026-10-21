# Changelog: Add Config Cache

**Plan:** `add-config-cache` — closed 2026-10-13.

**Outcome:** Delivered. All 4 iterations implemented, integrated, and verified; no worker deviations recorded in the `instructions/*__report.md` reports.

## User-visible change

- The compiled config bundle no longer lands in the workspace root; it is stored under `node_modules/.art-work/` alongside its change-tracking metadata.
- The cached compilation is reused while the recorded sources are unchanged, so repeat runs skip recompilation.
- A `--no-config-cache` flag forces recompilation for a single invocation, for the cases where the cache cannot be trusted.
- Knowledge docs updated to describe the cache and the bypass flag.

## Commits

| Commit    | Message                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `8821977` | build(art-work-cli): Move compiled config into `node_modules/.art-work`. |
| `d68a57f` | build(art-work-cli): Reuse compiled config when sources are unchanged.   |
| `9548943` | build(art-work-cli): Add `--no-config-cache` flag.                       |
| `298d6dc` | docs(art-work-cli): Document config cache and no-config-cache option.    |

## Iterations

All four `DONE`: Move Config Bundle To Cache · Cache Config By Source Hash · Add No Config Cache Flag · Update Config Knowledge.
