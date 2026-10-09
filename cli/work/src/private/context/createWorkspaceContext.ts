import type { WorkspaceConfig } from '../../config/types.js';
import type { OperationsLog } from '../log/createOperationsLog.js';
import type { Checkout } from '../store/createCheckout.js';
import type { CheckoutStore } from '../store/createCheckoutStore.js';

export interface WorkspaceContext {
	config: WorkspaceConfig;
	store: CheckoutStore;
	log: OperationsLog; // WIP Rename to `ops`
	workspace?: Checkout;
}

export function createWorkspaceContext(
	config: WorkspaceConfig,
	store: CheckoutStore,
	log: OperationsLog,
	workspace?: Checkout,
): WorkspaceContext {
	return { config, store, log, workspace };
}
