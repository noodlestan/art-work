import { existsSync, writeFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { build } from 'esbuild';

import { resolveBundlePath, resolveCacheDir } from './cache.js';
import { defineConfig } from './defineConfig.js';
import type { PartialWorkspaceConfig, WorkspaceConfig } from './types.js';

const MANIFEST_FILE = '.art-workspace.mts';
const LEGACY_BUNDLE_FILE = '.art-workspace-bundle.mjs';
const FALLBACK_BUNDLE_FILE = 'art-work-config-bundle.mjs';

const DEFAULT_CONFIG: PartialWorkspaceConfig = {
	clone: { path: 'checkouts' },
	checkouts: {
		path: '_records/',
		template: '.agents/domains/workspace/templates/checkout.art.njk',
	},
	records: {
		base: '.',
		pattern: '*.art',
		ignored: ['node_modules/', '.git/', 'dist/'],
		excluded: [],
		gitignore: true,
	},
};

function formatError(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

export async function loadWorkspaceConfig(rootPath: string): Promise<WorkspaceConfig> {
	const manifestPath = join(rootPath, MANIFEST_FILE);

	if (!existsSync(manifestPath)) {
		console.warn(`${MANIFEST_FILE} not found at ${rootPath}; Using default config.`);
		return defineConfig({ ...DEFAULT_CONFIG, root: { path: rootPath } });
	}

	let output;
	try {
		output = await build({
			entryPoints: [manifestPath],
			bundle: true,
			write: false,
			format: 'esm',
			platform: 'node',
			external: [
				'node:fs',
				'node:os',
				'node:path',
				'node:url',
				'fs',
				'os',
				'path',
				'url',
				'esbuild',
				'simple-git',
			],
		});
	} catch (error) {
		throw new Error(
			`Failed to bundle workspace manifest at ${manifestPath}: ${formatError(error)}`,
		);
	}

	const bundleContent = output.outputFiles[0].text;
	const cacheBundlePath = resolveBundlePath(rootPath);
	let bundlePath = cacheBundlePath;

	try {
		await mkdir(resolveCacheDir(rootPath), { recursive: true });
		writeFileSync(cacheBundlePath, bundleContent);
	} catch (error) {
		console.warn(
			`Failed to write config cache at ${cacheBundlePath}: ${formatError(error)}; Falling back to temp bundle.`,
		);
		bundlePath = join(tmpdir(), FALLBACK_BUNDLE_FILE);
		writeFileSync(bundlePath, bundleContent);
	}

	const legacyBundlePath = join(rootPath, LEGACY_BUNDLE_FILE);
	if (existsSync(legacyBundlePath)) {
		try {
			await rm(legacyBundlePath, { force: true });
		} catch {
			// Best-effort cleanup of the legacy root-level bundle; never fail on it.
		}
	}

	try {
		const loaded = await import(pathToFileURL(bundlePath).href);
		const config = loaded.default as PartialWorkspaceConfig;
		return defineConfig({ ...config, root: { path: rootPath } });
	} catch (error) {
		throw new Error(`Failed to load workspace manifest at ${manifestPath}: ${formatError(error)}`);
	}
}
