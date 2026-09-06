import { access } from 'node:fs/promises';

import type { WorkspaceContext } from '../context/createWorkspaceContext';
import { getBehindAheadCount } from '../git/getBehindAheadCount';
import { getCurrentBranch } from '../git/getCurrentBranch';
import { getRemoteBranch } from '../git/getRemoteBranch';
import { getRemoteUrl } from '../git/getRemoteUrl';
import { hasMergeConflicts } from '../git/hasMergeConflicts';
import { hasRemote } from '../git/hasRemote';
import { isDetachedHead } from '../git/isDetachedHead';
import { isDirty } from '../git/isDirty';
import { remoteFetch } from '../git/remoteFetch';
import { createGenericOperation } from '../operations/createGenericOperation';
import { createOperationFailure } from '../operations/createOperationFailure';
import type { Checkout } from '../store/types';

import {
	createCheckoutNoClonedScan,
	createCheckoutScan,
	createCommittedState,
	createExistsState,
	createNoConflictsState,
	createNoDetachedState,
	createRemoteState,
	createRepoState,
	createSyncState,
	createWrongRemoteState,
} from './types';

export async function scanCheckoutState(
	ctx: WorkspaceContext,
	checkout: Checkout,
	refetch = false,
): Promise<Checkout> {
	try {
		await access(checkout.path);
	} catch {
		return { ...checkout, scan: createCheckoutNoClonedScan(Boolean(checkout.repo)) };
	}

	ctx.log.log(createGenericOperation('scan-checkout-state', checkout.record.location));

	let branch: string | null = null;
	let remoteBranch: string | null = null;
	let remote = false;
	let dirty = false;
	let conflicts = false;
	let detached = false;
	let ahead = 0;
	let behind = 0;
	let wrongRemote = false;
	try {
		branch = await getCurrentBranch(checkout.path);
		remote = await hasRemote(checkout.path);
		detached = await isDetachedHead(checkout.path);
		conflicts = await hasMergeConflicts(checkout.path);
		dirty = await isDirty(checkout.path);
		if (remote && branch !== '-' && branch !== 'HEAD') {
			remoteBranch = await getRemoteBranch(checkout.path);
			if (refetch) await remoteFetch(checkout.path);
			const { ahead: aheadCount, behind: behindCount } = await getBehindAheadCount(
				checkout.path,
				remoteBranch,
			);
			ahead = aheadCount;
			behind = behindCount;
		}
		if (remote && checkout.repo?.remote) {
			const actualUrl = await getRemoteUrl(checkout.path);
			if (actualUrl && actualUrl !== checkout.repo.remote) {
				wrongRemote = true;
			}
		}
	} catch (error) {
		ctx.log.log(
			createOperationFailure(
				createGenericOperation('scan-checkout-state', checkout.record.location),
				error,
			),
		);
	}

	const remoteState = createRemoteState(branch, checkout.record.branch, remote);
	const scan = createCheckoutScan([
		createRepoState(Boolean(checkout.repo)),
		createExistsState(true),
		remoteState,
		createSyncState(ahead - behind, ahead, behind),
		createCommittedState(!dirty),
		createNoConflictsState(!conflicts),
		createNoDetachedState(!detached),
		createWrongRemoteState(wrongRemote),
	]);
	return { ...checkout, scan };
}
