import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { commitFileTest } from '../../test/helpers/git/commitFileTest';
import { initGitRepoTest } from '../../test/helpers/git/initGitRepoTest';
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
		await initGitRepoTest(dir);
		const bareDir = makeTempDir(tempDirs);
		const bareGit = simpleGit(bareDir);
		await bareGit.init(true);
		const git = simpleGit(dir);
		await git.addRemote('origin', bareDir);
		await commitFileTest(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		// Create a commit on origin (behind for our repo)
		const otherDir = makeTempDir(tempDirs);
		await simpleGit(otherDir).clone(bareDir, otherDir);
		const otherGit = simpleGit(otherDir);
		await otherGit.addConfig('user.email', 'test@example.com');
		await otherGit.addConfig('user.name', 'Test');
		writeFileSync(join(otherDir, 'origin.txt'), 'origin');
		await otherGit.add('.');
		await otherGit.commit('origin change');
		await otherGit.push('origin', 'main');

		// Fetch so the tracking ref reflects the remote advance.
		await git.fetch('origin', 'main');

		// Create a local commit (ahead for our repo).
		writeFileSync(join(dir, 'local.txt'), 'local');
		await git.add('.');
		await git.commit('local change');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(1);
	});

	it('returns ahead > 0, behind = 0 when only ahead', async () => {
		const dir = makeTempDir(tempDirs);
		await initGitRepoTest(dir);
		const bareDir = makeTempDir(tempDirs);
		const bareGit = simpleGit(bareDir);
		await bareGit.init(true);
		const git = simpleGit(dir);
		await git.addRemote('origin', bareDir);
		await commitFileTest(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);
		await commitFileTest(dir, 'second.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(0);
	});

	it('returns behind > 0, ahead = 0 when only behind (local tracking ref updated)', async () => {
		const dir = makeTempDir(tempDirs);
		await initGitRepoTest(dir);
		const bareDir = makeTempDir(tempDirs);
		const bareGit = simpleGit(bareDir);
		await bareGit.init(true);
		const git = simpleGit(dir);
		await git.addRemote('origin', bareDir);
		await commitFileTest(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		// Push a new commit from another clone
		const otherDir = makeTempDir(tempDirs);
		await simpleGit(otherDir).clone(bareDir, otherDir);
		const otherGit = simpleGit(otherDir);
		await otherGit.addConfig('user.email', 'test@example.com');
		await otherGit.addConfig('user.name', 'Test');
		writeFileSync(join(otherDir, 'origin.txt'), 'origin');
		await otherGit.add('.');
		await otherGit.commit('origin change');
		await otherGit.push('origin', 'main');

		// Fetch so the tracking ref is current
		await git.fetch('origin', 'main');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.behind).toBe(1);
		expect(result.ahead).toBe(0);
	});

	it('returns 0/0 when up to date', async () => {
		const dir = makeTempDir(tempDirs);
		await initGitRepoTest(dir);
		const bareDir = makeTempDir(tempDirs);
		const bareGit = simpleGit(bareDir);
		await bareGit.init(true);
		const git = simpleGit(dir);
		await git.addRemote('origin', bareDir);
		await commitFileTest(dir, 'file.txt');
		await git.push('origin', 'main', ['--set-upstream']);

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(0);
		expect(result.behind).toBe(0);
	});

	it('returns 0/0 fallback when the remote is unreachable (no remote)', async () => {
		const dir = makeTempDir(tempDirs);
		await initGitRepoTest(dir);
		await commitFileTest(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, 'origin/main');

		expect(result.ahead).toBe(0);
		expect(result.behind).toBe(0);
	});

	it('returns ahead > 0, behind = 0 for a new branch with no remote counterpart', async () => {
		const dir = makeTempDir(tempDirs);
		await initGitRepoTest(dir);
		await commitFileTest(dir, 'file.txt');

		const result = await getBehindAheadCount(dir, null);

		expect(result.ahead).toBe(1);
		expect(result.behind).toBe(0);
	});
});
