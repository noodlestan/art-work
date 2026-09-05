import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { pullCheckout } from '../../git/pullCheckout';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';
import { scanCheckoutState } from '../../scan/scanCheckoutState';
import type { Checkout } from '../../store/createCheckout';
import { createPullOperation } from '../operations/createPullOperation';

export async function doPullCheckout(
	ctx: WorkspaceContext,
	checkout: Checkout,
): Promise<Checkout | null> {
	const pending = createPullOperation(checkout, checkout.record.branch);
	try {
		ctx.log.log(pending);
		await pullCheckout(checkout);
		const updated = await scanCheckoutState(ctx, checkout, true);
		ctx.store.updateCheckout(updated);
		ctx.log.log(createOperationSuccess(pending));
		return updated;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
