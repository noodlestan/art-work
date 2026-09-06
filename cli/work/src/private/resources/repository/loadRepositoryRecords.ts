import { findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { createGenericOperation } from '../../operations/createGenericOperation';
import type { RepositoryRecord } from '../types';

import { readRepositoryRecord } from './readRepositoryRecord';

export async function loadRepositoryRecords(ctx: WorkspaceContext): Promise<RepositoryRecord[]> {
	const searchPath = ctx.config.root.path;
	ctx.log.log(createGenericOperation('load-repository-records', searchPath));

	const recordFiles = await findRecordFiles(ctx.config.records, searchPath, ['Repository']);
	const records = await Promise.all(recordFiles.map(file => readRepositoryRecord(file)));
	return records.filter((record): record is RepositoryRecord => record !== null);
}
