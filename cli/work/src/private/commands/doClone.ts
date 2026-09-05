import type { WorkspaceContext } from '../context/createWorkspaceContext';
import { cloneCheckout } from '../git/cloneCheckout';
import { getCurrentBranch } from '../git/getCurrentBranch';
import { createOperationFailure } from '../operations/createOperationFailure';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import { saveCheckoutRecord } from '../resources/checkout/saveCheckoutRecord';
import { scanCheckoutState } from '../scan/scanCheckoutState';
import type { Checkout } from '../store/createCheckout';

import { createCloneOperation } from './operations/createCloneOperation';

export async function doClone(ctx: WorkspaceContext, checkout: Checkout): Promise<Checkout | null> {
	if (!checkout.repo) return null;

	const pending = createCloneOperation(checkout);
	try {
		ctx.log.log(pending);
		await cloneCheckout(checkout);
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
