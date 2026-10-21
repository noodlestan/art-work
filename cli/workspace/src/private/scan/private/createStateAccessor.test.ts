import { describe, expect, it } from 'vitest';

import { createExistsState } from '../states/createExistsState.js';
import { createRepoState } from '../states/createRepoState.js';

import { createStateAccessor } from './createStateAccessor.js';

describe('createStateAccessor', () => {
	it('WHEN the requested state is present it returns the matching state', () => {
		const accessor = createStateAccessor([createRepoState(true), createExistsState(true)]);
		expect(accessor('repo').known).toBe(true);
		expect(accessor('exists').exists).toBe(true);
	});

	it('WHEN the requested state type is missing it throws', () => {
		const accessor = createStateAccessor([createRepoState(true)]);
		expect(() => accessor('exists')).toThrow('missing checkout state: exists');
	});
});
