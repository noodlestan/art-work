import { join } from 'path/posix';

import { resolveCacheDir } from './resolveCacheDir.js';
import { BUNDLE_FILE } from './resolveMetaPath.js';

export function resolveBundlePath(rootPath: string): string {
	return join(resolveCacheDir(rootPath), BUNDLE_FILE);
}
