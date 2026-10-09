import type { Checkout } from '../../../private/store/createCheckout.js';

import { makeCheckoutScanMock } from './makeCheckoutScanMock.js';

export function makeWorkspaceCheckoutMock(path: string, overrides?: Partial<Checkout>): Checkout {
	return {
		repo: undefined,
		record: { name: 'Workspace', location: '.', branch: 'main', repository: undefined },
		path,
		scan: makeCheckoutScanMock([]),
		...overrides,
	};
}
