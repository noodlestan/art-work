import type { PullPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createPullOperation(checkout: Checkout, branch: string): PullPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'pull',
		branch,
		message() {
			return `from origin/${branch}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
