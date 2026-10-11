import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { isDirty } from './isDirty.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('isDirty', () => {
	it('FOR a clean repo it returns false', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });

		const dirty = await isDirty(dir);

		expect(dirty).toBe(false);
	});

	it('FOR a dirty repo it returns true', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		writeFileSync(join(dir, 'new.txt'), 'new');

		const dirty = await isDirty(dir);

		expect(dirty).toBe(true);
	});
});
