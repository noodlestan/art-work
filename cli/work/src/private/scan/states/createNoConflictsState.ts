import type { CheckoutStateNoConflicts } from '../types.js';

export const createNoConflictsState = (clear: boolean): CheckoutStateNoConflicts => ({
	type: 'no-conflicts',
	clear,
});
