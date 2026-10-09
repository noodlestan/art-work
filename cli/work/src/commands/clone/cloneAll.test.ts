import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { cloneAll } from './cloneAll.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('cloneAll', () => {
	it('no-op with an empty repos list', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);

		await cloneAll(ctx, []);

		expect(ctx.store.getAllCheckouts()).toHaveLength(0);
	});
});
