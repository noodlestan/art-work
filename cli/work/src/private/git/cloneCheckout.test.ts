import { existsSync } from 'node:fs';

import simpleGit from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { cloneCheckout } from './cloneCheckout';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('cloneCheckout', () => {
	it('clones a repo from a bare', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		await cloneCheckout(bareDir, dir);

		expect(existsSync(`${dir}/.git`)).toBe(true);
	});

	it('clones and checks out the specified branch', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);
		const workDir = makeTempDir(tempDirs);
		await makeGitRepoFromBare(tempDirs, bareDir, { dir: workDir });
		const git = simpleGit(workDir);
		await git.checkoutLocalBranch('feature');
		await git.push('origin', 'feature');

		await cloneCheckout(bareDir, dir, 'feature');

		const branch = await simpleGit(dir).revparse(['--abbrev-ref', 'HEAD']);
		expect(branch.trim()).toBe('feature');
	});

	it('succeeds even when branch does not exist on remote', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		await cloneCheckout(bareDir, dir, 'nonexistent');

		expect(existsSync(`${dir}/.git`)).toBe(true);
	});
});
