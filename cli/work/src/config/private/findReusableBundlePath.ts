import { existsSync } from 'node:fs';

import { resolveBundlePath, resolveMetaPath } from '../cache.js';
import type { ConfigCacheInput } from '../types.js';

import { hashConfigInputs } from './hashConfigInputs.js';
import { readConfigCacheMeta } from './readConfigCacheMeta.js';

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
	const cacheMeta = await readConfigCacheMeta(resolveMetaPath(rootPath));

	if (cacheMeta === null) {
		return null;
	}

	const bundlePath = resolveBundlePath(rootPath);

	if (!existsSync(bundlePath)) {
		return null;
	}

	let currentInputs: ConfigCacheInput[];

	try {
		currentInputs = await hashConfigInputs(
			rootPath,
			cacheMeta.inputs.map(input => input.path),
		);
	} catch {
		return null;
	}

	return hasUnchangedInputs(cacheMeta.inputs, currentInputs) ? bundlePath : null;
}
