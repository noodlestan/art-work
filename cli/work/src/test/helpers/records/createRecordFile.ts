import { relative, resolve } from 'node:path';

import type { FSRecordFile } from '@art-lib/fs-records';

export function createRecordFile(searchPath: string, filename: string): FSRecordFile {
	const resolvedSearchPath = resolve(searchPath);
	const resolvedFilename = resolve(filename);

	return {
		filename: resolvedFilename,
		searchPath,
		path: relative(resolvedSearchPath, resolvedFilename),
	};
}
