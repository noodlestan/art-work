# Parking Lot: Art Work Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## Ongoing

- **Rename the project `art-work` → `art-works`** — supersedes the dead "art box" rename; new target is `art-works`. Covers records, checkout name, packages, docs, and references.
- **Participate in the Art Boards Inception Whiteboard (owned by `ART_BOARDS`)** — board at `$ART_BOARDS/cli/whiteboard/_roadmap/whiteboard-art-boards-inception/whiteboard.md`.
- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; this project is the highest priority.
- **Implement `plan-art-work-cli-global-install`** — Steps 1–6/8 complete; Step 7 partly migrated and blocked on `@art-js/records`; checkpoint `102e828` committed.

---

## ACTIONABLE

None current.

## PENDING

None current.

## BLOCKERS

- **`plan-art-work-cli-global-install` blocked** — Step 7 requires the `@art-js/records` facade, but the package is not declared or installed and is not available from the configured npm registry (`npm info` returns 404). Discovery/content migration is committed; extraction still uses existing `read*Record` parsers. The `@art-lib/fs-records@0.0.2` prerequisite is delivered.

---

## Follow-ups

None current.
