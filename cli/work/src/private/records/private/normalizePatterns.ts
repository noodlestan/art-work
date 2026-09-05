import { join } from 'node:path';

export function normalizePatterns(baseDir: string, pattern: string | string[]): string[] {
	const patterns = Array.isArray(pattern) ? pattern : [pattern];
	return patterns.map(p => join(baseDir, p.includes('**') ? p : `**/${p}`));
}
