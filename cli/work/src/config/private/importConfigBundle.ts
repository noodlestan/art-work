import { pathToFileURL } from 'node:url';

import { defineConfig } from '../defineConfig.js';
import type { PartialWorkspaceConfig, WorkspaceConfig } from '../types.js';

import { formatError } from './formatError.js';

export async function importConfigBundle(
	bundlePath: string,
	manifestPath: string,
	rootPath: string,
): Promise<WorkspaceConfig> {
	try {
		const loaded = await import(pathToFileURL(bundlePath).href);
		const config = loaded.default as PartialWorkspaceConfig;

		return defineConfig({ ...config, root: { path: rootPath } });
	} catch (error) {
		throw new Error(`Failed to load workspace manifest at ${manifestPath}: ${formatError(error)}`);
	}
}
