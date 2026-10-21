import type { FSRecordFile } from '@art-lib/fs-records';

import type { WorkspaceContext } from '../../context/createWorkspaceContext.js';
import { createGenericOperation } from '../../operations/createGenericOperation.js';
import type { RepositoryRecord } from '../types.js';

import { readRepositoryRecord } from './readRepositoryRecord.js';

export async function loadRepositoryRecords(ctx: WorkspaceContext): Promise<RepositoryRecord[]> {
	const searchPath = ctx.config.root.path;
	ctx.log.log(createGenericOperation('load-repository-records', searchPath));

	const adapter = ctx.fsRecords;
	const recordFiles: FSRecordFile[] = await adapter.discoverRecordFiles();
	const records = await Promise.all(
		recordFiles
			.filter(file => !file.error)
			.map(async file => {
				const contentSource = adapter.createContentSource(file);
				const content = await contentSource.readContent();
				const fileWithContent = { ...file, content };
				return readRepositoryRecord(fileWithContent);
			}),
	);
	return records.filter((record): record is RepositoryRecord => record !== null);
}
