import { createCommittedState } from '../states/createCommittedState.js';
import { createExistsState } from '../states/createExistsState.js';
import { createGitDirState } from '../states/createGitDirState.js';
import { createNoConflictsState } from '../states/createNoConflictsState.js';
import { createNoDetachedState } from '../states/createNoDetachedState.js';
import { createRemoteState } from '../states/createRemoteState.js';
import { createRepoState } from '../states/createRepoState.js';
import { createSyncState } from '../states/createSyncState.js';
import type { CheckoutScan } from '../types.js';

import { createCheckoutScan } from './createCheckoutScan.js';

export function createCheckoutNoClonedScan(known: boolean): CheckoutScan {
	return createCheckoutScan([
		createRepoState(known),
		createGitDirState(false),
		createExistsState(false),
		createRemoteState(null, '', false),
		createSyncState(0),
		createCommittedState(true),
		createNoConflictsState(true),
		createNoDetachedState(true),
	]);
}
