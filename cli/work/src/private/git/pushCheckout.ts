import simpleGit from 'simple-git';

export async function pushCheckout(dir: string, branch: string): Promise<void> {
	const git = simpleGit(dir);
	await git.push('origin', branch);
}
