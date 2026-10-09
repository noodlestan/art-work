import { type FSRecordFile, findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { NamespaceRecord } from '../types.js';

import { readNamespaceRecord } from './readNamespaceRecord.js';

export async function loadNamespaceRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<NamespaceRecord[]> {
	const recordFiles: FSRecordFile[] = await findRecordFiles(config.records, checkoutPath, [
		'Namespace',
	]);
	const records = await Promise.all(recordFiles.map(file => readNamespaceRecord(file)));
	return records.filter((record): record is NamespaceRecord => record !== null);
}
