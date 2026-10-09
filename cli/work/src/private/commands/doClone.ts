import type { WorkspaceContext } from '../context/createWorkspaceContext.js';
import { cloneCheckout } from '../git/cloneCheckout.js';
import { getCurrentBranch } from '../git/getCurrentBranch.js';
import { createOperationFailure } from '../operations/createOperationFailure.js';
import { createOperationSuccess } from '../operations/createOperationSuccess.js';
import { saveCheckoutRecord } from '../resources/checkout/saveCheckoutRecord.js';
import { scanCheckoutState } from '../scan/scanCheckoutState.js';
import type { Checkout } from '../store/createCheckout.js';

import { createCloneOperation } from './operations/createCloneOperation.js';

export async function doClone(ctx: WorkspaceContext, checkout: Checkout): Promise<Checkout | null> {
	if (!checkout.repo) return null;

	const pending = createCloneOperation(checkout);
	try {
		ctx.log.log(pending);
		await cloneCheckout(checkout.repo.remote, checkout.path, checkout.record.branch);
		const rescan = await scanCheckoutState(ctx, checkout);
		ctx.store.updateCheckout(rescan);
		ctx.log.log(createOperationSuccess(createCloneOperation(rescan)));

		const actualBranch = await getCurrentBranch(checkout.path);
		await saveCheckoutRecord(ctx.config, {
			name: rescan.record.name,
			repository: rescan.repo?.name,
			location: rescan.record.location,
			branch: actualBranch || rescan.record.branch || 'main',
		});

		return rescan;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
