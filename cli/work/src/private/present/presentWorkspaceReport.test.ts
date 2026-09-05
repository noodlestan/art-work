import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeWorkspaceCheckoutMock } from '../../test/helpers/checkout/makeWorkspaceCheckoutMock';
import {
	createCheckoutScan,
	createCommittedState,
	createExistsState,
	createNoConflictsState,
	createNoDetachedState,
	createRemoteState,
	createRepoState,
	createSyncState,
	createWrongRemoteState,
} from '../scan/types';

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
				scan: createCheckoutScan([
					createRepoState(false),
					createExistsState(true),
					createRemoteState('main', 'main', true),
					createSyncState(1, 1, 0),
					createCommittedState(false),
					createNoConflictsState(true),
					createNoDetachedState(true),
					createWrongRemoteState(false),
				]),
			}),
		);

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('uncommitted files; 1 commit ahead'));
	});

	it('renders the behind issue in the issues field', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

		presentWorkspaceReport(
			makeWorkspaceCheckoutMock('/tmp', {
				scan: createCheckoutScan([
					createRepoState(false),
					createExistsState(true),
					createRemoteState('main', 'main', true),
					createSyncState(-1, 0, 1),
					createCommittedState(true),
					createNoConflictsState(true),
					createNoDetachedState(true),
					createWrongRemoteState(false),
				]),
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
				scan: createCheckoutScan([
					createRepoState(false),
					createExistsState(true),
					createRemoteState('main', 'main', false),
					createSyncState(0),
					createCommittedState(true),
					createNoConflictsState(true),
					createNoDetachedState(true),
					createWrongRemoteState(false),
				]),
			}),
		);

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('remote: none'));
	});
});
