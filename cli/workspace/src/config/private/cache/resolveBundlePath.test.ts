import { describe, expect, it } from 'vitest';

import { resolveBundlePath } from './resolveBundlePath.js';

describe('resolveBundlePath', () => {
	it('GIVEN a root path it resolves the bundle file inside the cache directory', () => {
		expect(resolveBundlePath('/workspace')).toBe(
			'/workspace/node_modules/.art-workspace/config.bundle.mjs',
		);
	});
});
