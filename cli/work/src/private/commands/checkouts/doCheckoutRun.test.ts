import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';
import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { doCheckoutRun } from './doCheckoutRun';

const tempDirs: string[] = [];

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('doCheckoutRun', () => {
	it('when checkout does not exist logs a failure and returns null', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = makeCheckoutMock({
			path: join(workspaceDir, 'nonexistent'),
		});

		const result = await doCheckoutRun(ctx, checkout, 'echo hello');

		expect(result).toBeNull();
		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].outcome).toBe('failure');
		expect(ops[0].message()).toContain('checkout not cloned');
	});

	it('when checkout exists runs the command and logs success', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		const result = await doCheckoutRun(ctx, checkout, 'echo hello');

		expect(result).not.toBeNull();
		const ops = ctx.log.all();
		expect(ops.some(op => op.outcome === 'success')).toBe(true);
	});

	it('when command exits with non-zero code logs a failure with the exit code', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		const result = await doCheckoutRun(ctx, checkout, 'exit 1');

		expect(result).not.toBeNull();
		const failure = ctx.log.all().find(op => op.outcome === 'failure');
		expect(failure).toBeDefined();
		expect(failure?.message()).toContain('Exit code: 1');
	});

	it('when successful command produces no output prints [No output]', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		await doCheckoutRun(ctx, checkout, 'true');

		const infoOutput = (console.info as ReturnType<typeof vi.fn>).mock.calls
			.map(c => c[0])
			.join('');
		expect(infoOutput).toContain('[No output]');
	});

	it('when successful command returns stdout only prints output', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		await doCheckoutRun(ctx, checkout, 'echo hello');

		const infoOutput = (console.info as ReturnType<typeof vi.fn>).mock.calls
			.map(c => c[0])
			.join('');
		expect(infoOutput).toContain('--- Output:\n');
		expect(infoOutput).toContain('hello');
	});

	it('when successful command returns both stdout and stderr prints output and error', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		await doCheckoutRun(ctx, checkout, 'echo out; echo err >&2');

		const infoOutput = (console.info as ReturnType<typeof vi.fn>).mock.calls
			.map(c => c[0])
			.join('');
		const errorOutput = (console.error as ReturnType<typeof vi.fn>).mock.calls
			.map(c => c[0])
			.join('');
		expect(infoOutput).toContain('--- Output:\n');
		expect(infoOutput).toContain('out');
		expect(errorOutput).toContain('---\n');
		expect(errorOutput).toContain('err');
	});

	it('when unsuccessful command returns stderr prints error label and stderr', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, 'checkout');
		mkdirSync(checkoutDir, { recursive: true });
		const checkout = makeCheckoutMock({
			path: checkoutDir,
			scan: makeCheckoutScanMock(),
		});

		await doCheckoutRun(ctx, checkout, 'echo err >&2; exit 1');

		const errorOutput = (console.error as ReturnType<typeof vi.fn>).mock.calls
			.map(c => c[0])
			.join('');
		expect(errorOutput).toContain('--- Error:\n');
		expect(errorOutput).toContain('err');
	});
});
