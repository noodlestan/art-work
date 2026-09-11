import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { remoteFetch } from './remoteFetch';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('remoteFetch', () => {
	it('fetches from origin without throwing', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir });

		await expect(remoteFetch(dir)).resolves.toBeUndefined();
	});

	it('swallows error when remote is unreachable', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { commit: true, dir });

		await expect(remoteFetch(dir)).resolves.toBeUndefined();
	});
});
