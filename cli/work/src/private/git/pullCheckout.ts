import simpleGit from 'simple-git';

import type { Checkout } from '../store/types';

export async function pullCheckout(checkout: Checkout): Promise<void> {
	const git = simpleGit(checkout.path);
	await git.pull('origin', checkout.record.branch);
}
