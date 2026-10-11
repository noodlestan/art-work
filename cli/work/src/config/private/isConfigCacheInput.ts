import type { ConfigCacheInput } from '../types.js';

export function isConfigCacheInput(value: unknown): value is ConfigCacheInput {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const input = value as Record<string, unknown>;

	return typeof input.path === 'string' && typeof input.hash === 'string';
}
