import { describe, expect, it } from 'vitest';

import { truncateMiddle } from './truncateMiddle';

describe('truncateMiddle', () => {
	it('returns the string unchanged when shorter than the limit', () => {
		expect(truncateMiddle('short', 50)).toBe('short');
	});

	it('returns the string unchanged at the exact limit', () => {
		expect(truncateMiddle('a'.repeat(50), 50)).toBe('a'.repeat(50));
	});

	it('truncates a long string with [...] in the middle', () => {
		const truncated = truncateMiddle('abcdefghij', 7);
		expect(truncated).toBe('ab[...]ij');
	});
});
