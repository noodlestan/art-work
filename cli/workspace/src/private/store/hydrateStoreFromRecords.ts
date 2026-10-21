import type { WorkspaceConfig } from '../../config/types.js';
import type { RepositoryCheckoutRecord } from '../resources/types.js';

import { createCheckout } from './createCheckout.js';
import type { CheckoutStore } from './createCheckoutStore.js';

export function hydrateStoreFromRecords(
	config: WorkspaceConfig,
	store: CheckoutStore,
	records: RepositoryCheckoutRecord[],
): void {
	for (const record of records) {
		const checkout = createCheckout(
			config,
			record.checkout.location,
			record.repo,
			record.checkout.branch,
			record.checkout.name,
		);
		store.addCheckout({ ...checkout, filename: record.filename });
	}
}
