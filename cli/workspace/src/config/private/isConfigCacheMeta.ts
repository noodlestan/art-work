import type { ConfigCacheMeta } from '../types.js';

import { CACHE_META_VERSION } from './cache/constants.js';
import { isConfigCacheInput } from './isConfigCacheInput.js';

export function isConfigCacheMeta(value: unknown): value is ConfigCacheMeta {
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
