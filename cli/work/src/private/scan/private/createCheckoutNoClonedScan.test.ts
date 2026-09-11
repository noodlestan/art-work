import { describe, expect, it } from 'vitest';

import { createCheckoutNoClonedScan } from './createCheckoutNoClonedScan';

describe('createCheckoutNoClonedScan', () => {
	it('returns scan with not cloned issue for known repo', () => {
		const scan = createCheckoutNoClonedScan(true);
		expect(scan.state('exists').exists).toBe(false);
		expect(scan.issues()).toContain('not cloned');
		expect(scan.issues()).not.toContain('unknown project');
	});

	it('returns scan with unknown project and not cloned for unknown repo', () => {
		const scan = createCheckoutNoClonedScan(false);
		expect(scan.issues()).toContain('unknown project');
		expect(scan.issues()).toContain('not cloned');
	});
});
