import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit, { type SimpleGit } from 'simple-git';

import { makeTempDir } from '../tempDirs/makeTempDir';

export interface MakeGitRepoOptions {
	/** Make an initial commit. */
	commit?: boolean;
	/** Place the repo at a specific path instead of a tempDir-managed one. */
	dir?: string;
}

/** Creates a plain git repo (init + config). */
export async function makeGitRepo(
	tempDirs: string[],
	opts?: MakeGitRepoOptions,
): Promise<{ git: SimpleGit; dir: string }> {
	const dir = opts?.dir ?? makeTempDir(tempDirs);
	mkdirSync(dir, { recursive: true });
	const git = simpleGit(dir);
	await git.init();
	await git.addConfig('user.email', 'test@example.com');
	await git.addConfig('user.name', 'Test');
	if (opts?.commit) {
		writeFileSync(join(dir, 'README.md'), '# Test');
		await git.add('.');
		await git.commit('initial');
	}
	return { git, dir };
}
