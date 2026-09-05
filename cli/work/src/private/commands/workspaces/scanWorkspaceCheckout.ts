import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { scanCheckoutState } from '../../scan/scanCheckoutState';
import type { Checkout } from '../../store/createCheckout';
import { createCheckout } from '../../store/createCheckout';

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
