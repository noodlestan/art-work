import { type FSRecordFile, findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceConfig } from '../../../config/index.js';
import type { PackageRecord } from '../types.js';

import { readPackageRecord } from './readPackageRecord.js';

export async function loadPackageRecords(
	config: WorkspaceConfig,
	checkoutPath: string,
): Promise<PackageRecord[]> {
	const recordFiles: FSRecordFile[] = await findRecordFiles(config.records, checkoutPath, [
		'Package',
	]);
	const records = await Promise.all(recordFiles.map(file => readPackageRecord(file)));
	return records.filter((record): record is PackageRecord => record !== null);
}
