import { glob } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { WorkspaceRecordsPath } from '../../../config';

import { normalizeExcludes } from './normalizeExcludes';
import { normalizePatterns } from './normalizePatterns';

export async function globPath(searchPath: string, path: WorkspaceRecordsPath): Promise<string[]> {
	const baseDir = join(searchPath, path.base);
	const pattern = normalizePatterns(baseDir, path.pattern);
	const exclude = normalizeExcludes(baseDir, [...path.ignored, ...path.excluded]);

	const globResult = glob(pattern, { exclude });

	const entries: string[] = [];
	for await (const entry of globResult) {
		entries.push(entry);
	}

	return entries.map(entry => resolve(baseDir, entry));
}
