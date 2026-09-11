import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { commitFileTest } from '../../../test/helpers/git/commitFileTest';
import { initGitRepoTest } from '../../../test/helpers/git/initGitRepoTest';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { doBranchCheckout } from './doBranchCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doBranchCheckout', () => {
	it('creates a new branch and returns the updated checkout', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const repoDir = join(tempDir, ctx.config.clone.path, 'my-repo');
		await initGitRepoTest(repoDir);
		await commitFileTest(repoDir, 'file.txt');

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'MyRepo', remote: 'git@example.com:my-repo.git' },
		});

		const result = await doBranchCheckout(ctx, checkout, 'feat/x');

		expect(result).not.toBeNull();
		expect(result?.record.branch).toBe('feat/x');
		const git = simpleGit(repoDir);
		const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
		expect(branch.trim()).toBe('feat/x');
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('success');
	});

	it('logs failure and returns null when branch creation fails', async () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(tempDir);
		const checkout = makeCheckoutMock({ path: '/nonexistent' });

		const result = await doBranchCheckout(ctx, checkout, 'feat/x');

		expect(result).toBeNull();
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('failure');
	});
});
