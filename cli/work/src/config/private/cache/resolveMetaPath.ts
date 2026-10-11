import { join } from 'node:path';

import { META_FILE } from './constants.js';
import { resolveCacheDir } from './resolveCacheDir.js';

export function resolveMetaPath(rootPath: string): string {
	return join(resolveCacheDir(rootPath), META_FILE);
}
