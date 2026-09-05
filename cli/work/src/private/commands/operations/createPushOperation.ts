import type { PushPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createPushOperation(checkout: Checkout, branch: string): PushPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'push',
		branch,
		message() {
			return `to origin/${branch}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
