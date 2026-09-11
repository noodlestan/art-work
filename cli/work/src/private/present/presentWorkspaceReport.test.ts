import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCheckoutScanMock } from '../../test/helpers/checkout/createCheckoutScanMock';
import { makeWorkspaceCheckoutMock } from '../../test/helpers/checkout/makeWorkspaceCheckoutMock';

import { presentWorkspaceReport } from './presentWorkspaceReport';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('presentWorkspaceReport', () => {
	it('prints Workspace: header and field list', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(makeWorkspaceCheckoutMock('/tmp'));

		expect(spy).toHaveBeenCalledWith('Workspace:');
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('remote:'));
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('path:'));
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('branch:'));
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('issues:'));
		expect(spy).toHaveBeenCalledWith(expect.stringContaining('main'));
	});

	it('prints issues in issues field', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: createCheckoutScanMock(['ahead', 'uncommitted']),
			}),
		);

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('uncommitted files; 1 commit ahead'));
	});

	it('renders the behind issue in the issues field', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: createCheckoutScanMock(['behind']),
			}),
		);

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('1 commit behind'));
	});

	it('returns early when workspace is undefined', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(undefined);

		expect(spy).not.toHaveBeenCalledWith('Workspace:');
	});

	it('shows "none" for remote when workspace has no remote', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: createCheckoutScanMock(['no-remote']),
			}),
		);

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('remote: none'));
	});
});
