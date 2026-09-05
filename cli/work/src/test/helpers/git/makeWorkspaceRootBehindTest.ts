import simpleGit from 'simple-git';

import { makeTempDir } from '../tempDirs/makeTempDir';

import { commitFileTest } from './commitFileTest';
import { initWorkingRepoTest } from './initWorkingRepoTest';

export async function makeWorkspaceRootBehindTest(
	tempDir: string,
	bareDir: string,
	tempDirs: string[],
): Promise<void> {
	await initWorkingRepoTest(tempDir, bareDir);
	const git = simpleGit(tempDir);
	await git.push('origin', 'main', ['--set-upstream']);

	const advDir = makeTempDir(tempDirs);
	await git.clone(bareDir, advDir);
	const advGit = simpleGit(advDir);
	await advGit.addConfig('user.email', 'test@example.com');
	await advGit.addConfig('user.name', 'Test');
	await commitFileTest(advDir, 'origin-advance.txt');
	await advGit.push('origin', 'main');

	await git.fetch('origin', 'main');
}
