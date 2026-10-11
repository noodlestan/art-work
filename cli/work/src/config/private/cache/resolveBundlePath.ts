import { join } from 'path/posix';

import { BUNDLE_FILE } from './constants.js';
import { resolveCacheDir } from './resolveCacheDir.js';

export function resolveBundlePath(rootPath: string): string {
	return join(resolveCacheDir(rootPath), BUNDLE_FILE);
}
