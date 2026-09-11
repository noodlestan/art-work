import { existsSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../test/helpers/checkout/makeCheckoutMock';
import { makeCheckoutScanMock } from '../../test/helpers/checkout/makeCheckoutScanMock';
import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import { scanCheckoutState } from '../scan/scanCheckoutState';

import { pullCheckout } from './pullCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('pullCheckout', () => {
	it('pulls a behind checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'behind');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		await advanceBareRepoByOneCommit(tempDirs, bareDir);

		const git = simpleGit(repoDir);
		await git.fetch('origin', 'main');

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'Behind', remote: 'git@example.com:behind.git' },
		});
		const scanned = await scanCheckoutState(ctx, checkout);
		expect(scanned.scan?.state('sync').behind).toBe(1);

		await pullCheckout(scanned);
		const result = await scanCheckoutState(ctx, scanned);

		expect(result.scan?.state('sync').behind).toBe(0);
		expect(result.scan?.issues().some(i => i.includes('behind'))).toBe(false);
		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(true);
	});

	it('throws when the pull fails', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'nopull');
		await makeGitRepo(tempDirs, { commit: true, dir: repoDir });

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'NoPull', remote: 'git@example.com:nopull.git' },
		});
		checkout.scan = makeCheckoutScanMock(['behind']);

		await expect(pullCheckout(checkout)).rejects.toBeTruthy();
	});
});
