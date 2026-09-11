import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
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
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('pull command', () => {
	it('prints the usage message and runs nothing when neither -c nor --all is provided', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);

		writeRepoMockRecord(tempDir, 'Art', '');
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');

		await runPull(ctx, {});

		const ops = ctx.log.all().filter(op => op.operation === 'command');
		expect(ops).toHaveLength(1);
		expect((ops[0].data as string[])[0]).toBe('pull');
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toBe('No targets.');
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage: Use '));
	});

	it('pulls checkouts behind even when the local tracking ref is stale', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'behind');
		await initWorkingRepoTest(repoDir, bareDir);
		await makeOriginAheadTest(bareDir, tempDirs);

		writeRepoMockRecord(tempDir, 'Behind', bareDir);
		writeCheckoutMockRecord(tempDir, 'Behind', 'Behind', 'behind');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Behind');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');

		expect(existsSync(join(repoDir, 'origin.txt'))).toBe(true);
	});

	it('skips dirty checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
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

	it('pulls checkouts already up to date', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'current');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'Current', 'git@example.com:current.git');
		writeCheckoutMockRecord(tempDir, 'Current', 'Current', 'current');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});

	it('pulls a clean checkout up to date with origin', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'uptodate');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'UpToDate', bareDir);
		writeCheckoutMockRecord(tempDir, 'UpToDate', 'UpToDate', 'uptodate');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('UpToDate');
		expect(checkout?.scan?.state('sync').behind).toBe(0);
		expect(checkout?.scan?.issues()).toEqual([]);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});

	it('skips checkouts not cloned', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);

		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('does not pull the workspace root without the workspace option', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		await makeWorkspaceRootBehindTest(tempDir, bareDir, tempDirs);

		await runPull(ctx, { all: true });

		expect(existsSync(join(tempDir, 'origin-advance.txt'))).toBe(false);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pulls the workspace root when it is behind and clean with the workspace option', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		await makeWorkspaceRootBehindTest(tempDir, bareDir, tempDirs);

		await runPull(ctx, { all: true, workspace: true });

		expect(ctx.workspace).toBeDefined();
		expect(existsSync(join(tempDir, 'origin-advance.txt'))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});
});
