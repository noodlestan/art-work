import type { CheckoutStateExists } from '../types.js';

export const createExistsState = (exists: boolean): CheckoutStateExists => ({
	type: 'exists',
	exists,
});
