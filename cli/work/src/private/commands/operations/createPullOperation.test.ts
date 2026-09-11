import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createPullOperation } from './createPullOperation';

describe('createPullOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createPullOperation(checkout, 'main');
		expect(pending.operation).toBe('pull');
		expect(pending.outcome).toBe('pending');
		expect(pending.branch).toBe('main');
		expect(pending.message()).toContain('main');
	});
});
