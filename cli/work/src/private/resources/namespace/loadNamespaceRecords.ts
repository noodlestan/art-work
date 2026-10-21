import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { NamespaceRecord } from '../types.js';

import { readNamespaceRecord } from './readNamespaceRecord.js';

export async function loadNamespaceRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<NamespaceRecord[]> {
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
				return readNamespaceRecord(fileWithContent);
			}),
	);
	return records.filter((record): record is NamespaceRecord => record !== null);
}
