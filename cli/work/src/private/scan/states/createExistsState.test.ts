import { describe, expect, it } from 'vitest';

import { createExistsState } from './createExistsState';

describe('createExistsState', () => {
	it('returns exists state with exists true', () => {
		const state = createExistsState(true);
		expect(state.type).toBe('exists');
		expect(state.exists).toBe(true);
	});

	it('returns exists state with exists false', () => {
		const state = createExistsState(false);
		expect(state.type).toBe('exists');
		expect(state.exists).toBe(false);
	});
});
