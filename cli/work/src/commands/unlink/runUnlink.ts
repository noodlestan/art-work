import { createUnlinkOperation } from '../../private/commands/operations/createUnlinkOperation';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runUnlink(ctx: WorkspaceContext, _options: { root: string }): Promise<void> {
	ctx.log.log(createGenericOperation('command', ['unlink']));
	ctx.log.log(createUnlinkOperation(ctx.workspace, '', ''));
	// TODO: implement unlink command
	console.info('unlink command - TODO');
}
