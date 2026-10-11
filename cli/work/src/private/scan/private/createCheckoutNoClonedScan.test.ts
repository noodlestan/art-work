import { describe, expect, it } from 'vitest';

import { createCheckoutNoClonedScan } from './createCheckoutNoClonedScan.js';

describe('createCheckoutNoClonedScan', () => {
	it('FOR a known repo it returns a scan with a not cloned issue', () => {
		const scan = createCheckoutNoClonedScan(true);
		expect(scan.state('exists').exists).toBe(false);
		expect(scan.issues()).toContain('not cloned');
		expect(scan.issues()).not.toContain('unknown project');
	});

	it('FOR an unknown repo it returns a scan with unknown project and not cloned', () => {
		const scan = createCheckoutNoClonedScan(false);
		expect(scan.issues()).toContain('unknown project');
		expect(scan.issues()).toContain('not cloned');
	});
});
