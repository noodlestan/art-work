import { describe, expect, it } from 'vitest';

import { createExistsState } from '../states/createExistsState';
import { createRepoState } from '../states/createRepoState';

import { createStateAccessor } from './createStateAccessor';

describe('createStateAccessor', () => {
	it('returns the matching state', () => {
		const accessor = createStateAccessor([createRepoState(true), createExistsState(true)]);
		expect(accessor('repo').known).toBe(true);
		expect(accessor('exists').exists).toBe(true);
	});

	it('throws when state type is missing', () => {
		const accessor = createStateAccessor([createRepoState(true)]);
		expect(() => accessor('exists')).toThrow('missing checkout state: exists');
	});
});
