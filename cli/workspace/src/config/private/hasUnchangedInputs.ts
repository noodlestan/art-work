import type { ConfigCacheInput } from '../types.js';

export function hasUnchangedInputs(
	recordedInputs: ConfigCacheInput[],
	currentInputs: ConfigCacheInput[],
): boolean {
	return currentInputs.every(currentInput => {
		const recordedInput = recordedInputs.find(recorded => recorded.path === currentInput.path);

		return recordedInput !== undefined && recordedInput.hash === currentInput.hash;
	});
}
