import type { CheckoutStateGitDir } from '../types';

export const createGitDirState = (hasGit: boolean): CheckoutStateGitDir => ({
	type: 'git-dir',
	hasGit,
});
