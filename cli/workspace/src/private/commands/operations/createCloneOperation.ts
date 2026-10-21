import type { ClonePending } from '../../operations/types.js';
import type { Checkout } from '../../store/createCheckout.js';

export function createCloneOperation(checkout: Checkout | undefined): ClonePending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'clone',
		location: checkout?.record.location ?? 'unknown',
		message() {
			return checkout ? `to ${checkout.record.location}` : 'clone';
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
