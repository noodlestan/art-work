import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { hasRemote } from './hasRemote';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('hasRemote', () => {
	it('returns false for repo with no remote', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const remote = await hasRemote(dir);

		expect(remote).toBe(false);
	});
});
