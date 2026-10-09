import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { hasMergeConflicts } from './hasMergeConflicts.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('hasMergeConflicts', () => {
	it('returns false for clean repo', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const conflicts = await hasMergeConflicts(dir);

		expect(conflicts).toBe(false);
	});
});
