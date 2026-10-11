import { realpathSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { CACHE_META_VERSION } from '../cache.js';
import type { ConfigCacheMeta } from '../types.js';

import { hashConfigInputs } from './hashConfigInputs.js';

export async function makeConfigCacheMeta(
	rootPath: string,
	manifestPath: string,
	metafileInputPaths: string[],
): Promise<ConfigCacheMeta> {
	const realRootPath = realpathSync(rootPath);
	const inputPaths = metafileInputPaths.map(inputPath =>
		relative(realRootPath, resolve(inputPath)),
	);
	const inputs = await hashConfigInputs(rootPath, inputPaths);

	return {
		version: CACHE_META_VERSION,
		compiledAt: new Date().toISOString(),
		manifest: manifestPath,
		inputs,
	};
}
