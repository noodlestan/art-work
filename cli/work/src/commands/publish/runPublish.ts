import { createPublishOperation } from '../../private/commands/operations/createPublishOperation';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runPublish(
	ctx: WorkspaceContext,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_options: { root: string; auto?: boolean },
): Promise<void> {
	ctx.log.log(createGenericOperation('command', ['publish', _options.auto]));
	ctx.log.log(createPublishOperation(ctx.workspace, '', ''));
	// TODO: implement publish command
	console.info('publish command - TODO');
}
