import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { ProjectRecord } from '../types.js';

import { readProjectRecord } from './readProjectRecord.js';

export async function loadProjectRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<ProjectRecord[]> {
	const adapter = createFSRecordsAdapter({
		basePath: checkoutPath,
		patterns: config.discover.records.paths,
	});
	const recordFiles: FSRecordFile[] = await adapter.discoverRecordFiles();
	const records = await Promise.all(
		recordFiles
			.filter(file => !file.error)
			.map(async file => {
				const contentSource = adapter.createContentSource(file);
				const content = await contentSource.readContent();
				const fileWithContent = { ...file, content };
				return readProjectRecord(fileWithContent);
			}),
	);
	return records.filter((record): record is ProjectRecord => record !== null);
}
