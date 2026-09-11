import { describe, expect, it } from 'vitest';

import { createGitDirState } from './createGitDirState';

describe('createGitDirState', () => {
	it('returns git-dir state with hasGit true', () => {
		const state = createGitDirState(true);
		expect(state.type).toBe('git-dir');
		expect(state.hasGit).toBe(true);
	});

	it('returns git-dir state with hasGit false', () => {
		const state = createGitDirState(false);
		expect(state.type).toBe('git-dir');
		expect(state.hasGit).toBe(false);
	});
});
