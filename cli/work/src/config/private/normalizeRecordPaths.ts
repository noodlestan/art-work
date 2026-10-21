import type { FSRecordsPattern } from '@art-lib/fs-records';

import { DEFAULT_RECORDS_PATTERN } from '../constants.js';

export function normalizeRecordPaths(records?: {
	defaults?: Partial<FSRecordsPattern>;
	paths?: Partial<FSRecordsPattern>[];
}): FSRecordsPattern[] {
	const maybePaths = records?.paths;

	const paths = maybePaths || [{}];

	return paths.map((p: Partial<FSRecordsPattern>) => ({
		base: p.base ?? records?.defaults?.base ?? DEFAULT_RECORDS_PATTERN.base,
		pattern: p.pattern ?? records?.defaults?.pattern ?? DEFAULT_RECORDS_PATTERN.pattern,
		ignored: p.ignored ?? records?.defaults?.ignored ?? DEFAULT_RECORDS_PATTERN.ignored,
		excluded: [...(p.excluded ?? []), ...(records?.defaults?.excluded ?? [])],
		gitignore: p.gitignore ?? records?.defaults?.gitignore ?? DEFAULT_RECORDS_PATTERN.gitignore,
	}));
}
