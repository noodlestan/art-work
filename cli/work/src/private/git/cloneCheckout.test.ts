import { existsSync } from 'node:fs';

import { simpleGit } from 'simple-git';
import { afterEach, describe, expect, it } from 'vitest';

import { makeGitBareRepo } from '../../test/helpers/git/makeGitBareRepo.js';
import { makeGitRepoFromBare } from '../../test/helpers/git/makeGitRepoFromBare.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';

import { cloneCheckout } from './cloneCheckout.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('cloneCheckout', () => {
	it('WHEN the source is a bare repo it clones the repo from it', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		await cloneCheckout(bareDir, dir);

		expect(existsSync(`${dir}/.git`)).toBe(true);
	});

	it('WHEN a branch is specified it clones and checks it out', async () => {
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

	it('WHEN the branch does not exist on remote it still succeeds', async () => {
		const dir = makeTempDir(tempDirs);
		const { dir: bareDir } = await makeGitBareRepo(tempDirs);

		await cloneCheckout(bareDir, dir, 'nonexistent');

		expect(existsSync(`${dir}/.git`)).toBe(true);
	});
});
