import { readFile } from 'node:fs/promises';

import { CACHE_META_VERSION } from '../cache.js';
import type { ConfigCacheInput, ConfigCacheMeta } from '../types.js';

function isConfigCacheInput(value: unknown): value is ConfigCacheInput {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const input = value as Record<string, unknown>;

	return typeof input.path === 'string' && typeof input.hash === 'string';
}

function isConfigCacheMeta(value: unknown): value is ConfigCacheMeta {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const meta = value as Record<string, unknown>;

	return (
		meta.version === CACHE_META_VERSION &&
		typeof meta.compiledAt === 'string' &&
		typeof meta.manifest === 'string' &&
		Array.isArray(meta.inputs) &&
		meta.inputs.every(isConfigCacheInput)
	);
}

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
