import type { Checkout } from './types';

export interface CheckoutStore {
	addCheckout: (checkout: Checkout) => void;
	getCheckoutForLocation: (location: string) => Checkout | undefined;
	getCheckoutOfRepo: (name: string) => Checkout | undefined;
	getCheckoutByName: (name: string) => Checkout | undefined;
	getCheckoutsByPattern: (patterns: string[]) => Checkout[];
	updateCheckout: (checkout: Checkout) => void;
	getAllCheckouts: () => Checkout[];
}

function matchCheckoutByName(checkouts: Map<string, Checkout>, name: string): Checkout | undefined {
	const n = name.toLowerCase();
	return Array.from(checkouts.values()).find(checkout => checkout.record.name.toLowerCase() === n);
}

function matchCheckoutByLocation(
	checkouts: Map<string, Checkout>,
	location: string,
): Checkout | undefined {
	return checkouts.get(location);
}

function patternToRegex(pattern: string): RegExp {
	const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
	const globbed = escaped.replace(/\*/g, '.*');
	return new RegExp(`^${globbed}$`, 'i');
}

function isWildcardPattern(pattern: string): boolean {
	return pattern.includes('*');
}

export function createCheckoutStore(): CheckoutStore {
	const checkouts = new Map<string, Checkout>();

	function addCheckout(checkout: Checkout) {
		const existing = checkouts.get(checkout.record.location);
		if (existing) {
			const msg = `Duplicate location: "${checkout.record.location}", existing: "${existing.record.name}" duplicate: "${checkout.record.name}".`;
			console.error(msg);
		} else {
			checkouts.set(checkout.record.location, checkout);
		}
	}

	return {
		addCheckout,

		getCheckoutForLocation(location: string): Checkout | undefined {
			return matchCheckoutByLocation(checkouts, location);
		},

		getCheckoutOfRepo(name: string): Checkout | undefined {
			const n = name.toLowerCase();
			return Array.from(checkouts.values()).find(
				checkout => checkout.repo?.name.toLowerCase() === n,
			);
		},

		getCheckoutByName(name: string): Checkout | undefined {
			return matchCheckoutByName(checkouts, name);
		},

		getCheckoutsByPattern(patterns: string[]): Checkout[] {
			const matched = new Map<string, Checkout>(); // keyed by record.location for dedup

			for (const pattern of patterns) {
				let patternMatched = false;

				for (const checkout of checkouts.values()) {
					let nameMatch = false;
					let locationMatch = false;

					if (isWildcardPattern(pattern)) {
						// Wildcard mode: regex match against name and location
						const regex = patternToRegex(pattern);
						nameMatch = regex.test(checkout.record.name);
						locationMatch = regex.test(checkout.record.location);
					} else {
						// Exact mode: only exact match, no fallback
						nameMatch = matchCheckoutByName(checkouts, pattern) === checkout;
						locationMatch = matchCheckoutByLocation(checkouts, pattern) === checkout;
					}

					if (nameMatch || locationMatch) {
						matched.set(checkout.record.location, checkout);
						patternMatched = true;
					}
				}

				if (!patternMatched) {
					console.warn(`no checkout matches pattern: "${pattern}"`);
				}
			}

			return Array.from(matched.values());
		},

		updateCheckout(checkout: Checkout): void {
			checkouts.set(checkout.record.location, checkout);
		},

		getAllCheckouts(): Checkout[] {
			return Array.from(checkouts.values());
		},
	};
}
