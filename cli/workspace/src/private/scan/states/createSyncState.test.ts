import { describe, expect, it } from 'vitest';

import { createSyncState } from './createSyncState.js';

describe('createSyncState', () => {
	it('WHEN the delta is zero it returns a sync state with zero delta', () => {
		const state = createSyncState(0);
		expect(state.type).toBe('sync');
		expect(state.delta).toBe(0);
		expect(state.ahead).toBe(0);
		expect(state.behind).toBe(0);
	});

	it('WHEN the delta is positive it computes ahead', () => {
		const state = createSyncState(3);
		expect(state.delta).toBe(3);
		expect(state.ahead).toBe(3);
		expect(state.behind).toBe(0);
	});

	it('WHEN the delta is negative it computes behind', () => {
		const state = createSyncState(-2);
		expect(state.delta).toBe(-2);
		expect(state.ahead).toBe(0);
		expect(state.behind).toBe(2);
	});

	it('WHEN explicit ahead and behind are provided it uses them', () => {
		const state = createSyncState(1, 5, 7);
		expect(state.delta).toBe(1);
		expect(state.ahead).toBe(5);
		expect(state.behind).toBe(7);
	});
});
