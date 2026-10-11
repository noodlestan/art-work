import { afterEach, describe, expect, it } from 'vitest';

import { advanceBareRepoByOneCommit } from '../../test/helpers/git/advanceBareRepoByOneCommit.js';
import { advanceGitRepoByOneCommit } from '../../test/helpers/git/advanceGitRepoByOneCommit.js';
import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepo } from '../../test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { getBehindAheadCount } from './getBehindAheadCount.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('getBehindAheadCount', () => {
	it('FOR a branch that has diverged from origin it returns both ahead and behind', async () => {
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

	it('FOR a branch that is only ahead it returns ahead > 0 and behind = 0', async () => {
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

	it('FOR a branch that is only behind it returns behind > 0 and ahead = 0', async () => {
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

	it('FOR an up to date branch it returns 0 ahead and 0 behind', async () => {
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

	it('FOR an unreachable remote it returns the 0/0 fallback', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(0);
		expect(result.behind).toBe(0);
	});

	it('FOR a new branch with no remote counterpart it returns ahead > 0 and behind = 0', async () => {
		const dir = makeTempDir(tempDirs);
		await makeGitRepo(tempDirs, { dir });
		await advanceGitRepoByOneCommit(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, null);

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(0);
	});
});
