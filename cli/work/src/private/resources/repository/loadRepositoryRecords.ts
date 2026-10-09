import { type FSRecordFile, findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceContext } from '../../context/createWorkspaceContext.js';
import { createGenericOperation } from '../../operations/createGenericOperation.js';
import type { RepositoryRecord } from '../types.js';

import { readRepositoryRecord } from './readRepositoryRecord.js';

export async function loadRepositoryRecords(ctx: WorkspaceContext): Promise<RepositoryRecord[]> {
	const searchPath = ctx.config.root.path;
	ctx.log.log(createGenericOperation('load-repository-records', searchPath));

	const recordFiles: FSRecordFile[] = await findRecordFiles(ctx.config.records, searchPath, [
		'Repository',
	]);
	const records = await Promise.all(recordFiles.map(file => readRepositoryRecord(file)));
	return records.filter((record): record is RepositoryRecord => record !== null);
}
