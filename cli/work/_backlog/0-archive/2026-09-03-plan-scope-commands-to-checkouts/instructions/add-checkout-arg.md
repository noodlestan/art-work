# Instructions: Add Checkout Arg

**Plan:** `scope-commands-to-location`

**Iteration Id:** `add-checkout-arg`

## Mandatory Reading

::READ `$PROJECT/_backlog/4-next/plan-scope-commands-to-location/plan.md` (Plan) — Full plan context, scope, and commit blueprints.
::READ `$PROJECT/src/private/store/createCheckoutStore.ts` (Source) — Current store API, needs `getCheckoutsByPattern` and extraction of exact-match helpers.
::READ `$PROJECT/src/commands/pull/runPull.ts` (Source) — Target command to update.
::READ `$PROJECT/src/commands/push/runPush.ts` (Source) — Target command to update.
::READ `$PROJECT/src/commands/sync/runSync.ts` (Source) — Target command to update.
::READ `$PROJECT/src/index.ts` (Source) — Commander wiring for pull, push, sync.

---

## Step 1: Add `--checkouts` option to pull, push, sync

In `$PROJECT/src/index.ts`:

1. For the `pull` command, replace the current `.action(async () => { ... })` with:

   ```ts
   .option('-c, --checkouts <PATTERN...>', 'checkout location patterns')
   .action(async (options: { checkouts?: string[] }) => {
   ```

   Pass `options.checkouts` through to `runPull(ctx, { checkouts: options.checkouts })`.

2. Do the same for `push` and `sync`.

3. Update the function signatures in `runPull.ts`, `runPush.ts`, `runSync.ts`:

   ```ts
   export async function runPull(
     ctx: WorkspaceContext,
     options: { checkouts?: string[] } = {},
   ): Promise<void>;
   ```

   (Same for `runPush` and `runSync`.)

4. At this stage, do NOT change the body of the run functions — they still use `getAllCheckouts()`. The option is wired but unused. This is the first commit.

---

## Step 2: Add `getCheckoutsByPattern` to CheckoutStore

In `$PROJECT/src/private/store/createCheckoutStore.ts`:

### 2a. Extract exact-match helpers to module-level

The current `getCheckoutForLocation` and `getCheckoutByName` are defined inline in the return object. Extract them to module-level functions so `getCheckoutsByPattern` can reuse them:

```ts
function matchCheckoutByName(checkouts: Map<string, Checkout>, name: string): Checkout | undefined {
  const n = name.toLowerCase();
  return Array.from(checkouts.values()).find(checkout => checkout.record.name.toLowerCase() === n);
}

function matchCheckoutByLocation(
  checkouts: Map<string, Checkout>,
  location: string,
): Checkout | undefined {
  return checkouts.get(location);
}
```

Update the return object to call these:

```ts
getCheckoutForLocation(location: string): Checkout | undefined {
	return matchCheckoutByLocation(checkouts, location);
},
getCheckoutByName(name: string): Checkout | undefined {
	return matchCheckoutByName(checkouts, name);
},
```

### 2b. Add `patternToRegex` helper

```ts
function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const globbed = escaped.replace(/\*/g, '.*');
  return new RegExp(globbed, 'i');
}
```

Note: No `^` anchor — the regex matches anywhere in the string. `*` becomes `.*` which matches any characters.

### 2c. Add `isWildcardPattern` helper

```ts
function isWildcardPattern(pattern: string): boolean {
  return pattern.includes('*');
}
```

### 2d. Add `getCheckoutsByPattern` method

Add to the `CheckoutStore` interface:

```ts
getCheckoutsByPattern: (patterns: string[]) => Checkout[];
```

Implement in `createCheckoutStore`:

```ts
getCheckoutsByPattern(patterns: string[]): Checkout[] {
	const matched = new Map<string, Checkout>(); // keyed by record.location for dedup

	for (const pattern of patterns) {
		let patternMatched = false;

		for (const checkout of checkouts.values()) {
			let nameMatch = false;
			let locationMatch = false;

			if (isWildcardPattern(pattern)) {
				// Wildcard mode: regex match against name and location
				const regex = patternToRegex(pattern);
				nameMatch = regex.test(checkout.record.name);
				locationMatch = regex.test(checkout.record.location);
			} else {
				// Exact mode: only exact match, no fallback
				nameMatch = matchCheckoutByName(checkouts, pattern) === checkout;
				locationMatch = matchCheckoutByLocation(checkouts, pattern) === checkout;
			}

			if (nameMatch || locationMatch) {
				matched.set(checkout.record.location, checkout);
				patternMatched = true;
			}
		}

		if (!patternMatched) {
			console.warn(`no checkout matches pattern: "${pattern}"`);
		}
	}

	return Array.from(matched.values());
}
```

**Key safety rule:** When the pattern does NOT contain `*`, only exact matches are attempted. If no exact match is found for that pattern, a warning is printed and the pattern produces zero results. This prevents accidental partial matches (e.g. user types `art-js` expecting that exact checkout, but it's not cloned — we do NOT silently match `art-js-planning`).

### 2e. Add tests for `getCheckoutsByPattern`

In `$PROJECT/src/private/store/createCheckoutStore.test.ts`, add tests:

- Exact name match: `"Foo Bar @ fix-test"` → returns that checkout.
- Exact location match: `"fix-test"` → returns that checkout.
- Exact match fails with warning: `"nonexistent"` → returns `[]`, warns.
- Wildcard name match: `"* @ fix-test"` → matches all checkouts with that suffix.
- Wildcard location match: `"fix-*"` → matches `fix-test`, `fix-prod`, etc.
- Mixed patterns: `["fix-test", "prod*"]` → deduplicated results.
- Case-insensitive: `"FOO BAR @ FIX-TEST"` → matches.
- Multiple checkouts, one pattern matches two: deduplication via `record.location`.

Use the existing test setup pattern (`makeMockConfig`, `createCheckout`, `createCheckoutStore`).

---

## Step 3: Wire `getCheckoutsByPattern` into run functions

In `runPull.ts`, `runPush.ts`, `runSync.ts`:

1. Replace the `getAllCheckouts()` call in the concurrency loop:

   ```ts
   const checkouts =
     options.checkouts && options.checkouts.length > 0
       ? ctx.store.getCheckoutsByPattern(options.checkouts)
       : ctx.store.getAllCheckouts();
   ```

2. Update `createOperationPending` to include the checkouts:

   ```ts
   ctx.log.log(createOperationPending('command', ['pull', options.checkouts]));
   ```

   (Same for push/sync.)

3. If `getCheckoutsByPattern` returns an empty array (all patterns had zero matches), the loop simply does nothing — the reports will be empty, which is correct.

---

## Step 4: Commit

Follow the commit blueprints from the plan. Use `build(workspace-cli-one):` type for all commits.
