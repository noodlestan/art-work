import {
	type WorkspaceContext,
	createWorkspaceContext,
} from '../../../private/context/createWorkspaceContext';
import { createOperationsLog } from '../../../private/log/createOperationsLog';
import type { Checkout } from '../../../private/store/createCheckout';
import { createCheckoutStore } from '../../../private/store/createCheckoutStore';

import { makeConfigMock } from './makeConfigMock';

export function makeCommandContextMock(tempDir: string, workspace?: Checkout): WorkspaceContext {
	const config = makeConfigMock(tempDir);
	const store = createCheckoutStore();
	const log = createOperationsLog();
	const ctx = createWorkspaceContext(config, store, log, workspace);
	return ctx;
}
