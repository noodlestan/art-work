import path, { join } from 'node:path';

import type { WorkspaceConfig } from '../../config/index.js';
import type { RepositoryRecord } from '../resources/types.js';

import { safePath } from './safePath.js';
import type { Checkout } from './types.js';

export type { Checkout } from './types.js';

export function createCheckout(
	config: WorkspaceConfig,
	target: string,
	repo?: RepositoryRecord,
	branch?: string,
	name?: string,
): Checkout {
	const basePath = join(config.root.path, config.clone.path);
	const l = safePath(target);
	const r = repo;
	const b = branch ?? 'main';
	const n = name || (r?.name ? r?.name + ' @ ' + target : target);

	return {
		repo: r,
		record: { name: n, location: l, branch: b, repository: r?.name },
		path: path.join(basePath, l),
	};
}
