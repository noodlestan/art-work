import { describe, expect, it } from 'vitest';

import { createCommittedState } from './createCommittedState';

describe('createCommittedState', () => {
	it('returns committed state with clean true', () => {
		const state = createCommittedState(true);
		expect(state.type).toBe('committed');
		expect(state.clean).toBe(true);
	});

	it('returns committed state with clean false', () => {
		const state = createCommittedState(false);
		expect(state.type).toBe('committed');
		expect(state.clean).toBe(false);
	});
});
