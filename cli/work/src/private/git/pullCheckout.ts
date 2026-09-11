import simpleGit from 'simple-git';

export async function pullCheckout(dir: string, branch: string): Promise<void> {
	const git = simpleGit(dir);
	await git.pull('origin', branch);
}
