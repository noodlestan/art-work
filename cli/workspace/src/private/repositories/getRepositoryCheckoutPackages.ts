import type { PackageStateRecord, ProjectGraph } from '../resources/types.js';

import { createPackageStateRecord } from './createPackageStateRecord.js';
import { scanPackageStateRecord } from './scanPackageStateRecord.js';

export function getRepositoryCheckoutPackages(
	checkoutPath: string,
	graph: ProjectGraph,
): PackageStateRecord[] {
	const packageStates: PackageStateRecord[] = [];

	for (const project of graph.projects) {
		for (const nsName of project.namespaceNames) {
			const ns = graph.namespaces.get(nsName);
			if (!ns) continue;
			for (const pkgName of ns.packageNames) {
				const pkg = graph.packages.get(pkgName);
				if (!pkg) continue;

				const { record } = createPackageStateRecord(checkoutPath, project.path, ns.path, pkg);
				scanPackageStateRecord(pkg, record);
				packageStates.push(record);
			}
		}
	}

	return packageStates;
}
