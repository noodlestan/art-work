import { describe, expect, it } from 'vitest';

import { resolveCacheDir } from './resolveCacheDir.js';

describe('resolveCacheDir', () => {
	it('GIVEN a root path it resolves the cache directory under node_modules', () => {
		expect(resolveCacheDir('/workspace')).toBe('/workspace/node_modules/.art-work');
	});
});
