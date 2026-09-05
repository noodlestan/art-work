import type { UnlinkPending } from '../../operations/types';
import type { Checkout } from '../../store/createCheckout';

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
