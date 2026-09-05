import { FSRecordsPath } from '@art-lib/fs-records';

import { PartialWorkspaceConfig } from '../types';

const DEFAULTS: FSRecordsPath = {
	base: '.',
	pattern: '*.art',
	ignored: ['node_modules/', '.git/', 'dist/'],
	excluded: [],
	gitignore: true,
};

export function normalizeRecordPaths(records: PartialWorkspaceConfig['records']): FSRecordsPath[] {
	const paths = records?.paths;

	if (!paths || paths.length === 0) {
		return [
			{
				base: records?.base ?? DEFAULTS.base,
				pattern: records?.pattern ?? DEFAULTS.pattern,
				ignored: records?.ignored ?? DEFAULTS.ignored,
				excluded: records?.excluded ?? DEFAULTS.excluded,
				gitignore: records?.gitignore ?? DEFAULTS.gitignore,
			},
		];
	}

	return paths.map(p => ({
		base: p.base ?? records?.base ?? DEFAULTS.base,
		pattern: p.pattern ?? records?.pattern ?? DEFAULTS.pattern,
		ignored: p.ignored ?? records?.ignored ?? DEFAULTS.ignored,
		excluded: [...(p.excluded ?? []), ...(records?.excluded ?? [])],
		gitignore: p.gitignore ?? records?.gitignore ?? DEFAULTS.gitignore,
	}));
}
