import type { PublishPending } from '../../operations/types.js';
import type { Checkout } from '../../store/createCheckout.js';

export function createPublishOperation(
	checkout: Checkout | undefined,
	pkg: string,
	version: string,
): PublishPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'publish',
		package: pkg,
		version,
		message() {
			return `publishing ${pkg}@${version}`;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
