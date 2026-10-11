import { describe, expect, it } from 'vitest';

import { safePath } from './safePath.js';

describe('safePath', () => {
	it('WHEN the input has mixed case and symbols it lowercases and hyphenates', () => {
		expect(safePath('Hello World!')).toBe('hello-world-');
	});

	it('WHEN the input has consecutive separators it collapses them into hyphens', () => {
		expect(safePath('foo___bar')).toBe('foo-bar');
	});
});
