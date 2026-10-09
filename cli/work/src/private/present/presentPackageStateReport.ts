import type { PackageStateRecord } from '../resources/types.js';
import type { Checkout } from '../store/createCheckout.js';

import { formatTable } from './formatTable.js';

export function presentPackageStateReport(
	checkout: Checkout,
	packageStates: PackageStateRecord[],
): void {
	if (packageStates.length === 0) {
		return;
	}

	const headers = ['package', 'version', 'published', 'states'];
	const rows = packageStates.map(ps => [
		ps.canonicalName,
		ps.version ?? '-',
		ps.publishedVersion ?? '-',
		ps.states.join('; ') || '-',
	]);

	console.info('');
	console.info(`Packages for ${checkout.record.name}:`);
	console.info(`----------`);
	console.info(formatTable(rows, headers));
}
