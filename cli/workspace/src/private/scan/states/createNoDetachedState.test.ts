import { describe, expect, it } from 'vitest';

import { createNoDetachedState } from './createNoDetachedState.js';

describe('createNoDetachedState', () => {
	it('WHEN attached is true it returns a no-detached state with attached true', () => {
		const state = createNoDetachedState(true);
		expect(state.type).toBe('no-detached');
		expect(state.attached).toBe(true);
	});

	it('WHEN attached is false it returns a no-detached state with attached false', () => {
		const state = createNoDetachedState(false);
		expect(state.type).toBe('no-detached');
		expect(state.attached).toBe(false);
	});
});
