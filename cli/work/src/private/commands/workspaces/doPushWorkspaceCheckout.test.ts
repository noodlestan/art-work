import { existsSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeWorkspaceCheckoutMock } from '../../../test/helpers/checkout/makeWorkspaceCheckoutMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { advanceGitRepoByOneCommit } from '../../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { doPushWorkspaceCheckout } from './doPushWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doPushWorkspaceCheckout', () => {
	it('pushes the workspace root when clean and ahead', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceGitRepoByOneCommit(workspaceDir);

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['ahead']) }),
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
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, {
				scan: makeCheckoutScanMock([]),
			}),
		);

		await doPushWorkspaceCheckout(ctx);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('success');
	});

	it('skips when the workspace is dirty', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, {
				scan: makeCheckoutScanMock(['ahead', 'uncommitted']),
			}),
		);

		await doPushWorkspaceCheckout(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});

	it('throws when there is no workspace checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await expect(doPushWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('logs failure and continues when the push fails', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceGitRepoByOneCommit(workspaceDir);

		await simpleGit(workspaceDir).remote([
			'set-url',
			'origin',
			join(workspaceDir, 'missing-origin'),
		]);
		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['ahead']) }),
		);

		await expect(doPushWorkspaceCheckout(ctx)).resolves.toBeNull();

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].outcome).toEqual('failure');
	});
});
