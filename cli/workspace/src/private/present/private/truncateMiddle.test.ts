import { describe, expect, it } from 'vitest';

import { truncateMiddle } from './truncateMiddle.js';

describe('truncateMiddle', () => {
	it('WHEN the string is shorter than the limit it is returned unchanged', () => {
		expect(truncateMiddle('short', 50)).toBe('short');
	});

	it('WHEN the string is at the exact limit it is returned unchanged', () => {
		expect(truncateMiddle('a'.repeat(50), 50)).toBe('a'.repeat(50));
	});

	it('WHEN the string is too long it truncates it with [...] in the middle', () => {
		const truncated = truncateMiddle('abcdefghij', 7);
		expect(truncated).toBe('ab[...]ij');
	});
});
