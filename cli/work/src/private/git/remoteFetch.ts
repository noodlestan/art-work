import simpleGit from 'simple-git';

export async function remoteFetch(dir: string): Promise<void> {
	const git = simpleGit(dir);
	try {
		await git.fetch('origin');
	} catch {
		// Remote unreachable: swallow so the cheap count still reflects last-known state.
	}
}
