import { existsSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import {
	CheckoutScan,
	createCheckoutScan,
	createCommittedState,
	createExistsState,
	createNoConflictsState,
	createNoDetachedState,
	createRemoteState,
	createRepoState,
	createSyncState,
} from '../../../private/scan/types';
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

function makeAheadScan(): CheckoutScan {
	return createCheckoutScan([
		createRepoState(false),
		createExistsState(true),
		createRemoteState('main', 'main', true),
		createSyncState(1, 1, 0),
		createCommittedState(true),
		createNoConflictsState(true),
		createNoDetachedState(true),
	]);
}

describe('doPushWorkspaceCheckout', () => {
	it('pushes the workspace root when clean and ahead', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		await initWorkingRepoTest(tempDir, bareDir);
		await commitFileTest(tempDir, 'ahead.txt');

		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: makeAheadScan() }),
		);

		await doPushWorkspaceCheckout(ctx);

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').ahead).toEqual(0);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toEqual(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('success');
	});

	it('skips when the workspace is up to date', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, { scan: makeAheadScan() }),
		);
		ctx.workspace = makeWorkspaceCheckoutMock(tempDir, {
			scan: createCheckoutScan([
				createRepoState(false),
				createExistsState(true),
				createRemoteState('main', 'main', true),
				createSyncState(0, 0, 0),
				createCommittedState(true),
				createNoConflictsState(true),
				createNoDetachedState(true),
			]),
		});

		await doPushWorkspaceCheckout(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips when the workspace is dirty', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(
			tempDir,
			makeWorkspaceCheckoutMock(tempDir, {
				scan: createCheckoutScan([
					createRepoState(false),
					createExistsState(true),
					createRemoteState('main', 'main', true),
					createSyncState(1, 1, 0),
					createCommittedState(false),
					createNoConflictsState(true),
					createNoDetachedState(true),
				]),
			}),
		);

		await doPushWorkspaceCheckout(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips when there is no workspace checkout', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		await expect(doPushWorkspaceCheckout(ctx)).resolves.toBeNull();
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
			makeWorkspaceCheckoutMock(tempDir, { scan: makeAheadScan() }),
		);

		await expect(doPushWorkspaceCheckout(ctx)).resolves.toBeNull();

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('failure');
	});
});
