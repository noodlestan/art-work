import { findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config';
import type { NamespaceRecord } from '../types';

import { readNamespaceRecord } from './readNamespaceRecord';

export async function loadNamespaceRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<NamespaceRecord[]> {
	const recordFiles = await findRecordFiles(config.records, checkoutPath, ['Namespace']);
	const records = await Promise.all(recordFiles.map(file => readNamespaceRecord(file)));
	return records.filter((record): record is NamespaceRecord => record !== null);
}
