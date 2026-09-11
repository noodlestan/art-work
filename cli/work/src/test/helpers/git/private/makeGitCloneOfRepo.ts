import simpleGit, { type SimpleGit } from 'simple-git';

import { makeTempDir } from '../../tempDirs/makeTempDir';

/** Clones a repo and configures the clone. */
export async function makeGitCloneOfRepo(
	tempDirs: string[],
	sourceDir: string,
): Promise<{ git: SimpleGit; dir: string }> {
	const dir = makeTempDir(tempDirs);
	await simpleGit(dir).clone(sourceDir, dir);
	const git = simpleGit(dir);
	await git.addConfig('user.email', 'test@example.com');
	await git.addConfig('user.name', 'Test');
	return { git, dir };
}
