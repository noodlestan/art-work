import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';
import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { initWorkingRepoTest } from '../../../test/helpers/git/initWorkingRepoTest';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';
import { scanCheckoutState } from '../../scan/scanCheckoutState';

import { doPullCheckout } from './doPullCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doPullCheckout', () => {
	it('pulls a behind checkout and returns the updated state', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'behind');
		await initWorkingRepoTest(repoDir, bareDir);

		// Create an advance in another clone
		const otherDir = makeTempDir(tempDirs);
		await simpleGit(otherDir).clone(bareDir, otherDir);
		const otherGit = simpleGit(otherDir);
		await otherGit.addConfig('user.email', 'test@example.com');
		await otherGit.addConfig('user.name', 'Test');
		writeFileSync(join(otherDir, 'origin.txt'), 'origin');
		await otherGit.add('.');
		await otherGit.commit('origin change');
		await otherGit.push('origin', 'main');

		const git = simpleGit(repoDir);
		await git.fetch('origin', 'main');

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'Behind', remote: 'git@example.com:behind.git' },
		});
		const scanned = await scanCheckoutState(ctx, checkout);
		expect(scanned.scan?.state('sync').behind).toBe(1);

		const result = await doPullCheckout(ctx, scanned);

		expect(result).not.toBeNull();
		expect(result?.scan?.state('sync').behind).toBe(0);
		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(true);
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('success');
	});

	it('logs failure and returns null when the pull fails', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'nopull');
		await initWorkingRepoTest(repoDir, bareDir);

		// Point remote to a non-existent path so pull fails
		const git = simpleGit(repoDir);
		await git.remote(['set-url', 'origin', join(tempDir, 'missing-origin')]);

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'NoPull', remote: 'git@example.com:nopull.git' },
		});
		checkout.scan = makeCheckoutScanMock(['behind']);

		const result = await doPullCheckout(ctx, checkout);

		expect(result).toBeNull();
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('failure');
	});

	it('emits a pending pull before the pull side effect', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'pending-pull');
		await initWorkingRepoTest(repoDir, bareDir);

		// Point remote to a non-existent path so pull fails
		const git = simpleGit(repoDir);
		await git.remote(['set-url', 'origin', join(tempDir, 'missing-origin')]);

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'PendingPull', remote: 'git@example.com:pending-pull.git' },
		});
		checkout.scan = makeCheckoutScanMock(['behind']);

		let pendingEmitted = false;
		const spy = vi.fn(() => {
			pendingEmitted = true;
		});

		const originalLog = ctx.log;
		const pendingLog = {
			...originalLog,
			log(op: unknown) {
				if ((op as { outcome?: string }).outcome === 'pending') spy();
				originalLog.log(op as never);
			},
		};
		(ctx as unknown as { log: typeof pendingLog }).log = pendingLog;

		const result = await doPullCheckout(ctx, checkout);

		expect(result).toBeNull();
		expect(pendingEmitted).toBe(true);
	});
});
