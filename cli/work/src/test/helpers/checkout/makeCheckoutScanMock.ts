import { createCheckoutScan } from '../../../private/scan/private/createCheckoutScan';
import { createCommittedState } from '../../../private/scan/states/createCommittedState';
import { createExistsState } from '../../../private/scan/states/createExistsState';
import { createGitDirState } from '../../../private/scan/states/createGitDirState';
import { createNoConflictsState } from '../../../private/scan/states/createNoConflictsState';
import { createNoDetachedState } from '../../../private/scan/states/createNoDetachedState';
import { createRemoteState } from '../../../private/scan/states/createRemoteState';
import { createRepoState } from '../../../private/scan/states/createRepoState';
import { createSyncState } from '../../../private/scan/states/createSyncState';
import { createWrongRemoteState } from '../../../private/scan/states/createWrongRemoteState';
import type { CheckoutScan } from '../../../private/scan/types';

export type CheckoutScanScenario = 'default' | 'ahead' | 'behind' | 'uncommitted' | 'no-remote';

export function makeCheckoutScanMock(scenarios: CheckoutScanScenario[] = []): CheckoutScan {
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
