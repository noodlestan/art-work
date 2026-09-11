import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeWorkspaceCheckoutMock } from '../../../test/helpers/checkout/makeWorkspaceCheckoutMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../../test/helpers/git/advanceBareRepoByOneCommit';
import { advanceGitRepoByOneCommit } from '../../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { syncWorkspaceCheckout } from './syncWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('syncWorkspaceCheckout', () => {
	it('pulls then pushes the workspace root and re-scans with refetch', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });

		// Push an extra commit from a second clone so workspace is behind.
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'remote-commit.txt');

		// Also make workspace ahead with a local commit.
		await advanceGitRepoByOneCommit(workspaceDir, 'local-commit.txt');

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['behind']) }),
		);

		await syncWorkspaceCheckout(ctx);

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').behind).toBe(0);
		expect(ctx.workspace?.scan?.state('sync').ahead).toBe(0);
		expect(existsSync(join(workspaceDir, 'remote-commit.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');
	});

	it('skips pull when workspace cannot pull', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceGitRepoByOneCommit(workspaceDir, 'ahead.txt');

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['ahead']) }),
		);

		await syncWorkspaceCheckout(ctx);

		const ops = ctx.log.all();
		// Only push operation
		expect(ops.some(o => o.operation === 'push')).toBe(true);
	});

	it('throws when there is no workspace in context', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await expect(syncWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});
});
