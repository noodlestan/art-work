import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { PackageRecord } from '../types.js';

import { readPackageRecord } from './readPackageRecord.js';

export async function loadPackageRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<PackageRecord[]> {
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
				return readPackageRecord(fileWithContent);
			}),
	);
	return records.filter((record): record is PackageRecord => record !== null);
}
