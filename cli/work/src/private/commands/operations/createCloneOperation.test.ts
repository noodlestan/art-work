import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock.js';

import { createCloneOperation } from './createCloneOperation.js';

describe('createCloneOperation', () => {
	it('WHEN a checkout is provided the operation outcome and message are correct', () => {
		const checkout = makeCheckoutMock();
		const pending = createCloneOperation(checkout);
		expect(pending.operation).toBe('clone');
		expect(pending.outcome).toBe('pending');
		expect(pending.location).toBe('my-repo');
		expect(pending.message()).toContain('my-repo');
	});

	it('WHEN the checkout is undefined it falls back to the unknown location', () => {
		const pending = createCloneOperation(undefined);
		expect(pending.operation).toBe('clone');
		expect(pending.location).toBe('unknown');
		expect(pending.message()).toBe('clone');
	});
});
