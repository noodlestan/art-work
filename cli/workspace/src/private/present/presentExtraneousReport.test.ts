import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('presentExtraneousReport', () => {
	it('WHEN there are no extraneous checkouts it prints no output', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentExtraneousReport([]);

		expect(infoSpy).not.toHaveBeenCalled();
	});

	it('WHEN extraneous checkouts exist it prints Untracked', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const extraneous = [makeCheckout()];

		presentExtraneousReport(extraneous);

		expect(infoSpy).toHaveBeenCalledWith('Untracked:');
	});
});
