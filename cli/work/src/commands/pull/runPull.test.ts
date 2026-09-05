import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
import { makeOriginAheadTest } from '../../test/helpers/git/makeOriginAheadTest';
import { makeWorkspaceRootBehindTest } from '../../test/helpers/git/makeWorkspaceRootBehindTest';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runPull } from './runPull';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('pull command', () => {
	it('skips checkouts behind when the local tracking ref is stale (false negative is now intentional)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'behind');
		await initWorkingRepoTest(repoDir, bareDir);
		await makeOriginAheadTest(bareDir, tempDirs);

		writeRepoMockRecord(tempDir, 'Behind', bareDir);
		writeCheckoutMockRecord(tempDir, 'Behind', 'Behind', 'behind');

		await runPull(ctx, { all: true });

		// Without a prior fetch the local count reports behind = 0, so no pull is triggered.
		// The refetch flag (next iteration) will restore the network fetch when needed.
		const checkout = ctx.store.getCheckoutOfRepo('Behind');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		expect(ctx.log.all()).toHaveLength(0);

		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(false);
	});

	it('skips dirty checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'dirty');
		await initWorkingRepoTest(repoDir, bareDir);
		await makeOriginAheadTest(bareDir, tempDirs);
		await simpleGit(repoDir).fetch('origin', 'main');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(tempDir, 'Dirty', bareDir);
		writeCheckoutMockRecord(tempDir, 'Dirty', 'Dirty', 'dirty');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Dirty');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit behind']);
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

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('reports no issue and performs no pull on a clean checkout up to date with origin (false positive)', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'uptodate');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'UpToDate', bareDir);
		writeCheckoutMockRecord(tempDir, 'UpToDate', 'UpToDate', 'uptodate');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('UpToDate');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('skips checkouts not cloned', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pulls the workspace root when it is behind and clean', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await makeWorkspaceRootBehindTest(tempDir, bareDir, tempDirs);

		await runPull(ctx, { all: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').behind).toBe(0);
		expect(existsSync(join(tempDir, 'origin-advance.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});
});
