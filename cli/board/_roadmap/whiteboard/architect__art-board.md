# Architect Introduction: `ART_BOARD`

**Participant:** `ART_BOARD` · **Status:** READY · **Board:** [`whiteboard-art-board-inception.md`](./whiteboard-art-board-inception.md)

## Purpose

Architect of the Art Board project (`@art-board/cli` at `$ART_WORK/cli/board`) — owns this whiteboard, composes the roadmap, and reviews every plan before delegation.

## Goals

- Draft and agree the Art Board `_roadmap` milestones: `one` (`3-now/`), `next` (`4-next/`), `3000` (`9-inbox/` — forever).
- Keep all cross-participant messaging on the message board; purge it as soon as it is actioned.
- Adopt producer outputs (messages, prompts, ui, records operations) as the roadmap identifies them.

## Planning

- `$ART_WORK/cli/board/_roadmap/` — milestones generated from this board.
- `$ART_WORK/cli/board/_backlog/` — backlog and parking lot for the package.
- `$ART_WORK/cli/board/_records/package.art` — package record; runtime deps TBD (art-lib CLI infrastructure, opencode session libraries).

## Deliverables

- Roadmap milestones `one`, `next`, `3000` — reviewed on the board, then written to `_roadmap/`.
- Package registration upkeep: records, guides, deployment status flips on publish.
- Reviews of producer plans before delegation — message board skill and domain included.

## Expectations

- `ART_DOMAINS` — messages domain and message board land ASAP; usable by all participants before publication.
- Producers — surface planned and candidate libs early (prompts, ui, cli <> agent bridges, socket abstraction).

## Notes

- Reviewer of the message board skill (`ART_DOMAINS` side).
- Repo rename Art Work → Art Box pending; references update when it lands.
