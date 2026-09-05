import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runPush } from './runPush';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('push command', () => {
	it('pushes clean checkouts that are ahead', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'ahead');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'ahead.txt');

		writeRepoMockRecord(tempDir, 'Ahead', bareDir);
		writeCheckoutMockRecord(tempDir, 'Ahead', 'Ahead', 'ahead');

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
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toBe(true);
	});

	it('pushes without pulling first (pre-push pull removed)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'aheadonly');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'ahead.txt');

		writeRepoMockRecord(tempDir, 'AheadOnly', bareDir);
		writeCheckoutMockRecord(tempDir, 'AheadOnly', 'AheadOnly', 'aheadonly');

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
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toBe(true);
	});

	it('skips dirty checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'dirtypush');
		await initWorkingRepoTest(repoDir, bareDir);
		await commitFileTest(repoDir, 'ahead.txt');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(tempDir, 'DirtyPush', bareDir);
		writeCheckoutMockRecord(tempDir, 'DirtyPush', 'DirtyPush', 'dirtypush');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('DirtyPush');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit ahead']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips checkouts already up to date', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'current');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'Current', 'git@example.com:current.git');
		writeCheckoutMockRecord(tempDir, 'Current', 'Current', 'current');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips checkouts not cloned', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runPush(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pushes the workspace root when it is ahead and clean', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initWorkingRepoTest(tempDir, bareDir);
		await commitFileTest(tempDir, 'ahead.txt');

		await runPush(ctx, { all: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').ahead).toBe(0);
		expect(ctx.log.all()).toHaveLength(1);

		const verifyDir = makeTempDir(tempDirs);
		await simpleGit(verifyDir).clone(bareDir, verifyDir);
		expect(existsSync(join(verifyDir, 'ahead.txt'))).toBe(true);
	});
});
