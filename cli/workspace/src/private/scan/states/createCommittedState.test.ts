import { describe, expect, it } from 'vitest';

import { createCommittedState } from './createCommittedState.js';

describe('createCommittedState', () => {
	it('FOR clean set to true it returns a committed state with clean true', () => {
		const state = createCommittedState(true);
		expect(state.type).toBe('committed');
		expect(state.clean).toBe(true);
	});

	it('FOR clean set to false it returns a committed state with clean false', () => {
		const state = createCommittedState(false);
		expect(state.type).toBe('committed');
		expect(state.clean).toBe(false);
	});
});
