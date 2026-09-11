import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { syncCheckouts } from './syncCheckouts';

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
