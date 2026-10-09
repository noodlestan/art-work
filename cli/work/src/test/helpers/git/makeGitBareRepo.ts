import { mkdirSync } from 'node:fs';

import { type SimpleGit, simpleGit } from 'simple-git';

import { makeTempDir } from '../tempDirs/makeTempDir.js';

/** Creates a bare git repo. */
export async function makeGitBareRepo(
	tempDirs: string[],
): Promise<{ git: SimpleGit; dir: string }> {
	const dir = makeTempDir(tempDirs);
	mkdirSync(dir, { recursive: true });
	const git = simpleGit(dir);
	await git.init(true);
	return { git, dir };
}
