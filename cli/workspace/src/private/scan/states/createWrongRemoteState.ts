import type { CheckoutStateWrongRemote } from '../types.js';

export const createWrongRemoteState = (wrong: boolean): CheckoutStateWrongRemote => ({
	type: 'wrong-remote',
	wrong,
});
