import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit, { type SimpleGit } from 'simple-git';

import { makeTempDir } from '../tempDirs/makeTempDir';

export interface MakeGitRepoFromBareOptions {
	/** Place the repo at a specific path instead of a tempDir-managed one. */
	dir?: string;
}

/**
 * Creates a working repo connected to a bare repo as `origin`, with an
 * initial commit pushed to `main`.
 */
export async function makeGitRepoFromBare(
	tempDirs: string[],
	bareDir: string,
	opts?: MakeGitRepoFromBareOptions,
): Promise<{ git: SimpleGit; dir: string }> {
	const dir = opts?.dir ?? makeTempDir(tempDirs);
	mkdirSync(dir, { recursive: true });
	const git = simpleGit(dir);
	await git.init();
	await git.addConfig('user.email', 'test@example.com');
	await git.addConfig('user.name', 'Test');
	await git.addRemote('origin', bareDir);
	writeFileSync(join(dir, 'README.md'), '# Test');
	await git.add('.');
	await git.commit('initial');
	await git.push('origin', 'main', ['--set-upstream']);
	return { git, dir };
}
