import { describe, expect, it } from 'vitest';

import { createNoDetachedState } from './createNoDetachedState';

describe('createNoDetachedState', () => {
	it('returns no-detached state with attached true', () => {
		const state = createNoDetachedState(true);
		expect(state.type).toBe('no-detached');
		expect(state.attached).toBe(true);
	});

	it('returns no-detached state with attached false', () => {
		const state = createNoDetachedState(false);
		expect(state.type).toBe('no-detached');
		expect(state.attached).toBe(false);
	});
});
