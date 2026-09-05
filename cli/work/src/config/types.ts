export interface WorkspaceRecordsPath {
	base: string;
	pattern: string | string[];
	ignored: string[];
	excluded: string[];
	gitignore: boolean;
}

export interface WorkspaceConfig {
	root: { path: string };
	clone: { path: string };
	checkouts: { path: string; template: string };
	records: { paths: WorkspaceRecordsPath[] };
}

export interface PartialWorkspaceConfig {
	root?: Partial<WorkspaceConfig['root']>;
	clone?: Partial<WorkspaceConfig['clone']>;
	checkouts?: Partial<WorkspaceConfig['checkouts']>;
	records?: Partial<WorkspaceRecordsPath> & { paths?: Partial<WorkspaceRecordsPath>[] };
}
