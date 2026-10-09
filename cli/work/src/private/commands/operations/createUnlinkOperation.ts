import type { UnlinkPending } from '../../operations/types.js';
import type { Checkout } from '../../store/createCheckout.js';

export function createUnlinkOperation(
	checkout: Checkout | undefined,
	pkg: string,
	source: string,
): UnlinkPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'unlink',
		package: pkg,
		source,
		message() {
			return `unlinking ${pkg}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
