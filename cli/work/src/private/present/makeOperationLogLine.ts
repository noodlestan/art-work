import type { OperationBase } from '../operations/types';

import { truncateMiddle } from './private/truncateMiddle';

export function makeOperationLogLine(
	op: OperationBase,
	options: { standalone?: boolean } = {},
): string[] {
	const { standalone } = options;

	const timing = standalone ? `(${op.timing()}ms)` : String(op.timing());

	return [
		op.outcome === 'pending' ? '⏳' : op.outcome === 'success' ? '🟢' : '🔴',
		op.checkout?.repo?.name,
		op.checkout?.record.location,
		op.operation,
		truncateMiddle(op.message(), 50),
		op.finishedTs ? timing : '',
	].filter(Boolean) as string[];
}
