import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await scanAllCheckoutsStates(ctx);

		expect(ctx.store.getAllCheckouts()).toHaveLength(0);
	});

	it('scans all checkouts and updates the store for each', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		const locations = ['alpha', 'bravo', 'charlie', 'delta'];
		for (const loc of locations) {
			ctx.store.addCheckout(createCheckout(ctx.config, loc, undefined, 'main', loc));
		}

		await scanAllCheckoutsStates(ctx);

		const result = ctx.store.getAllCheckouts();
		expect(result.map(c => c.record.location)).toEqual(locations);
	});

	it('with refetch=true detects behind state after remote advances', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'refetchtest');
		const { git } = await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		// Advance the remote from a separate clone
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'remote-advance.txt');

		writeRepoMockRecord(workspaceDir, 'RefetchTest', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'RefetchTest', 'RefetchTest', 'refetchtest');

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
