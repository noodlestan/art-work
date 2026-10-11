import { describe, expect, it } from 'vitest';

import { createGitDirState } from './createGitDirState.js';

describe('createGitDirState', () => {
	it('FOR hasGit=true it returns the git-dir state with hasGit true', () => {
		const state = createGitDirState(true);
		expect(state.type).toBe('git-dir');
		expect(state.hasGit).toBe(true);
	});

	it('FOR hasGit=false it returns the git-dir state with hasGit false', () => {
		const state = createGitDirState(false);
		expect(state.type).toBe('git-dir');
		expect(state.hasGit).toBe(false);
	});
});
