import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../test/helpers/checkout/makeCheckoutMock';
import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { doClone } from './doClone';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('doClone', () => {
	it('clones a checkout and returns the updated state', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		const checkout = makeCheckoutMock({
			path: join(workspaceDir, ctx.config.clone.path, 'my-repo'),
			repo: { name: 'MyRepo', remote: bareDir },
		});

		const result = await doClone(ctx, checkout);

		expect(result).not.toBeNull();
		expect(result?.scan?.state('exists').exists).toBe(true);
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('success');
	});

	it('logs failure and returns null when clone fails', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = makeCheckoutMock({
			path: join(workspaceDir, ctx.config.clone.path, 'my-repo'),
			repo: { name: 'MyRepo', remote: join(workspaceDir, 'nonexistent-repo.git') },
		});

		const result = await doClone(ctx, checkout);

		expect(result).toBeNull();
		expect(ctx.log.all()).toHaveLength(1);
		expect(ctx.log.all()[0].outcome).toBe('failure');
	});

	it('returns null when checkout has no repo', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = makeCheckoutMock();

		const result = await doClone(ctx, checkout);

		expect(result).toBeNull();
		expect(ctx.log.all()).toHaveLength(0);
	});
});
