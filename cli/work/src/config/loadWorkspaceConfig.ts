import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig } from './defineConfig.js';
import { compileConfigBundle } from './private/compileConfigBundle.js';
import { findReusableBundlePath } from './private/findReusableBundlePath.js';
import { importConfigBundle } from './private/importConfigBundle.js';
import { removeLegacyBundle } from './private/removeLegacyBundle.js';
import type { PartialWorkspaceConfig, WorkspaceConfig } from './types.js';

const MANIFEST_FILE = '.art-workspace.mts';

const DEFAULT_CONFIG: PartialWorkspaceConfig = {
	clone: { path: 'checkouts' },
	checkouts: {
		path: '_records/',
		template: '.agents/domains/workspace/templates/checkout.art.njk',
	},
	records: {
		base: '.',
		pattern: '*.art',
		ignored: ['node_modules/', '.git/', 'dist/'],
		excluded: [],
		gitignore: true,
	},
};

export async function loadWorkspaceConfig(
	rootPath: string,
	options?: { cache?: boolean },
): Promise<WorkspaceConfig> {
	const manifestPath = join(rootPath, MANIFEST_FILE);

	if (!existsSync(manifestPath)) {
		console.warn(`${MANIFEST_FILE} not found at ${rootPath}; Using default config.`);
		return defineConfig({ ...DEFAULT_CONFIG, root: { path: rootPath } });
	}

	const useCache = options?.cache !== false;

	let reusableBundlePath: string | null = null;

	if (useCache) {
		reusableBundlePath = await findReusableBundlePath(rootPath);
	}

	if (reusableBundlePath !== null) {
		console.info('config: reused cached bundle');
	}

	const bundlePath = reusableBundlePath ?? (await compileConfigBundle(rootPath, manifestPath));

	if (!useCache) {
		console.info('config: cache bypassed,rebuilt bundle');
	}

	removeLegacyBundle(rootPath);

	return importConfigBundle(bundlePath, manifestPath, rootPath);
}
