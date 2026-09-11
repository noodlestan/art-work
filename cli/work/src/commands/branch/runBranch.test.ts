import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runBranch } from './runBranch';

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

describe('branch command', () => {
	it('prints the usage message and runs nothing when neither -c nor --all is provided', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Art', '');
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');

		await runBranch(ctx, { branch: 'feat/x' });

		const ops = ctx.log.all().filter(op => op.operation === 'command');
		expect(ops).toHaveLength(1);
		expect((ops[0].data as string[])[0]).toBe('branch');
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toBe('No targets.');
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage: Use '));
	});

	it('creates and checks out a new branch in a single specified checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'one');
		await makeGitRepo(tempDirs, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(workspaceDir, 'One', 'One', 'one');

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'alpha') });
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'beta') });

		writeRepoMockRecord(workspaceDir, 'Alpha', 'git@example.com:alpha.git');
		writeRepoMockRecord(workspaceDir, 'Beta', 'git@example.com:beta.git');
		writeCheckoutMockRecord(workspaceDir, 'Alpha', 'Alpha', 'alpha');
		writeCheckoutMockRecord(workspaceDir, 'Beta', 'Beta', 'beta');

		await runBranch(ctx, { branch: 'feat/x', all: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops.every(o => o.operation === 'branch' && o.outcome === 'success')).toBe(true);
		expect(ctx.store.getCheckoutOfRepo('Alpha')?.record.branch).toBe('feat/x');
		expect(ctx.store.getCheckoutOfRepo('Beta')?.record.branch).toBe('feat/x');
	});

	it('warns and skips when pattern matches no checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, {
			dir: join(workspaceDir, ctx.config.clone.path, 'checkouts/one'),
		});

		writeRepoMockRecord(workspaceDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(workspaceDir, 'One', 'One', 'one');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['Nope'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);
		expect(console.warn).toHaveBeenCalledWith('no checkout matches pattern: "Nope"');
	});

	it('logs a failure and continues when a checkout is not cloned', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, {
			dir: join(workspaceDir, ctx.config.clone.path, 'checkouts/good'),
		});

		writeRepoMockRecord(workspaceDir, 'Good', 'git@example.com:good.git');
		writeRepoMockRecord(workspaceDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(workspaceDir, 'Good', 'Good', 'good');
		writeCheckoutMockRecord(workspaceDir, 'Missing', 'Missing', 'missing');

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'conv') });

		writeCheckoutMockRecord(workspaceDir, 'Conv', 'Conv', 'conv');

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'one');
		const { git } = await makeGitRepo(tempDirs, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		await git.checkoutLocalBranch('feat/x');
		await git.checkoutLocalBranch('feat/y');

		writeRepoMockRecord(workspaceDir, 'One', 'git@example.com:one.git');
		writeCheckoutMockRecord(workspaceDir, 'One', 'One', 'one');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['one'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].outcome).toBe('success');
		expect(ops[0].message()).toBe('switched to feat/x');
		expect(ctx.store.getCheckoutOfRepo('One')?.record.branch).toBe('feat/x');
	});

	it('branches checkouts matching wildcard pattern', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'alpha') });
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'beta') });

		writeRepoMockRecord(workspaceDir, 'Alpha', 'git@example.com:alpha.git');
		writeRepoMockRecord(workspaceDir, 'Beta', 'git@example.com:beta.git');
		writeCheckoutMockRecord(workspaceDir, 'Alpha', 'Alpha', 'alpha');
		writeCheckoutMockRecord(workspaceDir, 'Beta', 'Beta', 'beta');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['a*'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('branch');
		expect(ops[0].outcome).toBe('success');
		expect(ctx.store.getCheckoutOfRepo('Alpha')?.record.branch).toBe('feat/x');
		expect(ctx.store.getCheckoutOfRepo('Beta')?.record.branch).toBe('main');
	});

	it('warns and skips when pattern matches no checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		await makeGitRepo(tempDirs, { dir: join(workspaceDir, ctx.config.clone.path, 'alpha') });

		writeRepoMockRecord(workspaceDir, 'Alpha', 'git@example.com:alpha.git');
		writeCheckoutMockRecord(workspaceDir, 'Alpha', 'Alpha', 'alpha');

		await runBranch(ctx, { branch: 'feat/x', checkouts: ['nonexistent'] });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(0);
		expect(console.warn).toHaveBeenCalledWith('no checkout matches pattern: "nonexistent"');
	});
});
