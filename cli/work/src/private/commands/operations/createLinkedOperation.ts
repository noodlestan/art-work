import type { LinkedPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

export function createLinkedOperation(
	checkout: Checkout | undefined,
	pkg: string,
	target: string,
): LinkedPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'linked',
		package: pkg,
		target,
		message() {
			return `linking ${pkg}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
