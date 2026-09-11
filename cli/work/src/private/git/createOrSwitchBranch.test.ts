import { afterEach, describe, expect, it } from 'vitest';

import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { createOrSwitchBranch } from './createOrSwitchBranch';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('createOrSwitchBranch', () => {
	it('creates a branch in a working repo', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const result = await createOrSwitchBranch(dir, 'feat/x');

		expect(result).toBe('created');
		const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
		expect(branch.trim()).toBe('feat/x');
	});

	it('switches to an existing branch on second call', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await createOrSwitchBranch(dir, 'feat/x');

		const result = await createOrSwitchBranch(dir, 'feat/x');

		expect(result).toBe('switched');
	});
});
