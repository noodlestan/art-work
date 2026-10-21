import { isAbsolute, resolve } from 'node:path';

import { DEFAULT_RECORDS_STORE_OPTIONS } from './constants.js';
import { normalizeRecordPaths } from './private/normalizeRecordPaths.js';
import type { PartialWorkspaceConfig, WorkspaceConfig } from './types.js';

export function defineConfig(config: PartialWorkspaceConfig): WorkspaceConfig {
	const rootPath = config.root?.path || process.cwd();
	const checkoutsPath = config.checkouts?.path || 'checkouts';
	const checkoutTemplatePath =
		config.data?.template || '.agents/domains/workspace/templates/checkout.art.njk';
	const recordsPaths = normalizeRecordPaths(config.discover?.records);
	const storeOptions = config.data?.store ?? DEFAULT_RECORDS_STORE_OPTIONS;
	const storeBasePath = isAbsolute(storeOptions.basePath)
		? storeOptions.basePath
		: resolve(rootPath, storeOptions.basePath);

	return {
		root: {
			path: rootPath,
		},
		checkouts: {
			path: checkoutsPath,
		},
		data: {
			store: { ...storeOptions, basePath: storeBasePath },
			template: checkoutTemplatePath,
		},
		discover: {
			records: {
				paths: recordsPaths,
			},
		},
	};
}
