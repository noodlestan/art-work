import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runPush } from './runPush';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('push command', () => {
	it('prints the usage message and runs nothing when neither -c nor --all is provided', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Art', '');
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');

		await runPush(ctx, {});

		const ops = ctx.log.all().filter(op => op.operation === 'command');
		expect(ops).toHaveLength(1);
		expect((ops[0].data as string[])[0]).toBe('push');
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toBe('No targets.');
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage: Use '));
	});

	it('pushes clean checkouts that are ahead', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'ahead');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		const filename = await advanceGitRepoByOneCommit(repoDir);

		writeRepoMockRecord(workspaceDir, 'Ahead', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Ahead', 'Ahead', 'ahead');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Ahead');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('push');
		expect(ops[0].outcome).toBe('success');
		expect(ops[0].message()).toBe('to origin/main');

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, filename))).toBe(true);
	});

	it('pushes without pulling first (pre-push pull removed)', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'aheadonly');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		const filename = await advanceGitRepoByOneCommit(repoDir);

		writeRepoMockRecord(workspaceDir, 'AheadOnly', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'AheadOnly', 'AheadOnly', 'aheadonly');

		await runPush(ctx, { all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('push');
		expect(ops[0].outcome).toBe('success');

		const checkout = ctx.store.getCheckoutOfRepo('AheadOnly');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, filename))).toBe(true);
	});

	it('skips dirty checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'dirtypush');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir);
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'DirtyPush', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'DirtyPush', 'DirtyPush', 'dirtypush');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('DirtyPush');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit ahead']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pushes checkouts already up to date', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'current');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'Current', 'git@example.com:current.git');
		writeCheckoutMockRecord(workspaceDir, 'Current', 'Current', 'current');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('push');
		expect(ops[0].outcome).toBe('success');
	});

	it('skips checkouts not cloned', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(workspaceDir, 'Missing', 'Missing', 'missing');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('does not push the workspace root without the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		const filename = await advanceGitRepoByOneCommit(workspaceDir);

		await runPush(ctx, { all: true });

		expect(ctx.log.all()).toHaveLength(0);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, filename))).toBe(false);
	});

	it('pushes the workspace root when it is ahead and clean with the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		const filename = await advanceGitRepoByOneCommit(workspaceDir);

		await runPush(ctx, { all: true, workspace: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.log.all()).toHaveLength(1);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, filename))).toBe(true);
	});
});
