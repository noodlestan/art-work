/* eslint-disable no-console */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runSanity } from './runSanity';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('sanity command', () => {
	it('reports "not cloned" for a missing checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Foo Bar', 'git@example.com:foo-bar.git');
		writeCheckoutMockRecord(workspaceDir, 'Foo Bar', 'Foo Bar', 'foo-bar', 'ouch');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(false);
		expect(checkouts[0].scan?.issues()).toEqual(['not cloned']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('shows repo status when all repos are clean', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'green');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);

		writeRepoMockRecord(workspaceDir, 'Green', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Green', 'Green', 'green');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual([]);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('shows dirty repo with issues', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'dirty');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'Dirty', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Dirty', 'Dirty', 'dirty');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual(['uncommitted files']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('shows clean unpushed repo without --auto', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'unpushed');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');

		writeRepoMockRecord(workspaceDir, 'Unpushed', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Unpushed', 'Unpushed', 'unpushed');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual(['1 commit ahead']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('pushes clean unpushed repo with --auto', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'autopush');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);
		await advanceGitRepoByOneCommit(repoDir, 'file2.txt');

		writeRepoMockRecord(workspaceDir, 'AutoPush', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'AutoPush', 'AutoPush', 'autopush');

		await runSanity(ctx, { auto: true });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual([]);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(1);
		expect(ops[0].operation).toEqual('push');
		expect(ops[0].message()).toEqual('to origin/main');
	});

	it('does not push dirty repo with --auto', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'dirtynoauto');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		writeFileSync(join(repoDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'DirtyNoAuto', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'DirtyNoAuto', 'DirtyNoAuto', 'dirtynoauto');

		await runSanity(ctx, { auto: true });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual(['uncommitted files', '1 commit ahead']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('surfaces detached HEAD', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'detached');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);
		const headSha = await git.revparse(['HEAD']);
		await git.checkout(headSha.trim());

		writeRepoMockRecord(workspaceDir, 'Detached', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Detached', 'Detached', 'detached');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual(['detached HEAD']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('surfaces merge conflicts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'conflict');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);

		await git.checkoutLocalBranch('feature');
		writeFileSync(join(repoDir, 'file.txt'), 'feature');
		await git.add('.');
		await git.commit('feature change');

		await git.checkout('main');
		writeFileSync(join(repoDir, 'file.txt'), 'main');
		await git.add('.');
		await git.commit('main change');

		try {
			await git.merge(['feature']);
		} catch {
			// empty
		}

		writeRepoMockRecord(workspaceDir, 'Conflict', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Conflict', 'Conflict', 'conflict');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual([
			'merge conflicts',
			'uncommitted files',
			'1 commit ahead',
		]);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('filters "unknown project" from workspace report output', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'green');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);

		writeRepoMockRecord(workspaceDir, 'Green', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Green', 'Green', 'green');

		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		await runSanity(ctx, { auto: false });

		const output = spy.mock.calls.map(c => c[0]).join('\n');
		const workspaceSection = output.split('Workspace:')[1]?.split('Checkouts:')[0] || '';
		expect(workspaceSection).not.toContain('unknown project');

		vi.restoreAllMocks();
	});

	it('reports "unknown project" for a checkout with missing repo record', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'orphan');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeCheckoutMockRecord(workspaceDir, 'Orphan', 'Orphan', 'orphan');

		await runSanity(ctx, { auto: false });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('exists').exists).toEqual(true);
		expect(checkouts[0].scan?.issues()).toEqual(['unknown project']);
		const ops = ctx.log.all();
		expect(ops.length).toEqual(0);
	});

	it('shows extraneous directories in the Extraneous Report', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'orphan');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');

		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		await runSanity(ctx, { auto: false });

		const output = spy.mock.calls.map(c => c[0]).join('\n');
		expect(output).toContain('Untracked:');
		expect(output).toContain('orphan');

		vi.restoreAllMocks();
	});

	it('presents workspace report before checkout report', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'test');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'Test', 'git@example.com:test.git');
		writeCheckoutMockRecord(workspaceDir, 'Test', 'Test', 'test');

		const calls: string[] = [];
		vi.spyOn(console, 'info').mockImplementation((msg: string) => {
			if (msg === 'Workspace:' || msg === 'Checkouts:') {
				calls.push(msg);
			}
		});

		await runSanity(ctx, { auto: false });

		expect(calls[0]).toEqual('Workspace:');
		expect(calls[1]).toEqual('Checkouts:');

		vi.restoreAllMocks();
	});

	it('detects the workspace root is behind origin', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');

		await runSanity(ctx, { auto: false });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').behind).toEqual(1);
		expect(ctx.workspace?.scan?.issues()).toContain('1 commit behind');
	});

	it('syncs the workspace root with --auto when behind and clean', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');

		await runSanity(ctx, { auto: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.state('sync').behind).toEqual(0);
		expect(existsSync(join(workspaceDir, 'origin-advance.txt'))).toEqual(true);
		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toEqual('pull');
		expect(ops[0].outcome).toEqual('success');
		expect(ops[1].operation).toEqual('push');
		expect(ops[1].outcome).toEqual('success');
	});

	it('does not pull the workspace root with --auto when dirty', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');
		writeFileSync(join(workspaceDir, 'dirty.txt'), 'dirty');

		await runSanity(ctx, { auto: true });

		expect(ctx.workspace).toBeDefined();
		expect(ctx.workspace?.scan?.issues()).toContain('uncommitted files');
		expect(ctx.workspace?.scan?.issues()).toContain('1 commit behind');
		expect(ctx.log.all()).toHaveLength(0);
	});

	it('logs failure and continues with other operations when the workspace pull fails', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workspaceDir });
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'origin-advance.txt');
		await simpleGit(workspaceDir).fetch('origin', 'main');

		const { dir: checkoutBare } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'autopush');
		await makeGitRepoFromBare(tempDirs, checkoutBare, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);
		await advanceGitRepoByOneCommit(repoDir, 'file2.txt');

		writeRepoMockRecord(workspaceDir, 'AutoPush', 'git@example.com:autopush.git');
		writeCheckoutMockRecord(workspaceDir, 'AutoPush', 'AutoPush', 'autopush');

		writeFileSync(join(workspaceDir, '.gitignore'), 'checkouts/\n');
		const rootGit = simpleGit(workspaceDir);
		await rootGit.add(['.gitignore', '_records/']);
		await rootGit.commit('workspace records');

		await simpleGit(workspaceDir).remote([
			'set-url',
			'origin',
			join(workspaceDir, 'missing-origin'),
		]);

		await runSanity(ctx, { auto: true });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(2);
		expect(ops[0].operation).toEqual('pull');
		expect(ops[0].outcome).toEqual('failure');
		expect(ops[1].operation).toEqual('push');
		expect(ops[1].outcome).toEqual('success');
	});

	it('with refetch=true detects behind state for checkouts', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = await makeCommandContextMock(workspaceDir);

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'refetchsanity');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });
		await advanceGitRepoByOneCommit(repoDir, 'file.txt');
		const git = simpleGit(repoDir);
		await git.push('origin', 'main', ['--set-upstream']);

		// Advance the remote from a separate clone
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'remote-advance.txt');

		writeRepoMockRecord(workspaceDir, 'RefetchSanity', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'RefetchSanity', 'RefetchSanity', 'refetchsanity');

		await runSanity(ctx, { auto: false, refetch: true });

		const checkouts = ctx.store.getAllCheckouts();
		expect(checkouts.length).toEqual(1);
		expect(checkouts[0].scan?.state('sync').behind).toBe(1);
		expect(checkouts[0].scan?.issues()).toContain('1 commit behind');
	});
});
