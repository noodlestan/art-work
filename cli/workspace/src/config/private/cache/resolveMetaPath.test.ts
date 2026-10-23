import { describe, expect, it } from 'vitest';

import { resolveMetaPath } from './resolveMetaPath.js';

describe('resolveMetaPath', () => {
	it('GIVEN a root path it resolves the metadata file inside the cache directory', () => {
		expect(resolveMetaPath('/workspace')).toBe(
			'/workspace/node_modules/.art-workspace/config.cache.json',
		);
	});
});
