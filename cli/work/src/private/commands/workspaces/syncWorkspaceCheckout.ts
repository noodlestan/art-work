import type { WorkspaceContext } from '../../context/createWorkspaceContext.js';
import type { Checkout } from '../../store/createCheckout.js';

import { doPullWorkspaceCheckout } from './doPullWorkspaceCheckout.js';
import { doPushWorkspaceCheckout } from './doPushWorkspaceCheckout.js';

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
