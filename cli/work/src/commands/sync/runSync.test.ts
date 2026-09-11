import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runSync } from './runSync';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('sync command', () => {
	it('syncs clean checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'syncme');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir);
		await advanceBareRepoByOneCommit(tempDirs, bareDir);
		await simpleGit(repoDir).fetch('origin', 'main');

		writeRepoMockRecord(workspaceDir, 'SyncMe', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'SyncMe', 'SyncMe', 'syncme');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');

		const checkout = ctx.store.getCheckoutOfRepo('SyncMe');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toBe(true);
		expect(existsSync(join(verifyDir, 'origin.txt'))).toBe(true);
	});

	it('syncs checkouts behind even when the local tracking ref is stale', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'behindsync');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir);

		writeRepoMockRecord(workspaceDir, 'BehindSync', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'BehindSync', 'BehindSync', 'behindsync');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');

		const checkout = ctx.store.getCheckoutOfRepo('BehindSync');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(true);
	});

	it('skips dirty checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'dirtysync');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir);
		await simpleGit(repoDir).fetch('origin', 'main');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'DirtySync', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'DirtySync', 'DirtySync', 'dirtysync');

		await runSync(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('DirtySync');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit behind']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips checkouts not cloned', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(workspaceDir, 'Missing', 'Missing', 'missing');

		await runSync(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('syncs checkouts already up to date', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'current');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'Current', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Current', 'Current', 'current');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);
	});

	it('does not sync the workspace root without the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');
		await advanceGitRepoByOneCommit(workspaceDir);

		await runSync(ctx, { all: true });

		expect(existsSync(join(workspaceDir, 'origin-advance.txt'))).toBe(false);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('syncs the workspace root (pulls when behind and pushes when ahead) with the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');
		await advanceGitRepoByOneCommit(workspaceDir);

		await runSync(ctx, { all: true, workspace: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').delta).toBe(0);
		expect(existsSync(join(workspaceDir, 'origin-advance.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');
	});

	it('skips push when pull fails (bad remote)', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'badremote');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);
		await advanceGitRepoByOneCommit(repoDir, 'file2.txt');

		// Point remote to a non-existent path so push will fail
		await simpleGit(repoDir).remote(['set-url', 'origin', join(workspaceDir, 'missing-origin')]);

		writeRepoMockRecord(workspaceDir, 'BadRemote', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'BadRemote', 'BadRemote', 'badremote');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		// Pull is attempted and fails; push is skipped
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('failure');
	});
});
