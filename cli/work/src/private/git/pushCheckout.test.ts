import { afterEach, describe, expect, it } from 'vitest';

import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit.js';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { pushCheckout } from './pushCheckout.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('pushCheckout', () => {
	it('pushes a local commit to origin', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir });
		await advanceGitRepoByOneCommit(dir, 'ahead.txt');

		await pushCheckout(dir, 'main');
	});

	it('throws when push fails', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { commit: true, dir });

		await expect(pushCheckout(dir, 'main')).rejects.toBeTruthy();
	});
});
