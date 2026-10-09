import { join } from 'node:path';

import type { WorkspaceConfig } from '../../../../config/types.js';
import type { CheckoutRecord } from '../../types.js';

export function makeCheckoutFilename(config: WorkspaceConfig, data: CheckoutRecord): string {
	const slug = data.name.toLowerCase().replace(/\s+/g, '-');
	return join(config.root.path, config.checkouts.path, `${slug}-checkout.art`);
}
