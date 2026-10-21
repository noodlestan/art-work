import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const LEGACY_BUNDLE_FILE = '.art-workspace-bundle.mjs';

export function removeLegacyBundle(rootPath: string): void {
	const legacyBundlePath = join(rootPath, LEGACY_BUNDLE_FILE);

	if (!existsSync(legacyBundlePath)) {
		return;
	}

	try {
		rmSync(legacyBundlePath, { force: true });
	} catch {
		// Best-effort cleanup of the legacy root-level bundle; never fail on it.
	}
}
