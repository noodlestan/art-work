import { runWithConcurrency } from '../../../private/async/runWithConcurrency';
import { doPushCheckout } from '../../../private/commands/checkouts/doPushCheckout';
import type { WorkspaceContext } from '../../../private/context/createWorkspaceContext';

export async function syncCheckouts(ctx: WorkspaceContext): Promise<void> {
	await runWithConcurrency(ctx.store.getAllCheckouts(), 4, async checkout => {
		if (!checkout.scan?.can?.('push') || !checkout.scan.should?.('push')) return;
		await doPushCheckout(ctx, checkout);
	});
}
