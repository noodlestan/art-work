import { afterEach, describe, expect, it } from 'vitest';

import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit.js';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { getRemoteBranch } from './getRemoteBranch.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getRemoteBranch', () => {
	it('returns null when the branch has no remote counterpart', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const remote = await getRemoteBranch(dir);

		expect(remote).toBeNull();
	});

	it('returns the remote branch name when it exists on origin', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await git.addRemote('origin', bareDir);
		await git.push('origin', 'main', ['--set-upstream']);

		const remote = await getRemoteBranch(dir);

		expect(remote).toBe('origin/main');
	});
});
