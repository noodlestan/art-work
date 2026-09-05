import type { OperationPending, OperationSuccess } from './types';

export function createOperationSuccess<T extends OperationPending>(
	pending: T,
	message?: string,
): OperationSuccess {
	return {
		...pending,
		outcome: 'success',
		finishedTs: new Date(),
		message: message ? () => message : pending.message,
	};
}
