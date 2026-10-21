import type { CheckoutStateNoDetached } from '../types.js';

export const createNoDetachedState = (attached: boolean): CheckoutStateNoDetached => ({
	type: 'no-detached',
	attached,
});
