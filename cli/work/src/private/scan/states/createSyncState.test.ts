import { describe, expect, it } from 'vitest';

import { createSyncState } from './createSyncState';

describe('createSyncState', () => {
	it('returns sync state with zero delta', () => {
		const state = createSyncState(0);
		expect(state.type).toBe('sync');
		expect(state.delta).toBe(0);
		expect(state.ahead).toBe(0);
		expect(state.behind).toBe(0);
	});

	it('computes ahead from positive delta', () => {
		const state = createSyncState(3);
		expect(state.delta).toBe(3);
		expect(state.ahead).toBe(3);
		expect(state.behind).toBe(0);
	});

	it('computes behind from negative delta', () => {
		const state = createSyncState(-2);
		expect(state.delta).toBe(-2);
		expect(state.ahead).toBe(0);
		expect(state.behind).toBe(2);
	});

	it('uses explicit ahead and behind when provided', () => {
		const state = createSyncState(1, 5, 7);
		expect(state.delta).toBe(1);
		expect(state.ahead).toBe(5);
		expect(state.behind).toBe(7);
	});
});
