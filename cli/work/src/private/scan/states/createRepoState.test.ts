import { describe, expect, it } from 'vitest';

import { createRepoState } from './createRepoState';

describe('createRepoState', () => {
	it('returns repo state with known true', () => {
		const state = createRepoState(true);
		expect(state.type).toBe('repo');
		expect(state.known).toBe(true);
	});

	it('returns repo state with known false', () => {
		const state = createRepoState(false);
		expect(state.type).toBe('repo');
		expect(state.known).toBe(false);
	});
});
