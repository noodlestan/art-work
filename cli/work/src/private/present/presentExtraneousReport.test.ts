import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCheckoutScanMock } from '../../test/helpers/checkout/createCheckoutScanMock';
import type { Checkout } from '../store/createCheckout';

import { presentExtraneousReport } from './presentExtraneousReport';

afterEach(() => {
	vi.restoreAllMocks();
});

function makeCheckout(overrides?: Partial<Checkout>): Checkout {
	return {
		repo: undefined,
		record: { name: 'orphan', location: 'orphan', branch: 'main', repository: undefined },
		path: '/tmp/orphan',
		scan: createCheckoutScanMock(['no-remote']),
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
