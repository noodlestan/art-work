import simpleGit from 'simple-git';

import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';
import { scanCheckoutState } from '../../scan/scanCheckoutState';
import type { Checkout } from '../../store/createCheckout';
import { createCheckout } from '../../store/createCheckout';
import { createPullOperation } from '../operations/createPullOperation';
import { createPushOperation } from '../operations/createPushOperation';

export async function syncWorkspaceCheckout(ctx: WorkspaceContext): Promise<Checkout | null> {
	let workspace = ctx.workspace;
	if (!workspace) {
		workspace = {
			...createCheckout(ctx.config, '.', undefined, 'main', 'Workspace'),
			path: ctx.config.root.path,
		};
		const scanned = await scanCheckoutState(ctx, workspace, true);
		ctx.workspace = scanned;
		workspace = scanned;
	}

	const git = simpleGit(workspace.path);

	// Pull
	if (workspace.scan?.can?.('pull')) {
		const pending = createPullOperation(workspace, workspace.record.branch);
		try {
			ctx.log.log(pending);
			await git.pull('origin', workspace.record.branch);
			ctx.log.log(createOperationSuccess(pending));
		} catch (error) {
			const op = createOperationFailure(pending, error);
			ctx.log.log(op);
			return null;
		}
	}

	// Push
	if (workspace.scan?.can?.('push')) {
		const pending = createPushOperation(workspace, workspace.record.branch);
		try {
			ctx.log.log(pending);
			await git.push('origin', workspace.record.branch);
			ctx.log.log(createOperationSuccess(pending));
		} catch (error) {
			const op = createOperationFailure(pending, error);
			ctx.log.log(op);
			return null;
		}
	}

	// Re-scan with refetch
	const updated = await scanCheckoutState(ctx, workspace, true);
	ctx.workspace = updated;
	return updated;
}
