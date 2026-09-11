import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createBranchOperation } from './createBranchOperation';

describe('createBranchOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createBranchOperation(checkout, 'feat/x');
		expect(pending.operation).toBe('branch');
		expect(pending.outcome).toBe('pending');
		expect(pending.branch).toBe('feat/x');
		expect(pending.message()).toContain('feat/x');
	});
});
