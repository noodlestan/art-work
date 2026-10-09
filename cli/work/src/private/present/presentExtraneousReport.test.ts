import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCheckoutScanMock } from '../../test/helpers/checkout/makeCheckoutScanMock.js';
import type { Checkout } from '../store/createCheckout.js';

import { presentExtraneousReport } from './presentExtraneousReport.js';

afterEach(() => {
	vi.restoreAllMocks();
});

function makeCheckout(overrides?: Partial<Checkout>): Checkout {
	return {
		repo: undefined,
		record: { name: 'orphan', location: 'orphan', branch: 'main', repository: undefined },
		path: '/tmp/orphan',
		scan: makeCheckoutScanMock(['no-remote']),
		...overrides,
	};
}

describe('presentExtraneousReport', () => {
	it('no output when no extraneous checkouts', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentExtraneousReport([]);

		expect(spy).not.toHaveBeenCalled();
	});

	it('prints Untracked: when extraneous exist', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const extraneous = [makeCheckout()];

		presentExtraneousReport(extraneous);

		expect(spy).toHaveBeenCalledWith('Untracked:');
	});
});
