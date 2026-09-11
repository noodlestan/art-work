import { describe, expect, it } from 'vitest';

import { makeCheckoutMock } from '../../../test/helpers/checkout/makeCheckoutMock';

import { createPublishOperation } from './createPublishOperation';

describe('createPublishOperation', () => {
	it('has correct operation, outcome and message', () => {
		const checkout = makeCheckoutMock();
		const pending = createPublishOperation(checkout, '@scope/pkg', '1.2.3');
		expect(pending.operation).toBe('publish');
		expect(pending.outcome).toBe('pending');
		expect(pending.package).toBe('@scope/pkg');
		expect(pending.version).toBe('1.2.3');
		expect(pending.message()).toContain('@scope/pkg@1.2.3');
	});
});
