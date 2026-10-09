import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs.js';

import { syncCheckouts } from './syncCheckouts.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('syncCheckouts', () => {
	it('no-op when the store has no checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);

		await syncCheckouts(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});
});
