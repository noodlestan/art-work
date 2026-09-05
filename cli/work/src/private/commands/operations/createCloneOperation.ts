import type { ClonePending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

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
