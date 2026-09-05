import simpleGit from 'simple-git';

export interface AheadBehind {
	ahead: number;
	behind: number;
}

export async function getBehindAheadCount(
	dir: string,
	remoteBranch: string | null,
): Promise<AheadBehind> {
	const git = simpleGit(dir);
	try {
		if (!remoteBranch) {
			const ahead = await git.raw(['rev-list', '--count', 'HEAD', '--not', '--remotes=origin']);
			return { ahead: Number.parseInt(ahead.trim(), 10) || 0, behind: 0 };
		}
		const counts = await git.raw(['rev-list', '--left-right', '--count', `${remoteBranch}...HEAD`]);
		const [behind, ahead] = counts.trim().split(/\s+/).map(Number);
		return { ahead, behind };
	} catch {
		return { ahead: 0, behind: 0 };
	}
}
