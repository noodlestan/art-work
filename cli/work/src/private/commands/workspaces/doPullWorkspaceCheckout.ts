import simpleGit from 'simple-git';

import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';
import { scanCheckoutState } from '../../scan/scanCheckoutState';
import type { Checkout } from '../../store/createCheckout';
import { createPullOperation } from '../operations/createPullOperation';

export async function doPullWorkspaceCheckout(ctx: WorkspaceContext): Promise<Checkout | null> {
	const workspace = ctx.workspace;
	if (!workspace) return null;
	if (!workspace.scan?.can?.('pull') || !workspace.scan.should?.('pull')) return null;

	const pending = createPullOperation(workspace, workspace.record.branch);
	const git = simpleGit(workspace.path);
	try {
		ctx.log.log(pending);
		await git.pull('origin', workspace.record.branch);
		const updated = await scanCheckoutState(ctx, workspace, true);
		ctx.workspace = updated;
		ctx.log.log(createOperationSuccess(pending));
		return updated;
	} catch (error) {
		ctx.log.log(
			createOperationFailure(createPullOperation(workspace, workspace.record.branch), error),
		);
		return null;
	}
}
