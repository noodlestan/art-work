import {
	type WorkspaceContext,
	createWorkspaceContext,
} from '../../../private/context/createWorkspaceContext.js';
import { createOperationsLog } from '../../../private/log/createOperationsLog.js';
import type { Checkout } from '../../../private/store/createCheckout.js';
import { createCheckoutStore } from '../../../private/store/createCheckoutStore.js';

import { makeConfigMock } from './makeConfigMock.js';

export function makeCommandContextMock(tempDir: string, workspace?: Checkout): WorkspaceContext {
	const config = makeConfigMock(tempDir);
	const store = createCheckoutStore();
	const log = createOperationsLog();
	const ctx = createWorkspaceContext(config, store, log, workspace);
	return ctx;
}
