import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { writeCheckoutMockRecord } from '../../test/helpers/records/writeCheckoutMockRecord';
import { writeRepoMockRecord } from '../../test/helpers/records/writeRepoMockRecord';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { runCheckoutsRun } from './runCheckoutsRun';

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

describe('checkouts run command', () => {
	it('prints the usage message and runs nothing when neither -c nor --all is provided', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'art');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: repoDir });

		writeRepoMockRecord(workspaceDir, 'Art', bareDir);
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');

		await runCheckoutsRun(ctx, { command: 'touch marker.txt' });

		expect(existsSync(join(repoDir, 'marker.txt'))).toBe(false);
		const ops = ctx.log.all().filter(op => op.operation === 'command');
		expect(ops).toHaveLength(1);
		expect((ops[0].data as string[])[0]).toBe('checkouts run');
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toBe('No targets.');
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage: Use '));
	});

	it('runs the command in every checkout when --all is provided', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: artBare } = await makeGitBareRepo(tempDirs);
		const { dir: purrBare } = await makeGitBareRepo(tempDirs);
		const artDir = join(workspaceDir, ctx.config.clone.path, 'art');
		const purrDir = join(workspaceDir, ctx.config.clone.path, 'purr');
		await makeGitRepoFromBare(tempDirs, artBare, { dir: artDir });
		await makeGitRepoFromBare(tempDirs, purrBare, { dir: purrDir });

		writeRepoMockRecord(workspaceDir, 'Art', artBare);
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(workspaceDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(workspaceDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: 'touch marker.txt', all: true });

		expect(existsSync(join(artDir, 'marker.txt'))).toBe(true);
		expect(existsSync(join(purrDir, 'marker.txt'))).toBe(true);

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(2);
		expect(runOps.map(op => op.outcome)).toEqual(['success', 'success']);
	});

	it('runs only in checkouts matching the pattern', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: artBare } = await makeGitBareRepo(tempDirs);
		const { dir: purrBare } = await makeGitBareRepo(tempDirs);
		const artDir = join(workspaceDir, ctx.config.clone.path, 'art');
		const purrDir = join(workspaceDir, ctx.config.clone.path, 'purr');
		await makeGitRepoFromBare(tempDirs, artBare, { dir: artDir });
		await makeGitRepoFromBare(tempDirs, purrBare, { dir: purrDir });

		writeRepoMockRecord(workspaceDir, 'Art', artBare);
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(workspaceDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(workspaceDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: 'touch marker.txt', checkouts: ['art*'] });

		expect(existsSync(join(artDir, 'marker.txt'))).toBe(true);
		expect(existsSync(join(purrDir, 'marker.txt'))).toBe(false);

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(1);
		expect(runOps[0].checkout?.record.name).toBe('Art');
		expect(runOps[0].outcome).toBe('success');
	});

	it('logs a failure operation per checkout when the command exits non-zero', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: artBare } = await makeGitBareRepo(tempDirs);
		const { dir: purrBare } = await makeGitBareRepo(tempDirs);
		const artDir = join(workspaceDir, ctx.config.clone.path, 'art');
		const purrDir = join(workspaceDir, ctx.config.clone.path, 'purr');
		await makeGitRepoFromBare(tempDirs, artBare, { dir: artDir });
		await makeGitRepoFromBare(tempDirs, purrBare, { dir: purrDir });

		writeRepoMockRecord(workspaceDir, 'Art', artBare);
		writeCheckoutMockRecord(workspaceDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(workspaceDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(workspaceDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: 'sh -c "exit 1"', all: true });

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(2);
		expect(runOps.map(op => op.outcome)).toEqual(['failure', 'failure']);
		expect(String(runOps[0].message())).toContain('Exit code: 1');
	});

	it('warns and executes nothing when no checkout matches the pattern', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		await runCheckoutsRun(ctx, { command: 'touch marker.txt', checkouts: ['nonexistent'] });

		expect(ctx.log.all().filter(op => op.operation === 'run')).toHaveLength(0);
	});

	it('logs a failure operation for a recorded-but-not-cloned checkout', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		writeRepoMockRecord(workspaceDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(workspaceDir, 'Missing', 'Missing', 'missing');

		await runCheckoutsRun(ctx, { command: 'touch marker.txt', all: true });

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(1);
		expect(runOps[0].outcome).toBe('failure');
		expect(String(runOps[0].message())).toContain('checkout not cloned');
	});
});
