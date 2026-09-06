import type { FSRecordsPath } from '@art-lib/fs-records';

export interface WorkspaceConfig {
	root: { path: string };
	clone: { path: string };
	checkouts: { path: string; template: string };
	records: { paths: FSRecordsPath[] };
}

export interface PartialWorkspaceConfig {
	root?: Partial<WorkspaceConfig['root']>;
	clone?: Partial<WorkspaceConfig['clone']>;
	checkouts?: Partial<WorkspaceConfig['checkouts']>;
	records?: Partial<FSRecordsPath> & { paths?: Partial<FSRecordsPath>[] };
}
