# Instructions: Change Branch Argument

**Plan:** `scope-commands-to-location`

**Iteration Id:** `change-branch-argument`

## Mandatory Reading

::READ `$PROJECT/_backlog/4-next/plan-scope-commands-to-location/plan.md` (Plan) — Full plan context.
::READ `$PROJECT/src/commands/branch/runBranch.ts` (Source) — Current branch implementation with positional `[checkouts...]`.
::READ `$PROJECT/src/commands/branch/runBranch.test.ts` (Source) — Current branch tests.
::READ `$PROJECT/src/index.ts` (Source) — Branch command declaration.

---

## Step 1: Update branch command declaration in `src/index.ts`

Replace the current positional argument:

```ts
.argument('[checkouts...]', 'checkouts to branch (default: all checkouts)')
.action(async (branch: string, checkoutLocations: string[]) => {
```

With the `--checkouts` option:

```ts
.option('-c, --checkouts <PATTERN...>', 'checkout location patterns')
.action(async (branch: string, options: { checkouts?: string[] }) => {
```

Update the call to `runBranch`:

```ts
await runBranch(ctx, { branch, checkouts: options.checkouts });
```

## Step 2: Update `runBranch` signature

In `$PROJECT/src/commands/branch/runBranch.ts`:

Change from:

```ts
export async function runBranch(
	ctx: WorkspaceContext,
	options: { branch: string; checkoutLocations: string[] },
): Promise<void> {
```

To:

```ts
export async function runBranch(
	ctx: WorkspaceContext,
	options: { branch: string; checkouts?: string[] },
): Promise<void> {
```

## Step 3: Replace location resolution with `getCheckoutsByPattern`

In the body of `runBranch`, replace the current resolution logic:

```ts
const { branch, checkouts } = options;
const resolvedCheckouts =
  checkouts && checkouts.length > 0
    ? ctx.store.getCheckoutsByPattern(checkouts)
    : ctx.store.getAllCheckouts();
```

Replace the existing loop that iterates `locations` and calls `getCheckoutForLocation` with a loop over `resolvedCheckouts`:

```ts
for (const checkout of resolvedCheckouts) {
  if (!checkout.scan?.can?.('branch')) {
    ctx.log.log(createBranchFailure(branch, 'checkout not cloned', checkout));
    continue;
  }

  const scanned = await scanCheckoutState(ctx, checkout);
  ctx.store.updateCheckout(scanned);

  await doBranchCheckout(ctx, scanned, branch);
}
```

Remove the `createBranchFailure` call for "not cloned" since `getCheckoutsByPattern` already filters out non-existent checkouts and warns on zero-match patterns.

## Step 4: Update `createOperationPending` call

Update to include checkouts:

```ts
ctx.log.log(createOperationPending('command', ['branch', branch, options.checkouts]));
```

## Step 5: Update tests

In `$PROJECT/src/commands/branch/runBranch.test.ts`:

1. Update all test calls from:

   ```ts
   await runBranch(ctx, { branch: 'feat/x', checkoutLocations: ['one'] });
   ```

   To:

   ```ts
   await runBranch(ctx, { branch: 'feat/x', checkouts: ['one'] });
   ```

2. Add a test for wildcard pattern matching:

   ```ts
   it('branches checkouts matching wildcard pattern', async () => {
     // Setup two checkouts: "alpha" and "beta"
     // Call with checkouts: ['a*']
     // Expect only "alpha" to be branched
   });
   ```

3. Add a test for zero-match warning:
   ```ts
   it('warns and skips when pattern matches no checkouts', async () => {
     // Setup one checkout: "alpha"
     // Call with checkouts: ['nonexistent']
     // Expect warning on console.warn, no branch operations
   });
   ```

## Step 6: Commit

Commit type: `build(workspace-cli-one):`
Scope: `workspace-cli-one`
Message: Change branch command from positional checkouts to --checkouts option.
