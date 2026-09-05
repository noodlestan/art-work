# Instructions: Improve Command Declaration

**Plan:** `scope-commands-to-location`

**Iteration Id:** `improve-command-declaration`

## Mandatory Reading

::READ `$PROJECT/_backlog/4-next/plan-scope-commands-to-location/plan.md` (Plan) — Full plan context.
::READ `$PROJECT/src/index.ts` (Source) — All command declarations.

---

## Step 1: Audit all command declarations

Review every command in `$PROJECT/src/index.ts` and identify:

- Options that lack a shorthand flag (e.g. `--auto` without `-a`).
- Options that lack a verbose form (positional-only arguments that should also have `--name`).
- Variadic options that don't use `<NAME...>` syntax consistently.

## Step 2: Add shorthand flags

For each command, assign shorthand flags avoiding letter clashes within the same command. Use the first available letter. Example assignments:

| Command   | Option        | Shorthand       |
| --------- | ------------- | --------------- |
| `sanity`  | `--auto`      | `-a`            |
| `sanity`  | `--refetch`   | `-r`            |
| `clone`   | `--all`       | `-a`            |
| `branch`  | `--checkouts` | `-c`            |
| `pull`    | `--checkouts` | `-c`            |
| `push`    | `--checkouts` | `-c`            |
| `sync`    | `--checkouts` | `-c`            |
| `repo`    | `--checkouts` | `-c` (if added) |
| `publish` | `--auto`      | `-a`            |
| `publish` | `--checkouts` | `-c` (if added) |

Note: Shorthand letters only need to be unique **within a single command**, not across commands.

## Step 3: Apply changes

For each option found in Step 1:

1. Update the `.option()` declaration to include the shorthand:

   ```ts
   .option('-a, --auto', 'auto-publish')
   ```

2. Ensure variadic options use `<NAME...>` syntax:

   ```ts
   .option('-c, --checkouts <PATTERN...>', 'checkout location patterns')
   ```

3. No behavioural changes — this is declaration-only. The handler code already receives the options correctly.

## Step 4: Verify

Run `npm run workspace -- --help` for each command to confirm the shorthand flags appear in the help output.

## Step 5: Commit

Commit type: `build(workspace-cli-one):`
Scope: `workspace-cli-one`
Message: Standardise command argument declarations with shorthand flags.
