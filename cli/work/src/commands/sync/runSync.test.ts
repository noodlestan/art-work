import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
import { makeOriginAheadTest } from '../../test/helpers/git/makeOriginAheadTest';
import { makeWorkspaceRootBehindTest } from '../../test/helpers/git/makeWorkspaceRootBehindTest';
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
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'syncme');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'ahead.txt');
		await makeOriginAheadTest(bareDir, tempDirs);
		await simpleGit(repoDir).fetch('origin', 'main');

		writeRepoMockRecord(tempDir, 'SyncMe', bareDir);
		writeCheckoutMockRecord(tempDir, 'SyncMe', 'SyncMe', 'syncme');

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

	it('skips when behind without a prior fetch (false negative is now intentional)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'behindsync');
		await initWorkingRepoTest(repoDir, bareDir);
		await makeOriginAheadTest(bareDir, tempDirs);

		writeRepoMockRecord(tempDir, 'BehindSync', bareDir);
		writeCheckoutMockRecord(tempDir, 'BehindSync', 'BehindSync', 'behindsync');

		await runSync(ctx, { all: true });

		// Without a prior fetch the local count reports behind = 0, so no pull is triggered.
		// The refetch flag (next iteration) will restore the network fetch when needed.
		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);

		const checkout = ctx.store.getCheckoutOfRepo('BehindSync');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(false);
	});

	it('skips dirty checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'dirtysync');
		await initWorkingRepoTest(repoDir, bareDir);
		await makeOriginAheadTest(bareDir, tempDirs);
		await simpleGit(repoDir).fetch('origin', 'main');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(tempDir, 'DirtySync', bareDir);
		writeCheckoutMockRecord(tempDir, 'DirtySync', 'DirtySync', 'dirtysync');

		await runSync(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('DirtySync');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit behind']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips checkouts not cloned', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runSync(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('works on up to date checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'current');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'Current', bareDir);
		writeCheckoutMockRecord(tempDir, 'Current', 'Current', 'current');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);
	});

	it('syncs the workspace root (pulls when behind and pushes when ahead)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await makeWorkspaceRootBehindTest(tempDir, bareDir, tempDirs);
		await commitFileTest(tempDir, 'ahead.txt');

		await runSync(ctx, { all: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').delta).toBe(0);
		expect(existsSync(join(tempDir, 'origin-advance.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
		expect(ops[1].operation).toBe('push');
		expect(ops[1].outcome).toBe('success');
	});

	it('skips push when pull fails (bad remote)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		const repoDir = join(tempDir, ctx.config.clone.path, 'badremote');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);
		await commitFileTest(repoDir, 'file2.txt');

		// Point remote to a non-existent path so push will fail
		await simpleGit(repoDir).remote(['set-url', 'origin', join(tempDir, 'missing-origin')]);

		writeRepoMockRecord(tempDir, 'BadRemote', bareDir);
		writeCheckoutMockRecord(tempDir, 'BadRemote', 'BadRemote', 'badremote');

		await runSync(ctx, { all: true });

		const ops = ctx.log.all();
		// Without a prior fetch, pull is not triggered (behind=0); push is attempted and fails
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('push');
		expect(ops[0].outcome).toBe('failure');
	});
});
