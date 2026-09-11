import simpleGit from 'simple-git';

export async function cloneCheckout(
	remoteUrl: string,
	dir: string,
	branch?: string,
): Promise<void> {
	const git = simpleGit('');
	await git.clone(remoteUrl, dir);

	if (branch) {
		try {
			const repoGit = simpleGit(dir);
			await repoGit.checkout(branch);
		} catch {
			// recorded branch not on remote — stay on default branch
		}
	}
}
