import { join } from 'node:path';

type ConfigCachePaths = {
	cacheDir: string;
	bundlePath: string;
	metaPath: string;
};

/** @provides expected config cache paths for test assertions. */
export function makeConfigCachePaths(rootPath: string): ConfigCachePaths {
	const cacheDir = join(rootPath, 'node_modules', '.art-workspace');
	const bundlePath = join(cacheDir, 'config.bundle.mjs');
	const metaPath = join(cacheDir, 'config.cache.json');

	return {
		cacheDir,
		bundlePath,
		metaPath,
	};
}
