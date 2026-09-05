import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../../test/helpers/context/createMockCommandContext';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs';
import { createCheckout } from '../../store/createCheckout';

import { createPullOperation } from './createPullOperation';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('createPullOperation', () => {
	it('has correct operation, outcome and message', () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkout = createCheckout(ctx.config, 'my-repo', {
			name: 'MyRepo',
			remote: 'git@example.com:my-repo.git',
		});
		const pending = createPullOperation(checkout, 'main');
		expect(pending.operation).toBe('pull');
		expect(pending.outcome).toBe('pending');
		expect(pending.branch).toBe('main');
		expect(pending.message()).toContain('main');
	});
});
