import type { ConfigCacheInput } from '../types.js';

import { hashConfigInputs } from './hashConfigInputs.js';

export async function tryHashConfigInputs(
	rootPath: string,
	inputPaths: string[],
): Promise<ConfigCacheInput[] | null> {
	try {
		return await hashConfigInputs(rootPath, inputPaths);
	} catch {
		return null;
	}
}
