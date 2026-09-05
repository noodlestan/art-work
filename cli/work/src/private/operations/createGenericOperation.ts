import type { OperationPending } from './types';

function formatData(data: unknown): string {
	return data ? JSON.stringify(data) : '';
}

export function createGenericOperation(operation: string, data?: unknown): OperationPending {
	return {
		ts: new Date(),
		outcome: 'pending',
		operation,
		data,
		message() {
			return formatData(data);
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
