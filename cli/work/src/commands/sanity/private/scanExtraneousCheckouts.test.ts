import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../../test/helpers/context/createMockCommandContext';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { scanExtraneousCheckouts } from './scanExtraneousCheckouts';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('scanExtraneousCheckouts', () => {
	it('empty checkouts dir returns no extraneous entries', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		mkdirSync(join(tempDir, ctx.config.clone.path), { recursive: true });
		const store = ctx.store;

		const extraneous = await scanExtraneousCheckouts(ctx, store);

		expect(extraneous).toHaveLength(0);
	});

	it('does not flag known checkouts as extraneous', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutsPath = join(tempDir, ctx.config.clone.path);
		mkdirSync(checkoutsPath, { recursive: true });
		const store = ctx.store;

		// Create a known checkout directory
		const knownLocation = 'known-repo';
		const knownDir = join(checkoutsPath, knownLocation);
		mkdirSync(knownDir, { recursive: true });

		// Add a checkout with that location to the store
		const checkout = {
			record: { name: 'Known Repo', location: knownLocation, branch: 'main', repository: 'known' },
			path: knownDir,
			exists: true,
			scan: undefined,
		};
		store.addCheckout(checkout);

		const extraneous = await scanExtraneousCheckouts(ctx, store);

		expect(extraneous).toHaveLength(0);
	});
});
