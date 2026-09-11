import { afterEach, describe, expect, it } from 'vitest';

import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { getBehindAheadCount } from './getBehindAheadCount';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getBehindAheadCount', () => {
	it('returns both ahead and behind when the branch has diverged from origin', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await git.addRemote('origin', bareDir);
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		// Create a commit on origin (behind for our repo)
		await advanceBareRepoByOneCommit(tempDirs, bareDir);

		// Fetch so the tracking ref reflects the remote advance.
		await git.fetch('origin', 'main');

		// Create a local commit (ahead for our repo).
		await advanceGitRepoByOneCommit(dir, 'local.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(1);
	});

	it('returns ahead > 0, behind = 0 when only ahead', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await git.addRemote('origin', bareDir);
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);
		await advanceGitRepoByOneCommit(dir, 'second.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(0);
	});

	it('returns behind > 0, ahead = 0 when only behind (local tracking ref updated)', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await git.addRemote('origin', bareDir);
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		// Push a new commit from another clone
		await advanceBareRepoByOneCommit(tempDirs, bareDir);

		// Fetch so the tracking ref is current
		await git.fetch('origin', 'main');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.behind).toBe(1);
		expect(result.ahead).toBe(0);
	});

	it('returns 0/0 when up to date', async () => {
		const dir = makeTempDir(tempDirs);
		const { git } = await makeGitRepo(tempDirs, { dir });
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		await git.addRemote('origin', bareDir);
		await advanceGitRepoByOneCommit(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(0);
		expect(result.behind).toBe(0);
	});

	it('returns 0/0 fallback when the remote is unreachable (no remote)', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(0);
		expect(result.behind).toBe(0);
	});

	it('returns ahead > 0, behind = 0 for a new branch with no remote counterpart', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, null);

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(0);
	});
});
