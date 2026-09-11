import { describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir';

import { createExtraneousCheckout } from './createExtraneousCheckout';

describe('createExtraneousCheckout', () => {
	it('creates a checkout with the given location and empty branch', () => {
		const workspaceDir = makeTempDir([]);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = createExtraneousCheckout(ctx.config, 'orphan');
		expect(checkout.record.location).toBe('orphan');
		expect(checkout.record.branch).toBe('');
		expect(checkout.repo).toBeUndefined();
	});
});
