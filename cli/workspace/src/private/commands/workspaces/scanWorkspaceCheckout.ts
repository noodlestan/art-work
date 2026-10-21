import type { WorkspaceContext } from '../../context/createWorkspaceContext.js';
import { scanCheckoutState } from '../../scan/scanCheckoutState.js';
import type { Checkout } from '../../store/createCheckout.js';
import { createCheckout } from '../../store/createCheckout.js';

export async function scanWorkspaceCheckout(
	ctx: WorkspaceContext,
	refetch = false,
): Promise<Checkout | null> {
	const workspaceCheckout = {
		...createCheckout(ctx.config, '.', undefined, 'main', 'Workspace'),
		path: ctx.config.root.path,
	};
	const workspace = await scanCheckoutState(ctx, workspaceCheckout, refetch);
	ctx.workspace = workspace;
	return workspace;
}
