import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initGitRepoTest } from '../../test/helpers/git/initGitRepoTest';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runBranch } from './runBranch';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('branch command', () => {
	it('creates and checks out a new branch in a single specified checkout', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const repoDir = join(tempDir, ctx.config.clone.path, 'one');
		await initGitRepoTest(repoDir);

		writeRepoMockRecord(tempDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(tempDir, 'One', 'One', 'one');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['one'] });

		const checkout = ctx.store.getCheckoutOfRepo('One');
		expect(checkout).toBeDefined();
		expect(checkout?.record.branch).toBe('feat/x');

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('branch');
		expect(ops[0].outcome).toBe('success');
		expect(ops[0].message()).toBe('created feat/x');
	});

	it('branches all checkouts when none are specified', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'alpha'));
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'beta'));

		writeRepoMockRecord(tempDir, 'Alpha', 'git@example.com:alpha.git');
		writeRepoMockRecord(tempDir, 'Beta', 'git@example.com:beta.git');
		writeCheckoutMockRecord(tempDir, 'Alpha', 'Alpha', 'alpha');
		writeCheckoutMockRecord(tempDir, 'Beta', 'Beta', 'beta');

		await runBranch(ctx, { branch: 'feat/x', all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops.every(o => o.operation === 'branch' && o.outcome === 'success')).toBe(true);
		expect(ctx.store.getCheckoutOfRepo('Alpha')?.record.branch).toBe('feat/x');
		expect(ctx.store.getCheckoutOfRepo('Beta')?.record.branch).toBe('feat/x');
	});

	it('warns and skips when pattern matches no checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'checkouts/one'));

		writeRepoMockRecord(tempDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(tempDir, 'One', 'One', 'one');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['Nope'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);
		expect(console.warn).toHaveBeenCalledWith('no checkout matches pattern: "Nope"');
	});

	it('logs a failure and continues when a checkout is not cloned', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'checkouts/good'));

		writeRepoMockRecord(tempDir, 'Good', 'git@example.com:good.git');
		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Good', 'Good', 'good');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['Missing', 'Good'] });

		const ops = ctx.log.all();
		expect(ops.length).toEqual(2);
		const failure = ops.find(o => o.outcome === 'failure');
		expect(failure).toBeDefined();
		expect(failure?.operation).toBe('branch');
		expect(failure?.message()).toContain('not cloned');
		expect(ctx.store.getCheckoutOfRepo('Good')?.record.branch).toBe('main');
	});

	it('branches a checkout with no matching repository', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'conv'));

		writeCheckoutMockRecord(tempDir, 'Conv', 'Conv', 'conv');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['conv'] });

		const checkout = ctx.store.getCheckoutForLocation('conv');
		expect(checkout).toBeDefined();
		expect(checkout?.repo).toBeUndefined();
		expect(checkout?.record.branch).toBe('feat/x');
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('success');
		expect(ctx.log.all()[0].message()).toBe('created feat/x');
	});

	it('switches to an existing branch', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const repoDir = join(tempDir, ctx.config.clone.path, 'one');
		await initGitRepoTest(repoDir);
		const git = simpleGit(repoDir);
		await commitFileTest(repoDir, 'file.txt');
		await git.checkoutLocalBranch('feat/x');
		await git.checkoutLocalBranch('feat/y');

		writeRepoMockRecord(tempDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(tempDir, 'One', 'One', 'one');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['one'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].outcome).toBe('success');
		expect(ops[0].message()).toBe('switched to feat/x');
		expect(ctx.store.getCheckoutOfRepo('One')?.record.branch).toBe('feat/x');
	});

	it('branches checkouts matching wildcard pattern', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'alpha'));
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'beta'));

		writeRepoMockRecord(tempDir, 'Alpha', 'git@example.com:alpha.git');
		writeRepoMockRecord(tempDir, 'Beta', 'git@example.com:beta.git');
		writeCheckoutMockRecord(tempDir, 'Alpha', 'Alpha', 'alpha');
		writeCheckoutMockRecord(tempDir, 'Beta', 'Beta', 'beta');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['a*'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('branch');
		expect(ops[0].outcome).toBe('success');
		expect(ctx.store.getCheckoutOfRepo('Alpha')?.record.branch).toBe('feat/x');
		expect(ctx.store.getCheckoutOfRepo('Beta')?.record.branch).toBe('main');
	});

	it('warns and skips when pattern matches no checkouts', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		await initGitRepoTest(join(tempDir, ctx.config.clone.path, 'alpha'));

		writeRepoMockRecord(tempDir, 'Alpha', 'git@example.com:alpha.git');
		writeCheckoutMockRecord(tempDir, 'Alpha', 'Alpha', 'alpha');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['nonexistent'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);
		expect(console.warn).toHaveBeenCalledWith('no checkout matches pattern: "nonexistent"');
	});
});
