import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createCheckoutRunOperation } from './createCheckoutRunOperation';

describe('createCheckoutRunOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createCheckoutRunOperation(checkout, 'npm test');
		expect(pending.operation).toBe('run');
		expect(pending.outcome).toBe('pending');
		expect(pending.command).toBe('npm test');
		expect(pending.message()).toBe('npm test');
	});
});
