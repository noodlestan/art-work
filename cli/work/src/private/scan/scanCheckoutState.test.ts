import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initGitRepoTest } from '../../test/helpers/git/initGitRepoTest';
import { initWorkingRepoTest } from '../../test/helpers/git/initWorkingRepoTest';
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
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkout = createCheckout(ctx.config, 'nope');

		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.state('exists')).toEqual({ type: 'exists', exists: false });
		expect(result.scan?.issues()).toContain('not cloned');
		expect(result.scan?.can('clone')).toBe(true);
		expect(result.scan?.should('clone')).toBe(true);
	});

	it('empty record branch does not produce wrong-branch issue', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'extraneous');
		await initGitRepoTest(checkoutDir);

		const checkout = createCheckout(ctx.config, 'extraneous', undefined, '');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('unknown project');
		expect(result.scan?.issues()).not.toContain('wrong branch');
	});

	it('record branch matching actual branch does not produce wrong-branch issue', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'myrepo');
		await initGitRepoTest(checkoutDir);

		const checkout = createCheckout(ctx.config, 'myrepo', undefined, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).not.toContain('wrong branch');
	});

	it('record branch mismatching actual branch produces wrong-branch issue', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'myrepo');
		await initGitRepoTest(checkoutDir);

		const checkout = createCheckout(ctx.config, 'myrepo', undefined, 'develop');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('wrong branch');
	});

	it('record remote matching actual remote does not produce wrong-remote issue', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'myrepo');
		await initWorkingRepoTest(checkoutDir, bareDir);

		const repo: RepositoryRecord = {
			name: 'MyRepo',
			remote: bareDir,
		};
		const checkout = createCheckout(ctx.config, 'myrepo', repo, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).not.toContain('wrong remote');
	});

	it('record remote mismatching actual remote produces wrong-remote issue', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'myrepo');
		await initWorkingRepoTest(checkoutDir, bareDir);

		const repo: RepositoryRecord = {
			name: 'MyRepo',
			remote: 'git@github.com:noodlestan/foo.git',
		};
		const checkout = createCheckout(ctx.config, 'myrepo', repo, 'main');
		const result = await scanCheckoutState(ctx, checkout);

		expect(result.scan?.issues()).toContain('wrong remote');
	});

	it('cheap scan reports no behind when tracking ref is stale; refetch reports behind', async () => {
		const tempDir = makeTempDir(tempDirs);
		const bareDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkoutDir = join(tempDir, ctx.config.clone.path, 'refetch');
		await initWorkingRepoTest(checkoutDir, bareDir);
		const git = simpleGit(checkoutDir);
		await git.push('origin', 'main', ['--set-upstream']);

		// Push an additional commit from a second clone so the working repo's tracking ref is stale.
		const secondDir = makeTempDir(tempDirs);
		await git.clone(bareDir, secondDir);
		const secondGit = simpleGit(secondDir);
		await secondGit.addConfig('user.email', 'test@example.com');
		await secondGit.addConfig('user.name', 'Test');
		await commitFileTest(secondDir, 'remote-commit.txt');
		await secondGit.push('origin', 'main');

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
});
