import { commitGitRepoFile } from './private/commitGitRepoFile';
import { makeGitCloneOfRepo } from './private/makeGitCloneOfRepo';

/**
 * Advances a bare repo by one commit. The only way to push to a bare repo is
 * from a clone, so this clones the bare, commits a file, and pushes.
 */
export async function advanceBareRepoByOneCommit(
	tempDirs: string[],
	bareDir: string,
	filename = 'origin.txt',
): Promise<string> {
	const { git, dir } = await makeGitCloneOfRepo(tempDirs, bareDir);
	await commitGitRepoFile(dir, git, filename);
	await git.push('origin', 'main');
	return filename;
}
