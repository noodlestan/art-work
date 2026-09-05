import type { WorkspaceConfig } from '../../config';

import { createRecordFile } from './private/createRecordFile';
import { directoryExists } from './private/directoryExists';
import { filterFilenamesByKinds } from './private/filterByKinds';
import { findRecordFilesInPath } from './private/findRecordFilesInPath';
import type { RecordFile } from './types';

export async function findRecordFiles(
	recordsConfig: WorkspaceConfig['records'],
	searchPath: string,
	kinds: string | string[] = [],
): Promise<RecordFile[]> {
	if (!directoryExists(searchPath)) {
		return [];
	}

	const results = await Promise.all(
		recordsConfig.paths.map(path => findRecordFilesInPath(searchPath, path)),
	);

	const allCandidates = new Set(results.flat());

	const kindFilter = Array.isArray(kinds) ? kinds : [kinds];
	const files = [...allCandidates].sort().map(filename => createRecordFile(searchPath, filename));
	return filterFilenamesByKinds(files, kindFilter);
}
