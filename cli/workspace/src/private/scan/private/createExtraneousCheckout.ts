import type { WorkspaceConfig } from '../../../config/types.js';
import { createCheckout } from '../../store/createCheckout.js';
import type { Checkout } from '../../store/types.js';

export function createExtraneousCheckout(config: WorkspaceConfig, location: string): Checkout {
	return createCheckout(config, location, undefined, '', location);
}
