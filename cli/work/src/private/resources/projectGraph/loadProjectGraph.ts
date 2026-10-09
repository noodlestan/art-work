import type { WorkspaceConfig } from '../../../config/index.js';
import { loadNamespaceRecords } from '../namespace/loadNamespaceRecords.js';
import { loadPackageRecords } from '../package/loadPackageRecords.js';
import { loadProjectRecords } from '../project/loadProjectRecords.js';
import type { ProjectGraph } from '../types.js';

import { consolidateProjectGraph } from './consolidateProjectGraph.js';

export async function loadProjectGraph(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<ProjectGraph> {
	const [projects, namespaces, packages] = await Promise.all([
		loadProjectRecords(config, checkoutPath),
		loadNamespaceRecords(config, checkoutPath),
		loadPackageRecords(config, checkoutPath),
	]);
	return consolidateProjectGraph(projects, namespaces, packages);
}
