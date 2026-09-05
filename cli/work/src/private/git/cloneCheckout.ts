import simpleGit from 'simple-git';

import type { Checkout } from '../store/types';

export async function cloneCheckout(checkout: Checkout): Promise<void> {
	const recordedBranch = checkout.record.branch;
	const git = simpleGit('');
	if (!checkout.repo?.remote) {
		throw new Error(``);
	}
	await git.clone(checkout.repo.remote, checkout.path);

	if (recordedBranch) {
		try {
			const repoGit = simpleGit(checkout.path);
			await repoGit.checkout(recordedBranch);
		} catch {
			// recorded branch not on remote — stay on default branch
		}
	}
}
