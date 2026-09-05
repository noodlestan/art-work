# Instructions: Update Commands Knowledge

**Plan:** `scope-commands-to-location`

**Iteration Id:** `update-commands-knowledge`

## Mandatory Reading

::READ `$PROJECT/_backlog/4-next/plan-scope-commands-to-location/plan.md` (Plan) — Full plan context.
::READ `$PROJECT/architecture/commands.md` (Source) — Current command documentation.
::READ `$PROJECT/architecture/_pseudo.md` (Source) — Current pseudo-code, including `resolveCheckoutByName` at line 216.

---

## Step 1: Add `### Command Arguments` section to `commands.md`

In `$PROJECT/architecture/commands.md`, add a new section **before** the individual command sections (after `## Command Surface` table):

````md
## Command Arguments

Shared argument conventions used across commands.

### `--checkouts <PATTERN...>` (shorthand `-c`)

Scope the operation to one or more checkouts. Patterns support exact match and wildcard matching against checkout **name** and **location**.

**Matching rules:**

- Patterns **without** `*` are exact-match only (case-insensitive). If no checkout matches exactly, a warning is printed and the pattern produces zero results. This prevents accidental partial matches.
- Patterns **with** `*` are treated as wildcards: `*` is converted to `.*` (RegExp) and matched against both `CheckoutRecord.name` and `CheckoutRecord.location` (case-insensitive, no `^` anchor).
- Results are deduplicated by `record.location` — the same checkout matched by multiple patterns appears once.
- When omitted, all checkouts are processed.

**Examples:**

```bash
npm run workspace pull -c "art-js"              # exact name match
npm run workspace pull -c "art-js-planning"     # exact location match
npm run workspace pull -c "art*"                # wildcard: matches art-js, art-js-planning, etc.
npm run workspace pull -c "* @ planning"        # wildcard: matches all planning checkouts
npm run workspace pull -c "art-js" -c "purr*"   # mixed: exact + wildcard
```
````

### `--auto` (shorthand `-a`)

Enable automatic mode for the command (e.g. auto-push, auto-publish). Behaviour varies by command.

````

## Step 2: Update individual command sections

In each command section (Pull, Push, Sync, Branch), update the **Usage** line to reference the shared arguments:

**Pull:**
```md
**Usage:** `pull [-c <PATTERN...>]`

Pull from origin for selected checkouts. See [Command Arguments](#command-arguments) for `--checkouts` behaviour.
````

**Push:**

```md
**Usage:** `push [-c <PATTERN...>]`

Push to origin for selected checkouts. See [Command Arguments](#command-arguments) for `--checkouts` behaviour.
```

**Sync:**

```md
**Usage:** `sync [-c <PATTERN...>]`

Sync selected checkouts — pull then push. See [Command Arguments](#command-arguments) for `--checkouts` behaviour.
```

**Branch:**

```md
**Usage:** `branch <branch> [-c <PATTERN...>]`

Create and checkout the same feature branch in selected checkouts. See [Command Arguments](#command-arguments) for `--checkouts` behaviour.
```

Remove any redundant descriptions of checkout resolution from these sections — the shared section covers it.

## Step 3: Update `Command Surface` table

Update the table at the top of `commands.md` to reflect the new usage:

| command  | usage                               | status      |
| -------- | ----------------------------------- | ----------- |
| `pull`   | `pull [-c <PATTERN...>]`            | implemented |
| `push`   | `push [-c <PATTERN...>]`            | implemented |
| `sync`   | `sync [-c <PATTERN...>]`            | implemented |
| `branch` | `branch <branch> [-c <PATTERN...>]` | implemented |

(Update status from `planned` to `implemented` for pull/push/sync if they are now done.)

## Step 4: Update `_pseudo.md`

### 4a. Add `getCheckoutsByPattern` to the store section

Find the store interface section in `_pseudo.md` and add:

```pseudo
### Function: getCheckoutsByPattern(store, patterns)

**Responsibility:** Resolve checkout patterns to a deduplicated list of checkouts. Supports exact match (no wildcard) and wildcard match (pattern contains *).

**Pseudo:**

getCheckoutsByPattern(store, patterns)
  matched = new Map()  // keyed by record.location

  for pattern in patterns:
    patternMatched = false

    for checkout in store.getAllCheckouts():
      if pattern contains '*':
        regex = patternToRegex(pattern)  // escape special chars, * -> .*
        nameMatch = regex.test(checkout.record.name)
        locationMatch = regex.test(checkout.record.location)
      else:
        nameMatch = checkout.record.name.toLowerCase() === pattern.toLowerCase()
        locationMatch = checkout.record.location.toLowerCase() === pattern.toLowerCase()

      if nameMatch or locationMatch:
        matched.set(checkout.record.location, checkout)
        patternMatched = true

    if not patternMatched:
      warn("no checkout matches pattern: " + pattern)

  return Array.from(matched.values())
```

### 4b. Update `resolveCheckoutByName`

Add a note to the existing `resolveCheckoutByName` function:

```md
**Note:** Superseded by `getCheckoutsByPattern` for pattern-based resolution. `resolveCheckoutByName` remains for single-checkout exact resolution by name, slug, or location.
```

### 4c. Update branch command pseudo

Find the branch command pseudo and update the argument handling:

```pseudo
branch <branch> [-c <PATTERN...>]
  checkouts = options.checkouts ?? []
  if checkouts is empty:
    targets = store.getAllCheckouts()
  else:
    targets = store.getCheckoutsByPattern(checkouts)

  for checkout in targets:
    ...
```

## Step 5: Commit

Commit type: `knowledge(architecture):`
Scope: `architecture`
Message: Document --checkouts pattern matching and update command pseudo-code.
