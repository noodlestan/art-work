import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createUnlinkOperation } from './createUnlinkOperation';

describe('createUnlinkOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createUnlinkOperation(checkout, '@scope/pkg', '1.2.3');
		expect(pending.operation).toBe('unlink');
		expect(pending.outcome).toBe('pending');
		expect(pending.package).toBe('@scope/pkg');
		expect(pending.source).toBe('1.2.3');
		expect(pending.message()).toContain('@scope/pkg');
	});
});
