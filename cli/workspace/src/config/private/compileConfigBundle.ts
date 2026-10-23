import { writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';

import { resolveBundlePath } from './cache/resolveBundlePath.js';
import { resolveCacheDir } from './cache/resolveCacheDir.js';
import { resolveMetaPath } from './cache/resolveMetaPath.js';
import { formatError } from './formatError.js';
import { makeConfigCacheMeta } from './makeConfigCacheMeta.js';

const FALLBACK_BUNDLE_FILE = 'art-works-config-bundle.mjs';

export async function compileConfigBundle(rootPath: string, manifestPath: string): Promise<string> {
	let output;
	try {
		output = await build({
			entryPoints: [manifestPath],
			bundle: true,
			write: false,
			format: 'esm',
			platform: 'node',
			metafile: true,
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

	console.info('⚙️ [config] rebuilt bundle');

	const bundleContent = output.outputFiles[0].text;
	const cacheBundlePath = resolveBundlePath(rootPath);

	try {
		await mkdir(resolveCacheDir(rootPath), { recursive: true });
		writeFileSync(cacheBundlePath, bundleContent);
		const inputKeys = Object.keys(output.metafile.inputs);
		const cacheMeta = await makeConfigCacheMeta(rootPath, manifestPath, inputKeys);
		writeFileSync(resolveMetaPath(rootPath), JSON.stringify(cacheMeta, null, '\t'));

		return cacheBundlePath;
	} catch (error) {
		const formattedError = formatError(error);
		const message = `Failed to write config cache at ${cacheBundlePath}: ${formattedError}; Falling back to temp bundle.`;
		console.warn(message);
		const fallbackBundlePath = join(tmpdir(), FALLBACK_BUNDLE_FILE);
		writeFileSync(fallbackBundlePath, bundleContent);

		return fallbackBundlePath;
	}
}
