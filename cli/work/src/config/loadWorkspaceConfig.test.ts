import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs.js';

import { resolveBundlePath, resolveCacheDir } from './cache.js';

import { loadWorkspaceConfig } from './index.js';

const SOME_CONFIG = JSON.stringify({
	clone: { path: 'clone-path' },
	root: {},
	checkouts: { path: 'checkouts-path', template: 'checkouts-template' },
	records: { pattern: '*.art' },
});

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('loadWorkspaceConfig', () => {
	it('loads default config when config is missing', async () => {
		const tempDir = makeTempDir(tempDirs);

		const config = await loadWorkspaceConfig(tempDir);

		expect(config.clone.path).toBe('checkouts');
		expect(config.checkouts.path).toBe('_records/');
		expect(config.checkouts.template).toBe('.agents/domains/workspace/templates/checkout.art.njk');
		expect(config.records.paths[0].pattern).toBe('*.art');
	});

	it('warns when the config is missing', async () => {
		const tempDir = makeTempDir(tempDirs);
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const config = await loadWorkspaceConfig(tempDir);

		expect(warn).toHaveBeenCalled();
		expect(config.clone.path).toBe('checkouts');
		expect(config.records.paths[0].pattern).toBe('*.art');
	});

	it('returns loaded config when config is present', async () => {
		const tempDir = makeTempDir(tempDirs);
		writeFileSync(join(tempDir, '.art-workspace.mts'), `export default ${SOME_CONFIG}`);

		const config = await loadWorkspaceConfig(tempDir);

		expect(config.root.path).toBe(tempDir);
		expect(config.checkouts.path).toBe('checkouts-path');
		expect(config.checkouts.template).toBe('checkouts-template');
		expect(config.records.paths[0].pattern).toBe('*.art');
	});

	it('GIVEN a successful load it writes the bundle into the cache and skips the root-level file', async () => {
		const tempDir = makeTempDir(tempDirs);
		writeFileSync(join(tempDir, '.art-workspace.mts'), `export default ${SOME_CONFIG}`);

		await loadWorkspaceConfig(tempDir);

		expect(existsSync(resolveBundlePath(tempDir))).toBe(true);
		expect(existsSync(join(tempDir, '.art-workspace-bundle.mjs'))).toBe(false);
	});

	it('GIVEN a legacy root-level bundle exists a load removes it', async () => {
		const tempDir = makeTempDir(tempDirs);
		writeFileSync(join(tempDir, '.art-workspace.mts'), `export default ${SOME_CONFIG}`);
		const legacyBundlePath = join(tempDir, '.art-workspace-bundle.mjs');
		writeFileSync(legacyBundlePath, 'export default {};');

		await loadWorkspaceConfig(tempDir);

		expect(existsSync(legacyBundlePath)).toBe(false);
	});

	it('WHEN the cache directory cannot be created it warns and still returns a config', async () => {
		const tempDir = makeTempDir(tempDirs);
		writeFileSync(join(tempDir, '.art-workspace.mts'), `export default ${SOME_CONFIG}`);
		writeFileSync(join(tempDir, 'node_modules'), 'not-a-directory');
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const config = await loadWorkspaceConfig(tempDir);

		expect(warn).toHaveBeenCalledWith(expect.stringContaining(resolveCacheDir(tempDir)));
		expect(config.clone.path).toBe('clone-path');
		expect(config.records.paths[0].pattern).toBe('*.art');
	});

	it('reports the manifest path when the manifest throws on import', async () => {
		const tempDir = makeTempDir(tempDirs);
		writeFileSync(join(tempDir, '.art-workspace.mts'), "throw new Error('boom');\n");

		await expect(loadWorkspaceConfig(tempDir)).rejects.toThrow(/\.art-workspace\.mts/);
	});
});
