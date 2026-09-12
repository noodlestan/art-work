import type { OperationBase } from '../operations/types';

import { truncateMiddle } from './private/truncateMiddle';

export function makeOperationLogLine(
	op: OperationBase,
	options: { standalone?: boolean } = {},
): string[] {
	const { standalone } = options;

	const timing = standalone ? `(${op.timing()}ms)` : String(op.timing());

	const repo = op.checkout?.repo?.name ?? (op.checkout ? 'WORKSPACE' : '-');
	const checkout = op.checkout?.record.location ?? '-';

	return [
		op.outcome === 'pending' ? '⏳' : op.outcome === 'success' ? '🟢' : '🔴',
		repo,
		checkout,
		op.operation,
		truncateMiddle(op.message(), 50),
		op.finishedTs ? timing : '',
	];
}
