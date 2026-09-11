import { describe, expect, it } from 'vitest';

import { createRemoteState } from './createRemoteState';

describe('createRemoteState', () => {
	it('returns remote state with branch matching expected', () => {
		const state = createRemoteState('main', 'main', true);
		expect(state.type).toBe('remote');
		expect(state.branch).toBe('main');
		expect(state.expectedBranch).toBe('main');
		expect(state.hasRemote).toBe(true);
	});

	it('returns remote state with no branch and no remote', () => {
		const state = createRemoteState(null, 'main', false);
		expect(state.type).toBe('remote');
		expect(state.branch).toBeNull();
		expect(state.hasRemote).toBe(false);
	});
});
