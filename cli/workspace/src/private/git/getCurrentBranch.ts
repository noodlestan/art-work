import { simpleGit } from 'simple-git';

/**
 * Returns the checked-out branch name, `-` when it cannot be determined.
 *
 * Prefers `symbolic-ref` over `git status`: an unborn HEAD prints
 * `No commits yet on <branch>...`, and `status.current` parses that into
 * noise such as `No`. `symbolic-ref` names the branch even with no commits.
 */
export async function getCurrentBranch(dir: string): Promise<string> {
	const git = simpleGit(dir);

	try {
		const ref = (await git.raw(['symbolic-ref', '--short', 'HEAD'])).trim();
		if (ref) {
			return ref;
		}
	} catch {
		// detached HEAD — no symbolic ref, fall through to status
	}

	try {
		const status = await git.status();
		const current = status.current;
		// branch names cannot contain whitespace, so a spaced value is not a branch
		if (current && current !== 'HEAD' && !/\s/.test(current)) {
			return current;
		}
		return 'HEAD';
	} catch {
		return '-';
	}
}
