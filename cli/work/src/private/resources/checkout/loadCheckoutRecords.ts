import { findRecordFiles } from '@art-lib/fs-records';

import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { createGenericOperation } from '../../operations/createGenericOperation';
import type { RepositoryCheckoutRecord, RepositoryRecord } from '../types';

import { readCheckoutRecord } from './readCheckoutRecord';

export async function loadCheckoutRecords(
	ctx: WorkspaceContext,
	repos: RepositoryRecord[],
): Promise<RepositoryCheckoutRecord[]> {
	const searchPath = ctx.config.root.path;
	ctx.log.log(createGenericOperation('load-checkout-records', searchPath));

	const recordFiles = await findRecordFiles(ctx.config.records, searchPath, ['Checkout']);
	const checkouts = await Promise.all(
		recordFiles.map(async file => {
			const record = await readCheckoutRecord(file);
			if (!record) {
				return null;
			}
			if (!record.name) {
				console.warn('checkout record with empty name, skipped');
				return null;
			}
			const repo = repos.find(r => r.name === record.repository);
			if (repo) {
				return {
					repo,
					checkout: record,
					filename: file.filename,
				};
			}
			return {
				checkout: record,
				filename: file.filename,
			};
		}),
	);
	return checkouts.filter((checkout): checkout is RepositoryCheckoutRecord => checkout !== null);
}
