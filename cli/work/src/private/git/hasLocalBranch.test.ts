import { afterEach, describe, expect, it } from 'vitest';

import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { hasLocalBranch } from './hasLocalBranch';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('hasLocalBranch', () => {
	it('returns true when the branch exists locally', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await git.checkoutLocalBranch('feature');

		const exists = await hasLocalBranch(dir, 'feature');

		expect(exists).toBe(true);
	});

	it('returns false when the branch does not exist locally', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const exists = await hasLocalBranch(dir, 'nonexistent');

		expect(exists).toBe(false);
	});
});
