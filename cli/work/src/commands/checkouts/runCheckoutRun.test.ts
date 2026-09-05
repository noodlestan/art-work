import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
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
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const bareDir = makeTempDir(tempDirs);
		const repoDir = join(tempDir, ctx.config.clone.path, 'art');
		await initWorkingRepoTest(repoDir, bareDir);

		writeRepoMockRecord(tempDir, 'Art', bareDir);
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');

		await runCheckoutsRun(ctx, { command: ['touch', 'marker.txt'] });

		expect(existsSync(join(repoDir, 'marker.txt'))).toBe(false);
		expect(ctx.log.all().filter(op => op.operation === 'run')).toHaveLength(0);
		expect(console.error).toHaveBeenCalledWith(
			'Usage: Use `art-workspace checkouts run [options] -c <pattern>` or `art-workspace checkouts run [options] --all` if you want to run the command in all checkouts.',
		);
	});

	it('runs the command in every checkout when --all is provided', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const artBare = makeTempDir(tempDirs);
		const purrBare = makeTempDir(tempDirs);
		const artDir = join(tempDir, ctx.config.clone.path, 'art');
		const purrDir = join(tempDir, ctx.config.clone.path, 'purr');
		await initWorkingRepoTest(artDir, artBare);
		await initWorkingRepoTest(purrDir, purrBare);

		writeRepoMockRecord(tempDir, 'Art', artBare);
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(tempDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(tempDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: ['touch', 'marker.txt'], all: true });

		expect(existsSync(join(artDir, 'marker.txt'))).toBe(true);
		expect(existsSync(join(purrDir, 'marker.txt'))).toBe(true);

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(2);
		expect(runOps.map(op => op.outcome)).toEqual(['success', 'success']);
	});

	it('runs a multi-word command passed as a single string', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const artBare = makeTempDir(tempDirs);
		const artDir = join(tempDir, ctx.config.clone.path, 'art');
		await initWorkingRepoTest(artDir, artBare);

		writeRepoMockRecord(tempDir, 'Art', artBare);
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');

		await runCheckoutsRun(ctx, { command: ['touch marker.txt'], all: true });

		expect(existsSync(join(artDir, 'marker.txt'))).toBe(true);
	});

	it('runs only in checkouts matching the pattern', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const artBare = makeTempDir(tempDirs);
		const purrBare = makeTempDir(tempDirs);
		const artDir = join(tempDir, ctx.config.clone.path, 'art');
		const purrDir = join(tempDir, ctx.config.clone.path, 'purr');
		await initWorkingRepoTest(artDir, artBare);
		await initWorkingRepoTest(purrDir, purrBare);

		writeRepoMockRecord(tempDir, 'Art', artBare);
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(tempDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(tempDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: ['touch', 'marker.txt'], checkouts: ['art*'] });

		expect(existsSync(join(artDir, 'marker.txt'))).toBe(true);
		expect(existsSync(join(purrDir, 'marker.txt'))).toBe(false);

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(1);
		expect(runOps[0].checkout?.record.name).toBe('Art');
		expect(runOps[0].outcome).toBe('success');
	});

	it('logs a failure operation per checkout when the command exits non-zero', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const artBare = makeTempDir(tempDirs);
		const purrBare = makeTempDir(tempDirs);
		const artDir = join(tempDir, ctx.config.clone.path, 'art');
		const purrDir = join(tempDir, ctx.config.clone.path, 'purr');
		await initWorkingRepoTest(artDir, artBare);
		await initWorkingRepoTest(purrDir, purrBare);

		writeRepoMockRecord(tempDir, 'Art', artBare);
		writeCheckoutMockRecord(tempDir, 'Art', 'Art', 'art');
		writeRepoMockRecord(tempDir, 'Purrception', purrBare);
		writeCheckoutMockRecord(tempDir, 'Purrception', 'Purrception', 'purr');

		await runCheckoutsRun(ctx, { command: ['sh', '-c', 'exit 1'], all: true });

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(2);
		expect(runOps.map(op => op.outcome)).toEqual(['failure', 'failure']);
		expect(String(runOps[0].message())).toContain('Exit code: 1');
	});

	it('warns and executes nothing when no checkout matches the pattern', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		await runCheckoutsRun(ctx, { command: ['touch', 'marker.txt'], checkouts: ['nonexistent'] });

		expect(console.warn).toHaveBeenCalledWith('no checkout matches pattern: "nonexistent"');
		expect(ctx.log.all().filter(op => op.operation === 'run')).toHaveLength(0);
	});

	it('logs a failure operation for a recorded-but-not-cloned checkout', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);

		writeRepoMockRecord(tempDir, 'Missing', 'git@example.com:missing.git');
		writeCheckoutMockRecord(tempDir, 'Missing', 'Missing', 'missing');

		await runCheckoutsRun(ctx, { command: ['touch', 'marker.txt'], all: true });

		const runOps = ctx.log.all().filter(op => op.operation === 'run');
		expect(runOps).toHaveLength(1);
		expect(runOps[0].outcome).toBe('failure');
		expect(String(runOps[0].message())).toContain('checkout not cloned');
	});
});
