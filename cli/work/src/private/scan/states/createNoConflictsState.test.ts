import { describe, expect, it } from 'vitest';

import { createNoConflictsState } from './createNoConflictsState';

describe('createNoConflictsState', () => {
	it('returns no-conflicts state with clear true', () => {
		const state = createNoConflictsState(true);
		expect(state.type).toBe('no-conflicts');
		expect(state.clear).toBe(true);
	});

	it('returns no-conflicts state with clear false', () => {
		const state = createNoConflictsState(false);
		expect(state.type).toBe('no-conflicts');
		expect(state.clear).toBe(false);
	});
});
