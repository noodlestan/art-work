import type { CheckoutStateGitDir } from '../types.js';

export const createGitDirState = (hasGit: boolean): CheckoutStateGitDir => ({
	type: 'git-dir',
	hasGit,
});
