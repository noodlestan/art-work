import {
	type CheckoutScan,
	createCheckoutScan,
	createCommittedState,
	createExistsState,
	createGitDirState,
	createNoConflictsState,
	createNoDetachedState,
	createRemoteState,
	createRepoState,
	createSyncState,
	createWrongRemoteState,
} from '../../../private/scan/types';

export type CheckoutScanScenario = 'default' | 'ahead' | 'behind' | 'uncommitted' | 'no-remote';

export function createCheckoutScanMock(scenarios: CheckoutScanScenario[] = []): CheckoutScan {
	const has = (scenario: CheckoutScanScenario) => scenarios.includes(scenario);

	const ahead = has('ahead') ? 1 : 0;
	const behind = has('behind') ? 1 : 0;
	const dirty = has('uncommitted');
	const hasRemote = !has('no-remote');

	return createCheckoutScan([
		createRepoState(false),
		createGitDirState(true),
		createExistsState(true),
		createRemoteState('main', 'main', hasRemote),
		createSyncState(ahead - behind, ahead, behind),
		createCommittedState(!dirty),
		createNoConflictsState(true),
		createNoDetachedState(true),
		createWrongRemoteState(false),
	]);
}
