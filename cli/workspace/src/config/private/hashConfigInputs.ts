import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { ConfigCacheInput } from '../types.js';

export async function hashConfigInputs(
	rootPath: string,
	inputPaths: string[],
): Promise<ConfigCacheInput[]> {
	const cacheInputPromises = inputPaths.map(async inputPath => {
		const bytes = await readFile(resolve(rootPath, inputPath));
		const hash = createHash('sha256').update(bytes).digest('hex');
		return {
			path: inputPath,
			hash,
		};
	});
	return Promise.all(cacheInputPromises);
}
