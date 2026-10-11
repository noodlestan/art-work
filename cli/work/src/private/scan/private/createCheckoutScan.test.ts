import { describe, expect, it } from 'vitest';

import { createCommittedState } from '../states/createCommittedState.js';
import { createExistsState } from '../states/createExistsState.js';
import { createGitDirState } from '../states/createGitDirState.js';
import { createNoConflictsState } from '../states/createNoConflictsState.js';
import { createNoDetachedState } from '../states/createNoDetachedState.js';
import { createRemoteState } from '../states/createRemoteState.js';
import { createRepoState } from '../states/createRepoState.js';
import { createSyncState } from '../states/createSyncState.js';
import { createWrongRemoteState } from '../states/createWrongRemoteState.js';

import { createCheckoutScan } from './createCheckoutScan.js';

describe('createCheckoutScan', () => {
	it('WHEN a checkout is clean and synchronized with origin, its scan reports no issues', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toEqual([]);
	});

	it('WHEN the repository is unknown, the scan reports an unknown project', () => {
		const scan = createCheckoutScan([
			createRepoState(false),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('unknown project');
	});

	it('WHEN the checkout directory is missing, the scan reports it as not cloned', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(false),
			createExistsState(false),
			createRemoteState(null, '', false),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('not cloned');
	});

	it('WHEN the checkout has no Git directory, the scan reports no Git repository', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(false),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('no git');
	});

	it('WHEN the current branch differs from the expected branch, the scan reports a wrong branch', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('develop', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('wrong branch');
	});

	it('WHEN HEAD is detached, the scan reports detached HEAD', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(false),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('detached HEAD');
	});

	it('WHEN the checkout has merge conflicts, the scan reports them', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(false),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('merge conflicts');
	});

	it('WHEN the remote is missing, the scan reports no remote', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState(null, 'main', false),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('no remote');
	});

	it('WHEN the checkout remote differs from the expected remote, the scan reports a mismatch', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(true),
		]);
		expect(scan.issues()).toContain('wrong remote');
	});

	it('WHEN the checkout has uncommitted changes, the scan reports uncommitted files', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(false),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('uncommitted files');
	});

	it('WHEN the checkout is ahead by two commits, the scan reports two commits ahead', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(2),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('2 commits ahead');
	});

	it('WHEN the checkout is behind by one commit, the scan reports one commit behind', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(-1),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.issues()).toContain('1 commit behind');
	});

	it('WHEN the checkout does not exist the scan can clone', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(false),
			createExistsState(false),
			createRemoteState(null, '', false),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.can('clone')).toBe(true);
		expect(scan.can('pull')).toBe(false);
	});

	it('WHEN the checkout exists and is attached the scan can branch', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.can('branch')).toBe(true);
	});

	it('WHEN the head is detached the scan cannot branch', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(false),
			createWrongRemoteState(false),
		]);
		expect(scan.can('branch')).toBe(false);
	});

	it('WHEN the checkout does not exist the scan should clone', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(false),
			createExistsState(false),
			createRemoteState(null, '', false),
			createSyncState(0),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.should('clone')).toBe(true);
	});

	it('WHEN the checkout is behind the scan should pull', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(-1),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.should('pull')).toBe(true);
		expect(scan.should('push')).toBe(false);
	});

	it('WHEN the checkout is ahead the scan should push', () => {
		const scan = createCheckoutScan([
			createRepoState(true),
			createGitDirState(true),
			createExistsState(true),
			createRemoteState('main', 'main', true),
			createSyncState(1),
			createCommittedState(true),
			createNoConflictsState(true),
			createNoDetachedState(true),
			createWrongRemoteState(false),
		]);
		expect(scan.should('push')).toBe(true);
		expect(scan.should('pull')).toBe(false);
	});
});
