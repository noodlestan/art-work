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

import { doPushWorkspaceCheckout } from './doPushWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doPushWorkspaceCheckout', () => {
	it('pushes the workspace root when clean and ahead', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		await commitFileTest(tempDir, 'ahead.txt');

		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: createCheckoutScanMock(['ahead']) }),
		);

		const updated = await doPushWorkspaceCheckout(ctx);

		expect(updated).toBeDefined();
		expect(updated?.scan?.state('sync').ahead).toEqual(0);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toEqual(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('success');
	});

	it('pushes the workspace root when up to date', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		const git = simpleGit(tempDir);
		await git.push('origin', 'main', ['--set-upstream']);

		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, {
				scan: createCheckoutScanMock([]),
			}),
		);

		await doPushWorkspaceCheckout(ctx);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('success');
	});

	it('skips when the workspace is dirty', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, {
				scan: createCheckoutScanMock(['ahead', 'uncommitted']),
			}),
		);

		await doPushWorkspaceCheckout(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});

	it('throws when there is no workspace checkout', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		await expect(doPushWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('logs failure and continues when the push fails', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		await commitFileTest(tempDir, 'ahead.txt');

		await simpleGit(tempDir).remote(['set-url', 'origin', join(tempDir, 'missing-origin')]);
		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: createCheckoutScanMock(['ahead']) }),
		);

		await expect(doPushWorkspaceCheckout(ctx)).resolves.toBeNull();

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('failure');
	});
});
