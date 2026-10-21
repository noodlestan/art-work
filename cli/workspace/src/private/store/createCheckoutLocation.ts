import type { RepositoryRecord } from '../resources/types.js';

import { safePath } from './safePath.js';

export function createCheckoutLocation(repo: RepositoryRecord, target?: string): string {
	return safePath(target ? repo.name + ' ' + target : repo.name);
}
