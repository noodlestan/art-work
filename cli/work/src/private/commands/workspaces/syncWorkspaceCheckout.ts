import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import type { Checkout } from '../../store/createCheckout';

import { doPullWorkspaceCheckout } from './doPullWorkspaceCheckout';
import { doPushWorkspaceCheckout } from './doPushWorkspaceCheckout';

export async function syncWorkspaceCheckout(ctx: WorkspaceContext): Promise<Checkout | null> {
	const pulled = await doPullWorkspaceCheckout(ctx);
	if (!pulled) {
		return ctx.workspace as Checkout;
	}
	ctx.workspace = pulled;

	const pushed = await doPushWorkspaceCheckout(ctx);
	if (!pushed) {
		return ctx.workspace;
	}
	ctx.workspace = pushed;

	return pushed;
}
