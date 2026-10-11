import { join } from 'node:path';

export const CACHE_DIR = ['node_modules', '.art-work'] as const;
export const BUNDLE_FILE = 'config.bundle.mjs';
export const META_FILE = 'config.cache.json';

export function resolveCacheDir(rootPath: string): string {
	return join(rootPath, ...CACHE_DIR);
}

export function resolveBundlePath(rootPath: string): string {
	return join(resolveCacheDir(rootPath), BUNDLE_FILE);
}
