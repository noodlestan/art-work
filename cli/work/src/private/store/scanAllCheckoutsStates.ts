import { runWithConcurrency } from '../async/runWithConcurrency';
import type { WorkspaceContext } from '../context/createWorkspaceContext';
import { createGenericOperation } from '../operations/createGenericOperation';
import { scanCheckoutState } from '../scan/scanCheckoutState';

export async function scanAllCheckoutsStates(
	ctx: WorkspaceContext,
	refetch = false,
): Promise<void> {
	ctx.log.log(createGenericOperation('scan-all-checkouts'));
	await runWithConcurrency(ctx.store.getAllCheckouts(), 4, async checkout => {
		const updated = await scanCheckoutState(ctx, checkout, refetch);
		ctx.store.updateCheckout(updated);
	});
}
