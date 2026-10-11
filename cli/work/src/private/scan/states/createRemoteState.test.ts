import { describe, expect, it } from 'vitest';

import { createRemoteState } from './createRemoteState.js';

describe('createRemoteState', () => {
	it('WHEN the branch matches expected it returns the remote state', () => {
		const state = createRemoteState('main', 'main', true);
		expect(state.type).toBe('remote');
		expect(state.branch).toBe('main');
		expect(state.expectedBranch).toBe('main');
		expect(state.hasRemote).toBe(true);
	});

	it('WHEN no remote is configured it returns a state with no branch and no remote', () => {
		const state = createRemoteState(null, 'main', false);
		expect(state.type).toBe('remote');
		expect(state.branch).toBeNull();
		expect(state.hasRemote).toBe(false);
	});
});
