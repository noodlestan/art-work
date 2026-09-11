import type { Checkout } from '../../../private/store/createCheckout';

export function makeCheckoutMock(overrides?: Partial<Checkout>): Checkout {
	return {
		record: { name: 'MyRepo', location: 'my-repo', branch: 'main', repository: undefined },
		path: '/path/to/checkout',
		...overrides,
	};
}
