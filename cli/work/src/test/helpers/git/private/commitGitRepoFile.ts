import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { SimpleGit } from 'simple-git';

/** Writes a file in the repo and commits it. */
export async function commitGitRepoFile(
	dir: string,
	git: SimpleGit,
	filename: string,
	content = 'content',
): Promise<void> {
	writeFileSync(join(dir, filename), content);
	await git.add('.');
	await git.commit('add ' + filename);
}
