import type { BranchPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createBranchOperation(checkout: Checkout, branch: string): BranchPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'branch',
		branch,
		message() {
			return `branch ${branch}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
