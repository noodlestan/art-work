import { describe, expect, it } from 'vitest';

import { createNoConflictsState } from './createNoConflictsState.js';

describe('createNoConflictsState', () => {
	it('FOR clear true it returns a no-conflicts state with clear true', () => {
		const state = createNoConflictsState(true);
		expect(state.type).toBe('no-conflicts');
		expect(state.clear).toBe(true);
	});

	it('FOR clear false it returns a no-conflicts state with clear false', () => {
		const state = createNoConflictsState(false);
		expect(state.type).toBe('no-conflicts');
		expect(state.clear).toBe(false);
	});
});
