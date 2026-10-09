import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type { WorkspaceContext } from '../../../private/context/createWorkspaceContext.js';
import { createExtraneousCheckout } from '../../../private/scan/private/createExtraneousCheckout.js';
import { scanCheckoutState } from '../../../private/scan/scanCheckoutState.js';
import type { CheckoutStore } from '../../../private/store/createCheckoutStore.js';
import type { Checkout } from '../../../private/store/types.js';

export async function scanExtraneousCheckouts(
	ctx: WorkspaceContext,
	store: CheckoutStore,
): Promise<Checkout[]> {
	const checkoutsPath = join(ctx.config.root.path, ctx.config.clone.path);
	const result: Checkout[] = [];

	try {
		const entries = await readdir(checkoutsPath, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) {
				continue;
			}
			const dir = join(checkoutsPath, entry.name);
			const location = relative(checkoutsPath, dir);

			// Skip known checkouts already in the store
			const known = store.getCheckoutForLocation(location);
			if (known) {
				continue;
			}

			const checkout = { ...createExtraneousCheckout(ctx.config, location), path: dir };
			const scanned = await scanCheckoutState(ctx, checkout);
			result.push(scanned);
		}
	} catch {
		// checkouts path doesn't exist or can't be read
	}

	return result;
}
