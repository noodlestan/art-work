import type { CheckoutStateCommitted } from '../types.js';

export const createCommittedState = (clean: boolean): CheckoutStateCommitted => ({
	type: 'committed',
	clean,
});
