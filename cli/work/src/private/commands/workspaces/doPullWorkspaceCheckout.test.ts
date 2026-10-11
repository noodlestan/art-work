import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { simpleGit } from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock.js';
import { makeWorkspaceCheckoutMock } from '../../../test/helpers/checkout/makeWorkspaceCheckoutMock.js';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock.js';
import { advanceBareRepoByOneCommit } from '../../../test/helpers/git/advanceBareRepoByOneCommit.js';
import { makeGitBareRepo } from '../../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepoFromBare } from '../../../test/helpers/git/makeGitRepoFromBare.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs.js';

import { doPullWorkspaceCheckout } from './doPullWorkspaceCheckout.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doPullWorkspaceCheckout', () => {
	it('WHEN the workspace is clean and behind it pulls the workspace root', async () => {
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

	it('WHEN the workspace is up to date it pulls the workspace root', async () => {
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

	it('WHEN the workspace is dirty it skips the pull', async () => {
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

	it('WHEN there is no workspace checkout it throws', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await expect(doPullWorkspaceCheckout(ctx)).rejects.toThrow('No workspace in context.');
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('WHEN the pull fails it logs failure and continues', async () => {
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
