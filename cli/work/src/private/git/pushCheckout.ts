import simpleGit from 'simple-git';

import type { Checkout } from '../store/types';

export async function pushCheckout(checkout: Checkout): Promise<void> {
	const git = simpleGit(checkout.path);
	await git.push('origin', checkout.record.branch);
}
