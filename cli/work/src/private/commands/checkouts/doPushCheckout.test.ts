import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';
import { makeCheckoutScanMock } from '../../../test/helpers/checkout/makeCheckoutScanMock';
import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { makeGitRepo } from '../../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';

import { doPushCheckout } from './doPushCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('doPushCheckout', () => {
	it('pushing a checkout with no remote logs a failure operation', async () => {
		const workspaceDir = makeTempDir(tempDirs);
		const ctx = makeCommandContextMock(workspaceDir);
		const repoDir = join(workspaceDir, ctx.config.clone.path, 'my-repo');
		await makeGitRepo(tempDirs, { commit: true, dir: repoDir });

		const checkout = makeCheckoutMock({
			path: repoDir,
			repo: { name: 'MyRepo', remote: 'git@example.com:my-repo.git' },
		});
		checkout.scan = makeCheckoutScanMock(['no-remote']);

		await doPushCheckout(ctx, checkout);

		const ops = ctx.log.all();
		expect(ops).toHaveLength(1);
		expect(ops[0].outcome).toBe('failure');
	});
});
