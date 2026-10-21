import { describe, expect, it } from 'vitest';

import { createWrongRemoteState } from './createWrongRemoteState.js';

describe('createWrongRemoteState', () => {
	it('FOR wrong=true it returns the wrong-remote state with wrong true', () => {
		const state = createWrongRemoteState(true);
		expect(state.type).toBe('wrong-remote');
		expect(state.wrong).toBe(true);
	});

	it('FOR wrong=false it returns the wrong-remote state with wrong false', () => {
		const state = createWrongRemoteState(false);
		expect(state.type).toBe('wrong-remote');
		expect(state.wrong).toBe(false);
	});
});
