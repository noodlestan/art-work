import { describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';

import { createExtraneousCheckout } from './createExtraneousCheckout.js';

describe('createExtraneousCheckout', () => {
	it('WHEN a location is given it creates a checkout with an empty branch', () => {
		const workspaceDir = makeTempDir([]);
		const ctx = makeCommandContextMock(workspaceDir);
		const checkout = createExtraneousCheckout(ctx.config, 'orphan');
		expect(checkout.record.location).toBe('orphan');
		expect(checkout.record.branch).toBe('');
		expect(checkout.repo).toBeUndefined();
	});
});
