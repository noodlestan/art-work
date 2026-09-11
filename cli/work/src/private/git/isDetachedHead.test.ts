import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { isDetachedHead } from './isDetachedHead';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('isDetachedHead', () => {
	it('returns false on a normal branch', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const detached = await isDetachedHead(dir);

		expect(detached).toBe(false);
	});

	it('returns false on error', async () => {
		const dir = makeTempDir(tempDirs);

		const detached = await isDetachedHead(dir);

		expect(detached).toBe(false);
	});
});
