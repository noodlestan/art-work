import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { isDetachedHead } from './isDetachedHead.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('isDetachedHead', () => {
	it('WHEN head is on a normal branch it returns false', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const detached = await isDetachedHead(dir);

		expect(detached).toBe(false);
	});

	it('WHEN git errors it returns false', async () => {
		const dir = makeTempDir(tempDirs);

		const detached = await isDetachedHead(dir);

		expect(detached).toBe(false);
	});
});
