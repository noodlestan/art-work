import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createPushOperation } from './createPushOperation';

describe('createPushOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createPushOperation(checkout, 'main');
		expect(pending.operation).toBe('push');
		expect(pending.outcome).toBe('pending');
		expect(pending.branch).toBe('main');
		expect(pending.message()).toContain('main');
	});
});
