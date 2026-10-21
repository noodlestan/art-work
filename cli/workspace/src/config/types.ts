import type { FSRecordsAdapterOptions, FSRecordsPattern } from '@art-lib/fs-records';

export type ConfigCacheInput = {
	path: string;
	hash: string;
};

export type ConfigCacheMeta = {
	version: number;
	compiledAt: string;
	manifest: string;
	inputs: ConfigCacheInput[];
};

export interface WorkspaceConfig {
	root: { path: string };
	checkouts: { path: string };
	data: {
		store: FSRecordsAdapterOptions;
		template: string;
	};
	discover: {
		records: { paths: FSRecordsPattern[] };
	};
}

export interface PartialWorkspaceConfig {
	root?: Partial<WorkspaceConfig['root']>;
	checkouts?: Partial<WorkspaceConfig['checkouts']>;
	data?: Partial<WorkspaceConfig['data']>;
	discover?: {
		records?: { defaults?: Partial<FSRecordsPattern>; paths?: Partial<FSRecordsPattern>[] };
	};
}
