import type { CheckoutRecord, RepositoryRecord } from '../resources/types.js';
import type { CheckoutScan } from '../scan/types.js';

export interface Checkout {
	repo?: RepositoryRecord;
	record: CheckoutRecord;
	filename?: string;
	path: string;
	scan?: CheckoutScan;
}
