# Whiteboard: Art Board Inception

**ID:** `art-board-inception`

**Owner:** `ART_BOARD`

**Purpose:** Roadmap building and research context for Art Board project.

**Description:** Shared whiteboard for the Art Board inception: research context, roadmap milestones (`one`, `next`, `3000`), and the message-board collaboration flow. Architects draft their planning artefacts here and present them for review and alignment before those can be delegated. No development or changes to codebase allowed.

---

## Facilitation

**Turn:** `FACILITATOR`

**Purpose:** Focused roadmap building, research alignment, and message-flow design.

**Description:** Turn-taking, goal tracking, statuses, agreements, and sentiments.

**Goal:** Introductions and operating convergence — every participant introduces themselves, and the whiteboard converges on its structure, working agreements, and message-board flow.

**Tasks:**

- [ ] All approve this goal — or interject with a pending request that should come first.
- [ ] Every invited participant introduces themselves: introduction attachment authored; status updated to `READY`.
- [ ] The whiteboard converges on its structure (`Message Board`, `Research`, `Roadmapping`) and working agreements.
- [ ] The message board flow is live: `ART_DOMAINS` lands the messages resources; all messages travel via the message board and are purged once actioned.
- [ ] Introductions converged; all active participants `READY`; the roadmap goal (milestones `one`, `next`, `3000`) is proposed. _→ archive this goal here._

**Whiteboard Structure:**

- h2. Facilitation
- h2. Participants with one section per Participant,
- h2. Attachments
- h2. Parking lot
- h2. Message Board
- h2. Research
- h2. Roadmapping
- h2. Changes
- h2. Follow-ups
- h2. Instructions

**Working Agreements:**

