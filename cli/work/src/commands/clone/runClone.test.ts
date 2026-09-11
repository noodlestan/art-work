import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runClone } from './runClone';

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

describe('clone command', () => {
	it('clones a missing repo and creates the checkout record', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);

		await runClone(ctx, { repoName: 'Artificial' });

		const repoDir = join(workspaceDir, ctx.config.clone.path, 'artificial');
		expect(() => simpleGit(repoDir).status()).not.toThrow();

		const recordFile = join(workspaceDir, '_records/artificial-checkout.art');
		const content = readFileSync(recordFile, 'utf-8');
		expect(content).toContain('## Checkout: Artificial');
		expect(content).toContain('**Location:** `artificial`');
		expect(content).toContain('**Branch:** `main`');
	});

	it('reports issues for a dirty checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const workingDir = join(workspaceDir, 'checkouts/artificial');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workingDir });
		writeFileSync(join(workingDir, 'dirty.txt'), 'dirty');

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Artificial', 'Artificial', 'artificial');

		await runClone(ctx, { repoName: 'Artificial' });

		const output = (console.info as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0]).join('\n');
		expect(output).toContain('uncommitted files');
	});

	it('reports current branch even if different from checkout record', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const workingDir = join(workspaceDir, 'checkouts/artificial');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workingDir });
		const git = simpleGit(workingDir);
		await git.checkoutLocalBranch('feature');

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Artificial', 'Artificial', 'artificial');

		await runClone(ctx, { repoName: 'Artificial' });

		const output = (console.info as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0]).join('\n');
		expect(output).toContain('feature');
	});

	it('errors for an unknown repo name', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await runClone(ctx, { repoName: 'Unknown' });

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toContain('Unknown');
	});

	it('clones all repos when --all is passed', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir1 } = await makeGitBareRepo(tempDirs);
		const { dir: bareDir2 } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Repo A', bareDir1);
		writeRepoMockRecord(workspaceDir, 'Repo B', bareDir2);

		await runClone(ctx, { all: true });

		const checkoutDir1 = join(workspaceDir, ctx.config.clone.path, 'repo-a');
		const checkoutDir2 = join(workspaceDir, ctx.config.clone.path, 'repo-b');
		expect(existsSync(checkoutDir1)).toBe(true);
		expect(existsSync(checkoutDir2)).toBe(true);
	});

	it('resolves default location and branch when no checkout override exists', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'My Repo', bareDir);

		await runClone(ctx, { repoName: 'My Repo' });

		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'my-repo');
		expect(existsSync(checkoutDir)).toBe(true);
	});

	it('uses target location when specified', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);

		await runClone(ctx, { repoName: 'Artificial', checkoutInput: 'custom' });

		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'artificial-custom');
		expect(existsSync(checkoutDir)).toBe(true);
	});

	it('creates checkout named Artificial-foo when cloning Artificial to foo', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);

		await runClone(ctx, { repoName: 'Artificial', checkoutInput: 'foo' });

		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'artificial-foo');
		expect(existsSync(checkoutDir)).toBe(true);

		const recordFile = join(workspaceDir, '_records/artificial-@-foo-checkout.art');
		expect(existsSync(recordFile)).toBe(true);
		const content = readFileSync(recordFile, 'utf-8');
		expect(content).toContain('## Checkout: Artificial');
		expect(content).toContain('**Location:** `artificial-foo`');
	});

	it('is idempotent when cloning an existing checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);

		await runClone(ctx, { repoName: 'Artificial' });
		await runClone(ctx, { repoName: 'Artificial' });

		const output = (console.info as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0]).join('\n');
		expect(output).toContain('checkouts/artificial');
	});

	it('allows multiple checkouts of the same repo with different locations', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		writeRepoMockRecord(workspaceDir, 'Artificial', bareDir);

		await runClone(ctx, { repoName: 'Artificial' });
		await runClone(ctx, { repoName: 'Artificial', checkoutInput: 'custom' });

		const checkoutDir1 = join(workspaceDir, ctx.config.clone.path, 'artificial');
		const checkoutDir2 = join(workspaceDir, ctx.config.clone.path, 'artificial-custom');
		expect(existsSync(checkoutDir1)).toBe(true);
		expect(existsSync(checkoutDir2)).toBe(true);
	});
});
