import { existsSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { createCheckoutScanMock } from '../../../test/helpers/checkout/createCheckoutScanMock';
import { makeWorkspaceCheckoutMock } from '../../../test/helpers/checkout/makeWorkspaceCheckoutMock';
import { createMockCommandContext } from '../../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../../test/helpers/git/commitFileTest';
import { initWorkingRepoTest } from '../../../test/helpers/git/initWorkingRepoTest';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { syncWorkspaceCheckout } from './syncWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('syncWorkspaceCheckout', () => {
	it('pulls then pushes the workspace root and re-scans with refetch', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		const git = simpleGit(tempDir);
		await git.push('origin', 'main', ['--set-upstream']);

		// Push an extra commit from a second clone so workspace is behind.
		const advDir = makeTempDir(tempDirs);
		await git.clone(bareDir, advDir);
		const advGit = simpleGit(advDir);
		await advGit.addConfig('user.email', 'test@example.com');
		await advGit.addConfig('user.name', 'Test');
		await commitFileTest(advDir, 'remote-commit.txt');
		await advGit.push('origin', 'main');

		// Also make workspace ahead with a local commit.
		await commitFileTest(tempDir, 'local-commit.txt');

		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: createCheckoutScanMock(['behind']) }),
		);

		await syncWorkspaceCheckout(ctx);

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').behind).toBe(0);
		expect(ctx.workspace?.scan?.state('sync').ahead).toBe(0);
		expect(existsSync(join(tempDir, 'remote-commit.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');
	});

	it('skips pull when workspace cannot pull', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		await commitFileTest(tempDir, 'ahead.txt');

		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: createCheckoutScanMock(['ahead']) }),
		);

		await syncWorkspaceCheckout(ctx);

		const ops = ctx.log.all();
		// Only push operation
		expect(ops.some(o => o.operation === 'push')).toBe(true);
	});

	it('throws when there is no workspace in context', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		await expect(syncWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});
});
