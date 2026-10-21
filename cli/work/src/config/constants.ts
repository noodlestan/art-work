import type { FSRecordsAdapterOptions, FSRecordsPattern } from '@art-lib/fs-records';

export const DEFAULT_RECORDS_PATTERN: FSRecordsPattern = {
	base: '.',
	pattern: '*.art',
	ignored: ['node_modules/', '.git/', 'dist/'],
	excluded: [],
	gitignore: true,
};

export const DEFAULT_RECORDS_STORE_OPTIONS: FSRecordsAdapterOptions = {
	basePath: '_records/',
	patterns: [DEFAULT_RECORDS_PATTERN],
};
