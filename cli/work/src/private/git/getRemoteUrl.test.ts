import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { getRemoteUrl } from './getRemoteUrl.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getRemoteUrl', () => {
	it('WHEN the repo has origin it returns the remote URL', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir });

		const url = await getRemoteUrl(dir);

		expect(url).toBe(bareDir);
	});

	it('WHEN the repo has no remote it returns null', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const url = await getRemoteUrl(dir);

		expect(url).toBeNull();
	});

	it('WHEN the directory is not a git repo it returns null', async () => {
		const dir = makeTempDir(tempDirs);

		const url = await getRemoteUrl(dir);

		expect(url).toBeNull();
	});
});
