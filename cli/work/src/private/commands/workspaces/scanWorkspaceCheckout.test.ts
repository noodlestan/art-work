import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { makeGitRepo } from '../../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { scanWorkspaceCheckout } from './scanWorkspaceCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('scanWorkspaceCheckout', () => {
	it('scans the workspace root and sets ctx.workspace', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir: workspaceDir });
		const ctx = makeCommandContextMock(workspaceDir);

		const result = await scanWorkspaceCheckout(ctx);

		expect(result).toBeDefined();
		expect(ctx.workspace).toBe(result);
		expect(result?.record.name).toBe('Workspace');
		expect(result?.record.location).toBe('-');
		expect(result?.scan?.state('exists').exists).toBe(true);
		expect(result?.scan?.state('git-dir').hasGit).toBe(true);
	});

	it('re-scans with refetch when requested', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir: workspaceDir });
		const ctx = makeCommandContextMock(workspaceDir);

		const result = await scanWorkspaceCheckout(ctx, true);

		expect(result).toBeDefined();
		expect(ctx.workspace).toBe(result);
		expect(result?.scan?.state('exists').exists).toBe(true);
	});

	it('returns not-cloned scan when workspace root has no git', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);

		const result = await scanWorkspaceCheckout(ctx);

		expect(result).toBeDefined();
		expect(ctx.workspace).toBe(result);
		expect(result?.scan?.state('exists').exists).toBe(true);
		expect(result?.scan?.state('git-dir').hasGit).toBe(false);
		expect(result?.scan?.issues()).toContain('no git');
	});
});
