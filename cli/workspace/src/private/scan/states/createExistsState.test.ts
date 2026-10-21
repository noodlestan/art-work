import { describe, expect, it } from 'vitest';

import { createExistsState } from './createExistsState.js';

describe('createExistsState', () => {
	it('FOR an existing checkout it returns exists state with exists true', () => {
		const state = createExistsState(true);
		expect(state.type).toBe('exists');
		expect(state.exists).toBe(true);
	});

	it('FOR a missing checkout it returns exists state with exists false', () => {
		const state = createExistsState(false);
		expect(state.type).toBe('exists');
		expect(state.exists).toBe(false);
	});
});
