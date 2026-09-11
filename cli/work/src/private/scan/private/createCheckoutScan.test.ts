import { describe, expect, it } from 'vitest';

import { createCommittedState } from '../states/createCommittedState';
import { createExistsState } from '../states/createExistsState';
import { createGitDirState } from '../states/createGitDirState';
import { createNoConflictsState } from '../states/createNoConflictsState';
import { createNoDetachedState } from '../states/createNoDetachedState';
import { createRemoteState } from '../states/createRemoteState';
import { createRepoState } from '../states/createRepoState';
import { createSyncState } from '../states/createSyncState';
import { createWrongRemoteState } from '../states/createWrongRemoteState';

import { createCheckoutScan } from './createCheckoutScan';

describe('createCheckoutScan', () => {
	it('issues returns empty array for a clean in-sync checkout', () => {
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

	it('issues flags unknown project when repo is not known', () => {
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

	it('issues returns not cloned when checkout does not exist', () => {
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

	it('issues flags no git when git-dir is missing', () => {
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

	it('issues flags wrong branch when branch does not match expected', () => {
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

	it('issues flags detached HEAD', () => {
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

	it('issues flags merge conflicts', () => {
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

	it('issues flags no remote', () => {
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

	it('issues flags wrong remote', () => {
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

	it('issues flags uncommitted files', () => {
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

	it('issues flags ahead commits', () => {
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

	it('issues flags behind commit singular', () => {
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

	it('can clone when checkout does not exist', () => {
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

	it('can branch when exists and attached', () => {
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

	it('cannot branch when detached', () => {
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

	it('should clone when checkout does not exist', () => {
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

	it('should pull when behind', () => {
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

	it('should push when ahead', () => {
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
