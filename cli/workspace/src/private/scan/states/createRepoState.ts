import type { CheckoutStateRepo } from '../types.js';

export const createRepoState = (known: boolean): CheckoutStateRepo => ({ type: 'repo', known });
