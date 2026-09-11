import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import type { RepositoryRecord } from '../resources/types';
import { createCheckout } from '../store/createCheckout';

import { scanCheckoutState } from './scanCheckoutState';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('scanCheckoutState', () => {
	it('missing dir returns an exists state and a not-cloned issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = createCheckout(ctx.config, 'nope');

		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.state('exists')).toEqual({ type: 'exists', exists: false });
		expect(result.scan?.issues()).toContain('not cloned');
		expect(result.scan?.can('clone')).toBe(true);
		expect(result.scan?.should('clone')).toBe(true);
	});

	it('empty record branch does not produce wrong-branch issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'extraneous');
		await makeGitRepo(tempDirs, { dir: checkoutDir });

		const checkout = createCheckout(ctx.config, 'extraneous', undefined, '');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('unknown project');
		expect(result.scan?.issues()).not.toContain('wrong branch');
	});

	it('record branch matching actual branch does not produce wrong-branch issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'myrepo');
		await makeGitRepo(tempDirs, { dir: checkoutDir });

		const checkout = createCheckout(ctx.config, 'myrepo', undefined, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).not.toContain('wrong branch');
	});

	it('record branch mismatching actual branch produces wrong-branch issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'myrepo');
		await makeGitRepo(tempDirs, { dir: checkoutDir });

		const checkout = createCheckout(ctx.config, 'myrepo', undefined, 'develop');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('wrong branch');
	});

	it('record remote matching actual remote does not produce wrong-remote issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'myrepo');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: checkoutDir });

		const repo: RepositoryRecord = {
			name: 'MyRepo',
			remote: bareDir,
		};
		const checkout = createCheckout(ctx.config, 'myrepo', repo, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).not.toContain('wrong remote');
	});

	it('record remote mismatching actual remote produces wrong-remote issue', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'myrepo');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: checkoutDir });

		const repo: RepositoryRecord = {
			name: 'MyRepo',
			remote: 'git@github.com:noodlestan/foo.git',
		};
		const checkout = createCheckout(ctx.config, 'myrepo', repo, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('wrong remote');
	});

	it('cheap scan reports no behind when tracking ref is stale; refetch reports behind', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'refetch');
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: checkoutDir });

		// Push an additional commit from a second clone so the working repo's tracking ref is stale.
		await advanceBareRepoByOneCommit(tempDirs, bareDir, 'remote-commit.txt');

		const repo: RepositoryRecord = {
			name: 'RefetchRepo',
			remote: bareDir,
		};
		const checkout = createCheckout(ctx.config, 'refetch', repo, 'main');

		// Cheap scan (refetch false) — local tracking ref is stale, so behind = 0.
		const cheap = await scanCheckoutState(ctx, checkout);
		expect(cheap.scan?.state('sync').behind).toBe(0);

		// Refetch scan (refetch true) — fetches from origin, so behind = 1.
		const refreshed = await scanCheckoutState(ctx, checkout, true);
		expect(refreshed.scan?.state('sync').behind).toBe(1);
	});

	it('reports a no-git state when the checkout dir has no .git', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = createCheckout(ctx.config, 'norepo', undefined, '');
		await mkdir(checkout.path, { recursive: true });

		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.state('git-dir')).toEqual({ type: 'git-dir', hasGit: false });
		expect(result.scan?.issues()).toContain('no git');
	});

	it('reports a git-dir state when the checkout dir has a .git', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkoutDir = join(workspaceDir, ctx.config.clone.path, 'myrepo');
		await makeGitRepo(tempDirs, { dir: checkoutDir });

		const checkout = createCheckout(ctx.config, 'myrepo', undefined, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.state('git-dir')).toEqual({ type: 'git-dir', hasGit: true });
		expect(result.scan?.issues()).not.toContain('no git');
	});
});
