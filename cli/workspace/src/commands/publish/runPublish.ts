import { createPublishOperation } from '../../private/commands/operations/createPublishOperation.js';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext.js';
import { createGenericOperation } from '../../private/operations/createGenericOperation.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runPublish(
	ctx: WorkspaceContext,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options: { root: string; auto?: boolean },
): Promise<void> {
	ctx.log.log(createGenericOperation('command', ['publish', options]));
	ctx.log.log(createPublishOperation(ctx.workspace, '', ''));
	// TODO: implement publish command
	console.info('publish command - TODO');
}
