import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import { loadCheckoutRecords } from '../resources/checkout/loadCheckoutRecords';
import { loadRepositoryRecords } from '../resources/repository/loadRepositoryRecords';

import { createCheckout } from './createCheckout';
import { hydrateStoreFromRecords } from './hydrateStoreFromRecords';
import { scanAllCheckoutsStates } from './scanAllCheckoutsStates';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('scanAllCheckoutsStates', () => {
	it('no-op on an empty store', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		await scanAllCheckoutsStates(ctx);

		expect(ctx.store.getAllCheckouts()).toHaveLength(0);
	});

	it('scans all checkouts and updates the store for each', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		const checkoutA = createCheckout(ctx.config, 'a', undefined, 'main', 'A');
		const checkoutB = createCheckout(ctx.config, 'b', undefined, 'main', 'B');
		const checkoutC = createCheckout(ctx.config, 'c', undefined, 'main', 'C');

		ctx.store.addCheckout(checkoutA);
		ctx.store.addCheckout(checkoutB);
		ctx.store.addCheckout(checkoutC);

		await scanAllCheckoutsStates(ctx);

		const all = ctx.store.getAllCheckouts();
		expect(all).toHaveLength(3);

		for (const checkout of all) {
			expect(checkout.scan).toBeDefined();
		}
	});

	it('preserves checkout order from getAllCheckouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		const locations = ['alpha', 'bravo', 'charlie', 'delta'];
		for (const loc of locations) {
			ctx.store.addCheckout(createCheckout(ctx.config, loc, undefined, 'main', loc));
		}

		await scanAllCheckoutsStates(ctx);

		const result = ctx.store.getAllCheckouts();
		expect(result.map(c => c.record.location)).toEqual(locations);
	});

	it('with refetch=true detects behind state after remote advances', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		const repoDir = join(tempDir, ctx.config.clone.path, 'refetchtest');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);

		// Advance the remote from a separate clone
		const advDir = makeTempDir(tempDirs);
		await simpleGit(advDir).clone(bareDir, advDir);
		await commitFileTest(advDir, 'remote-advance.txt');
		await simpleGit(advDir).push('origin', 'main');

		writeRepoMockRecord(tempDir, 'RefetchTest', bareDir);
		writeCheckoutMockRecord(tempDir, 'RefetchTest', 'RefetchTest', 'refetchtest');

		// Load records and hydrate store (same as commands do)
		const repos = await loadRepositoryRecords(ctx);
		const records = await loadCheckoutRecords(ctx, repos);
		hydrateStoreFromRecords(ctx.config, ctx.store, records);

		// Scan without refetch — local data is stale, behind = 0
		await scanAllCheckoutsStates(ctx);
		const before = ctx.store.getCheckoutOfRepo('RefetchTest');
		expect(before?.scan?.state('sync').behind).toBe(0);

		// Scan with refetch — should detect the remote advance
		await scanAllCheckoutsStates(ctx, true);
		const after = ctx.store.getCheckoutOfRepo('RefetchTest');
		expect(after?.scan?.state('sync').behind).toBe(1);
	});
});
