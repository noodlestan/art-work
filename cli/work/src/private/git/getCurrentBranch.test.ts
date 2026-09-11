import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { getCurrentBranch } from './getCurrentBranch';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getCurrentBranch', () => {
	it('returns the current branch name', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		const git = simpleGit(dir);
		await git.checkoutLocalBranch('feature');

		const branch = await getCurrentBranch(dir);

		expect(branch).toBe('feature');
	});

	it('returns - on error', async () => {
		const dir = makeTempDir(tempDirs);

		const branch = await getCurrentBranch(dir);

		expect(branch).toBe('-');
	});
});
