import { join } from 'node:path';

import { resolveCacheDir } from './resolveCacheDir.js';

export const CACHE_DIR = ['node_modules', '.art-work'] as const;
export const BUNDLE_FILE = 'config.bundle.mjs';
export const META_FILE = 'config.cache.json';
export const CACHE_META_VERSION = 1;

export function resolveMetaPath(rootPath: string): string {
	return join(resolveCacheDir(rootPath), META_FILE);
}
