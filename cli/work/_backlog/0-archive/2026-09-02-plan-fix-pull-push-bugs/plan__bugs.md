# Plan Bugs: Workspace CLI — Pull Push Bugs

**Plan:** `fix-pull-push-bugs`

## Summary

Lists bugs reported for `@art-domains/workspace-cli` related to the pull/sync/sanity commands and behind detection. Sources include user sessions, parking lot, and source code investigation.

## Bug Format

Every bug entry MUST follow this shape:

- `Bug.id` — stable identifier shared with the matching plan iteration.
- `Scenario` — reproduce steps.
- `Expected` — expected behaviour.
- `Happened` — observed behaviour, with evidence when available.
- `Description` — the short bug description in one sentence.

Fixed bugs stay at the bottom of the file and additionally record:

- `Root Cause` — why the bug occurred.
- `Fix` — how the bug was fixed.
- `Test` — coverage added or why it was not tested.
- `Improvements` — other changes to make/made.
- `Follow Ups` — remaining work.
- `Commit.id` — implementation commit or iteration identifier.

## Bugs

### Bug: `pull` command always reports behind even on clean checkout

**Bug.id:** `pull-behind-false-positive`

**Description:** The pull command reports "N commit(s) behind" and attempts a pull even when the checkout is clean and up to date with the remote.

**Scenario:** On a workspace with a cloned checkout that is up to date with its remote (no new commits on origin, local HEAD matches origin/main), run `npm run workspace pull`.

**Expected:** The pull command reports no issues for the clean checkout and performs no pull operation. The checkout report shows empty states.

**Happened:** The checkout report shows "N commit(s) behind" (where N > 0) and the pull operation is attempted, even though the checkout is genuinely up to date.

**Root Cause:** Investigation points to `getBehindCount` in `src/private/git/getBehindCount.ts`. The function runs `git rev-list --count HEAD..origin/<branch>` which compares HEAD against the **local** `origin/<branch>` tracking branch reference. This reference is only updated by `git fetch`. Neither `scanAllCheckoutsStates` nor the pull/sync/sanity commands run `git fetch` before scanning. If the local `origin/<branch>` reference is stale (advanced by a previous fetch while HEAD was reset/rebased, or never updated), the behind count is inaccurate. Secondary suspect: `getRemoteBranch` in `src/private/git/getRemoteBranch.ts` may return a stale or incorrect tracking branch name in certain git states.

**Test:** Write a test that creates a clean checkout up to date with origin (no fetch needed), runs `runPull`, and asserts no issues and no pull operation.

**Follow Ups:** This same root cause affects `sync` and `sanity --auto` which share the same scan-then-pull flow. Fixing the scan should fix all three commands.

### Bug: behind count not showing when checkout IS behind

**Bug.id:** `pull-behind-false-negative`

**Description:** The behind count does not appear in checkout reports when the checkout is actually behind the remote, and sync does not attempt to pull.

**Scenario:** On a workspace with a cloned checkout where origin has commits that the local branch does not have (checkout is behind), run `npm run workspace pull` or `npm run workspace sync`.

**Expected:** The checkout report shows "N commit(s) behind" and the pull command attempts a pull (sync should also pull when behind).

**Happened:** The checkout report shows no behind issue, and no pull is attempted. The checkout remains behind.

**Root Cause:** Likely the same family of issues as the false positive — the behind detection in `getBehindCount` / `scanCheckoutState` / `createCheckoutScan` is unreliable. May also involve `sync` not calling pull when `should('pull')` returns false due to incorrect scan state.

**Test:** Write a test that creates a checkout behind origin (origin has commits local does not), runs `runPull`, and asserts "N commit(s) behind" appears and pull is attempted.

**Follow Ups:** The parking lot item "Fix behind count not showing" tracks this. Same root cause investigation covers both false positive and false negative.
