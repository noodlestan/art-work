import { simpleGit } from 'simple-git';

import { commitGitRepoFile } from './private/commitGitRepoFile';

/** Writes a file in the repo and commits it. */
export async function advanceGitRepoByOneCommit(
	repoDir: string,
	filename: string = 'ahead.txt',
): Promise<string> {
	const git = simpleGit(repoDir);
	await commitGitRepoFile(repoDir, git, filename);

	return filename;
}
