import { describe, expect, it } from 'vitest';

import { createWrongRemoteState } from './createWrongRemoteState';

describe('createWrongRemoteState', () => {
	it('returns wrong-remote state with wrong true', () => {
		const state = createWrongRemoteState(true);
		expect(state.type).toBe('wrong-remote');
		expect(state.wrong).toBe(true);
	});

	it('returns wrong-remote state with wrong false', () => {
		const state = createWrongRemoteState(false);
		expect(state.type).toBe('wrong-remote');
		expect(state.wrong).toBe(false);
	});
});
