import { join } from 'node:path';

import { simpleGit } from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { getCurrentBranch } from './getCurrentBranch.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getCurrentBranch', () => {
	it('WHEN HEAD is on a branch it returns the current branch name', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		const git = simpleGit(dir);
		await git.checkoutLocalBranch('feature');

		const branch = await getCurrentBranch(dir);

		expect(branch).toBe('feature');
	});

	it('WHEN the repository has no commits it returns the unborn branch name', async () => {
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await simpleGit(bareDir).raw(['symbolic-ref', 'HEAD', 'refs/heads/main']);

		const cloneDir = join(makeTempDir(tempDirs), 'clone');
		await simpleGit('').clone(bareDir, cloneDir);

		const branch = await getCurrentBranch(cloneDir);

		expect(branch).toBe('main');
	});

	it('WHEN the lookup fails it returns a dash', async () => {
		const dir = makeTempDir(tempDirs);

		const branch = await getCurrentBranch(dir);

		expect(branch).toBe('-');
	});
});
