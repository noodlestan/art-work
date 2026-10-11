import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCheckoutScanMock } from '../../test/helpers/checkout/makeCheckoutScanMock.js';
import { makeWorkspaceCheckoutMock } from '../../test/helpers/checkout/makeWorkspaceCheckoutMock.js';

import { presentWorkspaceReport } from './presentWorkspaceReport.js';

afterEach(() => {
	vi.restoreAllMocks();
});

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('presentWorkspaceReport', () => {
	it('WHEN a workspace is presented it prints the header and field list', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(makeWorkspaceCheckoutMock('/tmp'));

		expect(infoSpy).toHaveBeenCalledWith('Workspace:');
		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('remote:'));
		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('path:'));
		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('branch:'));
		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('issues:'));
		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('main'));
	});

	it('WHEN the workspace has issues it prints them in the issues field', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: makeCheckoutScanMock(['ahead', 'uncommitted']),
			}),
		);

		expect(infoSpy).toHaveBeenCalledWith(
			expect.stringContaining('uncommitted files; 1 commit ahead'),
		);
	});

	it('WHEN the workspace is behind it renders the behind issue', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: makeCheckoutScanMock(['behind']),
			}),
		);

		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('1 commit behind'));
	});

	it('WHEN the workspace is undefined it returns early', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(undefined);

		expect(infoSpy).not.toHaveBeenCalledWith('Workspace:');
	});

	it('WHEN the workspace has no remote it shows none for remote', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: makeCheckoutScanMock(['no-remote']),
			}),
		);

		expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('remote: none'));
	});
});
