import { createLinkedOperation } from '../../private/commands/operations/createLinkedOperation.js';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext.js';
import { createGenericOperation } from '../../private/operations/createGenericOperation.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runLink(ctx: WorkspaceContext, options: { root: string }): Promise<void> {
	ctx.log.log(createGenericOperation('command', ['link', options]));
	ctx.log.log(createLinkedOperation(ctx.workspace, '', ''));
	// TODO: implement link command
	console.info('link command - TODO');
}
