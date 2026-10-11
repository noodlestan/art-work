import { describe, expect, it } from 'vitest';

import { createRepoState } from './createRepoState.js';

describe('createRepoState', () => {
	it('FOR a known repo it returns repo state with known true', () => {
		const state = createRepoState(true);
		expect(state.type).toBe('repo');
		expect(state.known).toBe(true);
	});

	it('FOR an unknown repo it returns repo state with known false', () => {
		const state = createRepoState(false);
		expect(state.type).toBe('repo');
		expect(state.known).toBe(false);
	});
});
