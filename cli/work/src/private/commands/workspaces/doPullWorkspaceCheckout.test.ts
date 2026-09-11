import { existsSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeWorkspaceCheckoutMock } from '../../../test/helpers/checkout/makeWorkspaceCheckoutMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../../test/helpers/git/advanceBareRepoByOneCommit';
import { makeGitBareRepo } from '../../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { doPullWorkspaceCheckout } from './doPullWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doPullWorkspaceCheckout', () => {
	it('pulls the workspace root when clean and behind', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['behind']) }),
		);

		const updated = await doPullWorkspaceCheckout(ctx);

		expect(updated).toBeDefined();
		expect(updated?.scan?.state('sync').behind).toEqual(0);
		expect(updated?.scan?.issues()).not.toContain('1 commit behind');
		expect(existsSync(join(workspaceDir, 'origin-advance.txt'))).toEqual(true);
		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('pull');
		expect(ops[0].outcome).toEqual('success');
	});

	it('pulls the workspace root when up to date', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });

		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, {
				scan: makeCheckoutScanMock([]),
			}),
		);

		await doPullWorkspaceCheckout(ctx);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('pull');
		expect(ops[0].outcome).toEqual('success');
	});

	it('skips when the workspace is dirty', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, {
				scan: makeCheckoutScanMock(['behind', 'uncommitted']),
			}),
		);

		await doPullWorkspaceCheckout(ctx);

		expect(ctx.log.all()).toHaveLength(0);
	});

	it('throws when there is no workspace checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await expect(doPullWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('logs failure and continues when the pull fails', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');

		await simpleGit(workspaceDir).remote([
			'set-url',
			'origin',
			join(workspaceDir, 'missing-origin'),
		]);
		const ctx = makeCommandContextMock(
			workspaceDir,
			makeWorkspaceCheckoutMock(workspaceDir, { scan: makeCheckoutScanMock(['behind']) }),
		);

		await expect(doPullWorkspaceCheckout(ctx)).resolves.toBeNull();

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toEqual('pull');
		expect(ops[0].outcome).toEqual('failure');
	});
});
