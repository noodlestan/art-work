import { join } from 'node:path';

export function normalizeExcludes(baseDir: string, excludes: string[]): string[] {
	return excludes.flatMap(ex => {
		const normalized = ex.replace(/\/$/, '');
		return [join(baseDir, '**', normalized, '**'), join(baseDir, '**', normalized)];
	});
}
