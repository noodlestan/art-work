import { existsSync } from 'node:fs';

import type { ConfigCacheInput } from '../types.js';

import { resolveBundlePath } from './cache/resolveBundlePath.js';
import { resolveMetaPath } from './cache/resolveMetaPath.js';
import { readConfigCacheMeta } from './readConfigCacheMeta.js';
import { tryHashConfigInputs } from './tryHashConfigInputs.js';

function hasUnchangedInputs(
	recordedInputs: ConfigCacheInput[],
	currentInputs: ConfigCacheInput[],
): boolean {
	return currentInputs.every(currentInput => {
		const recordedInput = recordedInputs.find(recorded => recorded.path === currentInput.path);

		return recordedInput !== undefined && recordedInput.hash === currentInput.hash;
	});
}

export async function findReusableBundlePath(rootPath: string): Promise<string | null> {
	const metaPath = resolveMetaPath(rootPath);
	const cacheMeta = await readConfigCacheMeta(metaPath);

	if (cacheMeta === null) {
		return null;
	}

	const bundlePath = resolveBundlePath(rootPath);

	if (!existsSync(bundlePath)) {
		return null;
	}

	const inputPaths = cacheMeta.inputs.map(input => input.path);
	const currentInputs = await tryHashConfigInputs(rootPath, inputPaths);

	if (!currentInputs) {
		return null;
	}

	return hasUnchangedInputs(cacheMeta.inputs, currentInputs) ? bundlePath : null;
}