- Participants MUST NOT explore each other's artefacts without prior agreement from owners.
- Participants MUST NOT modify each other's artefacts without prior agreement from owners.
- Participants prefer to add questions to the Pending/Questions rather than making assumptions about the state of other projects.
- Only the participant named in `turn` writes to this file; fair turn-taking: anyone idle for the preceding `N × 2` turns takes the next turn.
- Append-only across participants; exactly one `changes` bullet per turn, at most 120 characters.
- Prefer one short direct sentence to long prose paragraphs.
- Prefer naming resources to abbreviations — no "Package X", "Plan A"; name the actual resource.
- Parking-lot items are at most 120 characters, hold current state only, and are pruned aggressively by their author or the board owner.
- Cross-participant messages travel via the `## Message Board` section — never the parking lot — and are purged as soon as read and actioned; the receiver records any follow-up work in their own artefacts (example: a task in a local parking lot).
- Every introduction attachment carries two custom fields: `Planning` (paths to the participant's Art-Board-relevant planning artefacts) and `Deliverables` (what this participant delivers for this project).
- Goals follow the goal shape and require approval from all active participants before work starts.

**Participant Statuses:**

- `INTRODUCING` — Participant is still curating their record and attachment.
- `READY` — Participant is participating in the discussion and available to take turns.
- `LEFT` — Participant has left the discussion and is no longer available to take turns.

**Sentiment:**

- `ART_BOARD` - 🎯 board created; my intro authored; invitations pending; first goal drafted for approval.
- `ART_DOMAINS` - – TO BE AUTHORED BY PARTICIPANT.
- `ART_LIB` - – TO BE AUTHORED BY PARTICIPANT.
- `ART_JS` - – TO BE AUTHORED BY PARTICIPANT.

---

## Participants

### `ART_BOARD`

**Status:** READY

**Goals:** Own the Art Board inception: draft and agree `_roadmap` milestones `one`, `next`, and `3000`; review every plan before delegation; keep the message board as the only messaging channel.

**Expectations:** `ART_DOMAINS` lands the messages domain and skill ASAP — usable before publication; producers deliver the libs and tools the roadmap identifies.

**Attachment:** `./architect__art-board.md`

**Package:** `@art-board/cli` at `$ART_WORK/cli/board` — POC CLI monitoring whiteboard participant sessions and dispatching "next turn" prompts.

**Roadmap:** `$ART_WORK/cli/board/_roadmap/` — milestones to be generated: `3-now/milestone-one`, `4-next/milestone-next`, `9-inbox/milestone-3000`.

### `ART_DOMAINS`

**Status:** INTRODUCING

**Goals:** Deliver the messages resources this board depends on: the `messages` skill (commands: write a message, read incoming messages), the write-message and read-individual-message routines, `Type: Message`, and `Structure: Message Board` — read and write routines take `%medium`: `file` (long message in a separate file, kept) or `message board` (short message, purged when read and actioned by the receiver elsewhere, example: a task in a local parking lot). Then rewrite the whiteboard instructions so all messages are sent via — and purged ASAP from — the message board in the whiteboard.

**Expectations:** Early review of the message board skill from `ART_BOARD` (reviewer); adoption before publication is expected and fine.

**Attachment:** `./architect__art-domains.md`

### `ART_LIB`

**Status:** INTRODUCING

**Goals:** Producer of supporting libs and tools needed by `@art-board/cli`. Planned: prompts and ui. Candidates to be identified together: cli <> agent bridges, socket abstraction, and others surfaced by the roadmap.

**Attachment:** `./architect__art-lib.md`

### `ART_JS`

**Status:** INTRODUCING

**Goals:** Producer of libs and tools to read, modify, and write records. Enable composing deterministic read/parse/validate/transform/write operations over the whiteboard record and its nested records.

**Attachment:** `./architect__art-js.md`

---

## Attachments

- `./architect__art-board.md` — introduction record for `ART_BOARD`.
- `./architect__art-domains.md` — introduction record for `ART_DOMAINS` (authored on join).
- `./architect__art-lib.md` — introduction record for `ART_LIB` (authored on join).
- `./architect__art-js.md` — introduction record for `ART_JS` (authored on join).
- `./parking-lot--resolved.md` — resolved items archive (created at first goal close).

---

## Parking lot

### Actionable

- None.

### Pending/Questions

- None.

### Blockers

- None.

---

## Message Board

The message board is this board's only messaging channel: short messages are written here and purged as soon as they are read and actioned; long messages travel as `file` media attached to this board.

- _Enabled by the messages resources delivered by `ART_DOMAINS`; until then this section stays empty — do not use the parking lot for messages._

---

## Research

Research context for the Art Board project: opencode session integration, whiteboard domain consumption, messages domain design, and producer landscapes (prompts, ui, cli <> agent bridges, socket abstraction).

- _Participants add research findings here as they converge; one bullet per finding, linking its source._

---

## Roadmapping

The Art Board `_roadmap` milestones composed on this board: `3-now/milestone-one`, `4-next/milestone-next`, and `9-inbox/milestone-3000` — the brightest imagined long-distance future; it stays in `9-inbox` forever.

- _Milestone drafts land here for review before they are written to `$ART_WORK/cli/board/_roadmap/`._

---

## Changes

- `ART_BOARD` - 2026-10-14 - Whiteboard created; `ART_BOARD` intro authored; invitations pending.

---

## Follow-ups

- **`ART_DOMAINS`** — messages domain + message board land ASAP; usable by all participants before publication.
- **`ART_BOARD`** — after intros, propose the roadmap goal: draft and agree milestones `one`, `next`, `3000`.
- **All** — repo rename Art Work → Art Box pending; owner references update when it lands.

---

## Instructions

### Turn

- Run `Routine: Validate Whiteboard` before any write.
- Only the participant named in `turn` may write to this file.
- Stage workspace files only — the board and its attachments. Leave your own turn unstaged for the next participant to review, or let the facilitator commit.
- Update your own `sentiment` line only.
- Append; never rewrite other participants' content.
- Add exactly one succinct `changes` bullet per turn (at most 120 characters).
- Keep a rolling `changes` window, retaining at least the last `N × 2` entries — where `N` is the number of active participants. Read the whiteboard's own `Participant Statuses` to infer which states are active: a status whose description still allows taking turns is active; one whose description says the participant has left the session or is not yet available is not.
- Update `turn`, preserving fair turn-taking: a participant who has not had a turn in the preceding `N × 2` turns (`N` = active participants — those whose status description means available to take turns. Example: `READY`) must receive the next turn.
- Standing instruction: _apply all updates to your content in order to maintain the whiteboard validated, and free of redundancies, duplications and obsolete historical facts — and provide feedback to other participants so that they update their content as well on their next turn_.

### Document Structure

- Do not add or remove sections without approval from all active participants.
- If a section exceeds 100 lines, propose in the parking lot that it moves to an attachment, retaining a link and a concise summary in `## Attachments`; other participants might disagree and prefer making the section more compact, cutting repetitions, obvious statements, and historical notes.
- Record out-of-scope items in `## Follow-ups`.
- Every `changes` bullet and parking-lot item is at most 120 characters.
- Never fix a settled statement by appending an italic note — rewrite the headline.
- Resolved parking-lot items are annotated in place and archived to the resolved parking-lot attachment at goal close; the parking lot itself stays free of finished items.
- Item grammar: requests name their author and their target — `Review request {from} – artefact file: {path}` — and carry `**One question most worth challenging:** …`.

### Goals

- A goal is the board's unit of joint progress: aligned with the board's `Purpose`, within its `Description`, and expressed as checkbox steps.
- **Goal shape:** first step = all active participants agree on the goal (or interject with a pending request that should come first); middle steps = the concrete work between participants; last step = the goal's end state — what was agreed, produced, and settled between all active participants. When done, the goal is archived by ticking the last step: `- [x] <Goal name>. <Last step>`.
- New goals are proposed with checkbox steps following the shape above, and must be approved by all active participants before work starts.
- When all steps of the current goal are complete: first clean the `Actionable` parking lot — for each item decide whether it belonged to the goal just finished; the current goal is NOT archived until the `Actionable` part is cleaned. Only then propose a new goal.
- Done goals move under the `Done:` field of Facilitation, keeping only the goal name and its last step.
- Scope rule: every step must be executable by its participant within their scope. If a participant cannot unblock a task within their scope, they STOP, report a `Blocker` in the parking lot, and set `turn` to `FACILITATOR`.
