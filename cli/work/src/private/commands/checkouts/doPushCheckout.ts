import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { pushCheckout } from '../../git/pushCheckout';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';
import { scanCheckoutState } from '../../scan/scanCheckoutState';
import type { Checkout } from '../../store/createCheckout';
import { createPushOperation } from '../operations/createPushOperation';

export async function doPushCheckout(
	ctx: WorkspaceContext,
	checkout: Checkout,
): Promise<Checkout | null> {
	const pending = createPushOperation(checkout, checkout.record.branch);
	try {
		ctx.log.log(pending);
		await pushCheckout(checkout);
		const updated = await scanCheckoutState(ctx, checkout, true);
		ctx.store.updateCheckout(updated);
		ctx.log.log(createOperationSuccess(pending));
		return updated;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
