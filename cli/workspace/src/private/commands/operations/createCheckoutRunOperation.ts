import type { CheckoutRunPending } from '../../operations/types.js';
import type { Checkout } from '../../store/createCheckout.js';

export function createCheckoutRunOperation(
	checkout: Checkout,
	command: string,
): CheckoutRunPending {
	return {
		ts: new Date(),
		checkout,
		outcome: 'pending',
		operation: 'run',
		command,
		message() {
			return command;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
