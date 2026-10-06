import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { spawnCli } from './helpers/spawnCli';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENCODING = 'utf8';

describe('cli integration', () => {
	it('WHEN asked for the version, prints the bin package version', async () => {
		const manifest = JSON.parse(await readFile(join(PACKAGE_ROOT, 'package.json'), ENCODING));

		const result = await spawnCli({ args: ['--version'] });

		expect(result.code).toBe(0);
		expect(result.stdout.trim()).toBe(manifest.version);
	});
});
