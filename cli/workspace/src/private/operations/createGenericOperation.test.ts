import { describe, expect, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation.js';

describe('createGenericOperation', () => {
	it('WHEN an operation is created it sets operation and data', () => {
		const op = createGenericOperation('boot', ['one', 'two']);
		expect(op.operation).toBe('boot');
		expect(op.outcome).toBe('pending');
		expect(op.data).toEqual(['one', 'two']);
	});

	it('WHEN an operation has data its message returns JSON.stringify(data)', () => {
		const op = createGenericOperation('boot', { a: 1 });
		expect(op.message()).toBe(JSON.stringify({ a: 1 }));
	});

	it('WHEN an operation is pending its timing returns NaN', () => {
		const op = createGenericOperation('boot');
		expect(op.timing()).toBeNaN();
	});
});
