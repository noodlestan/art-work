import { readFile } from 'node:fs/promises';

import type { ConfigCacheMeta } from '../types.js';

import { isConfigCacheMeta } from './isConfigCacheMeta.js';

export async function readConfigCacheMeta(metaPath: string): Promise<ConfigCacheMeta | null> {
	let content: string;

	try {
		content = await readFile(metaPath, 'utf8');
	} catch {
		return null;
	}

	let parsed: unknown;

	try {
		parsed = JSON.parse(content);
	} catch {
		return null;
	}

	if (!isConfigCacheMeta(parsed)) {
		return null;
	}

	return parsed;
}
