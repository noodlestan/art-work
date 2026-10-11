import { join } from 'path/posix';

import { CACHE_DIR } from './resolveMetaPath.js';

export function resolveCacheDir(rootPath: string): string {
	return join(rootPath, ...CACHE_DIR);
}
