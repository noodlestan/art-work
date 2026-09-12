import type { Operation } from '../operations/types';
import { makeOperationLogLine } from '../present/makeOperationLogLine';

export interface LoggerAPI {
	log: (op: Operation) => void;
	setOutputMode: (mode: string | undefined) => void;
}

function isValidOutputMode(mode: string | undefined): mode is 'quiet' | 'verbose' {
	return mode === 'quiet' || mode === 'verbose';
}

export function createLogger(): LoggerAPI {
	let mode: 'quiet' | 'verbose' | undefined;
	const buffer: Operation[] = [];

	function flush(): void {
		for (const op of buffer) {
			console.info(makeOperationLogLine(op, { standalone: true }).join(' | '));
		}
		buffer.length = 0;
	}

	return {
		log(op: Operation): void {
			if (mode === undefined) {
				buffer.push(op);
				return;
			}

			if (mode === 'verbose') {
				console.info(makeOperationLogLine(op, { standalone: true }).join(' | '));
			}
			// quiet mode discards all pending and future pending ops
		},

		setOutputMode(newMode: string | undefined): void {
			mode = isValidOutputMode(newMode) ? newMode : 'quiet';

			if (mode === 'verbose') {
				flush();
			} else {
				buffer.length = 0;
			}
		},
	};
}
