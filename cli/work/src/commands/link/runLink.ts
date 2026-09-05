import { createLinkedOperation } from '../../private/commands/operations/createLinkedOperation';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runLink(ctx: WorkspaceContext, _options: { root: string }): Promise<void> {
	ctx.log.log(createGenericOperation('command', ['link']));
	ctx.log.log(createLinkedOperation(ctx.workspace, '', ''));
	// TODO: implement link command
	console.info('link command - TODO');
}
