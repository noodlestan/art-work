import { loadWorkspaceConfig } from '../../config/loadWorkspaceConfig.js';
import type { WorkspaceConfig } from '../../config/types.js';
import type { LoggerAPI as Logger } from '../logger/createLogger.js';
import { createGenericOperation } from '../operations/createGenericOperation.js';

export async function createConfig(
	logger: Logger,
	root: string,
	options?: { cache?: boolean; verbose?: boolean },
): Promise<WorkspaceConfig> {
	logger.log(createGenericOperation('locate-config'));
	// WIP: Config discovery next.
	logger.log(createGenericOperation('load-config'));
	return await loadWorkspaceConfig(root, options);
}
