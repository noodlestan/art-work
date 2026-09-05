import type { Operation } from '../operations/types';

export interface OperationsLog {
	log(operation: Operation): void;
	all(): Operation[];
	since(ts: Date): Operation[];
	latest(n: number): Operation[];
}

export function createOperationsLog(logger: (op: Operation) => void = () => {}): OperationsLog {
	const operations: Operation[] = [];

	return {
		log(operation: Operation): void {
			logger(operation);

			if (operation.outcome !== 'pending') {
				operations.push(operation);
			}
		},

		all(): Operation[] {
			return [...operations];
		},

		since(ts: Date): Operation[] {
			return operations.filter(op => op.ts > ts);
		},

		latest(n: number): Operation[] {
			return operations.slice(-n);
		},
	};
}
