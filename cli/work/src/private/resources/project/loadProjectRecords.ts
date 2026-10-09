import { type FSRecordFile, findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { ProjectRecord } from '../types.js';

import { readProjectRecord } from './readProjectRecord.js';

export async function loadProjectRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<ProjectRecord[]> {
	const recordFiles: FSRecordFile[] = await findRecordFiles(config.records, checkoutPath, [
		'Project',
	]);

	const records = await Promise.all(recordFiles.map(file => readProjectRecord(file)));
	return records.filter((record): record is ProjectRecord => record !== null);
}
