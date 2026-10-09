import type { PushPending } from '../../operations/types.js';
import type { Checkout } from '../../store/createCheckout.js';

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
