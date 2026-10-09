import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { cloneStatus } from './cloneStatus.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('cloneStatus', () => {
	it('runs without error on an empty store', async () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);

		await cloneStatus(ctx);

		expect(spy).toHaveBeenCalled();
	});
});
