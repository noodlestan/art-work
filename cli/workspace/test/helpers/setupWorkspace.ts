import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { makeGitRepo } from '../../src/test/helpers/git/makeGitRepo.js';
import { makeTempDir } from '../../src/test/helpers/tempDirs/makeTempDir.js';

const TEST_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = join(TEST_ROOT, 'fixture-repo');

/**
 * Materialises `test/fixture-repo` into a temp dir and initialises the one git
 * checkout it records, so commands that inspect a checkout have real git state.
 */
export async function setupWorkspace(tempDirs: string[]): Promise<string> {
	const root = makeTempDir(tempDirs);
	cpSync(FIXTURE, root, { recursive: true });

	const checkout = join(root, 'checkouts', 'art-work');
	mkdirSync(dirname(checkout), { recursive: true });
	await makeGitRepo(tempDirs, { dir: checkout, commit: true });

	return root;
}
