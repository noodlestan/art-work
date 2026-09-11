import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { getRemoteUrl } from './getRemoteUrl';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getRemoteUrl', () => {
	it('returns the remote URL for a repo with origin', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir });

		const url = await getRemoteUrl(dir);

		expect(url).toBe(bareDir);
	});

	it('returns null for a repo with no remote', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const url = await getRemoteUrl(dir);

		expect(url).toBeNull();
	});

	it('returns null for a non-git directory', async () => {
		const dir = makeTempDir(tempDirs);

		const url = await getRemoteUrl(dir);

		expect(url).toBeNull();
	});
});
