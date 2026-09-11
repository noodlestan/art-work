import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createCloneOperation } from './createCloneOperation';

describe('createCloneOperation', () => {
	it('has correct operation, outcome and message with checkout', () => {
		const checkout = makeCheckoutMock();
		const pending = createCloneOperation(checkout);
		expect(pending.operation).toBe('clone');
		expect(pending.outcome).toBe('pending');
		expect(pending.location).toBe('my-repo');
		expect(pending.message()).toContain('my-repo');
	});

	it('falls back to unknown location when checkout is undefined', () => {
		const pending = createCloneOperation(undefined);
		expect(pending.operation).toBe('clone');
		expect(pending.location).toBe('unknown');
		expect(pending.message()).toBe('clone');
	});
});
