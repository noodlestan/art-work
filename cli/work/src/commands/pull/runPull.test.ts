import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Art', '');
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');

		await runPull(ctx, {});

		const ops = ctx.log.all().filter(op => op.operation === 'command');
		expect(ops).toHaveLength(1);
		expect((ops[0].data as string[])[0]).toBe('pull');
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toBe('No targets.');
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage: Use '));
	});

	it('pulls checkouts behind even when the local tracking ref is stale', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'behind');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir);

		writeRepoMockRecord(workspaceDir, 'Behind', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Behind', 'Behind', 'behind');

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'dirty');
		const { git } = await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir);
		await git.fetch('origin', 'main');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'Dirty', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Dirty', 'Dirty', 'dirty');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Dirty');
		expect(checkout?.scan?.issues()).toEqual(['uncommitted files', '1 commit behind']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pulls checkouts already up to date', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'current');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'Current', 'git@example.com:current.git');
		writeCheckoutMockRecord(workspaceDir, 'Current', 'Current', 'current');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Current');
		expect(checkout?.scan?.state('sync').delta).toBe(0);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});

	it('pulls a clean checkout up to date with origin', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'uptodate');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'UpToDate', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'UpToDate', 'UpToDate', 'uptodate');

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
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(workspaceDir, 'Missing', 'Missing', 'missing');

		await runPull(ctx, { all: true });

		const checkout = ctx.store.getCheckoutOfRepo('Missing');
		expect(checkout?.scan?.state('exists').exists).toBe(false);
		expect(checkout?.scan?.issues()).toEqual(['not cloned']);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('does not pull the workspace root without the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const { git } = await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		const committedFile = await advanceBareRepoByOneCommit(tempDirs, bareDir);
		await git.fetch('origin', 'main');

		await runPull(ctx, { all: true });

		expect(existsSync(join(workspaceDir, committedFile))).toBe(false);
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('pulls the workspace root when it is behind and clean with the workspace option', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const { git } = await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		const committedFile = await advanceBareRepoByOneCommit(tempDirs, bareDir);
		await git.fetch('origin', 'main');

		await runPull(ctx, { all: true, workspace: true });

		expect(ctx.workspace).toBeDefined();
		expect(existsSync(join(workspaceDir, committedFile))).toBe(true);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].operation).toBe('pull');
		expect(ops[0].outcome).toBe('success');
	});
});
