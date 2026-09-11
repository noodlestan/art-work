import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createLinkedOperation } from './createLinkedOperation';

describe('createLinkedOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createLinkedOperation(checkout, '@scope/pkg', '1.2.3');
		expect(pending.operation).toBe('linked');
		expect(pending.outcome).toBe('pending');
		expect(pending.package).toBe('@scope/pkg');
		expect(pending.target).toBe('1.2.3');
		expect(pending.message()).toContain('@scope/pkg');
	});
});
