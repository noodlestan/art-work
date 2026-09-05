import { describe, expect, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation';

describe('createGenericOperation', () => {
	it('sets operation and data', () => {
		const op = createGenericOperation('boot', ['one', 'two']);
		expect(op.operation).toBe('boot');
		expect(op.outcome).toBe('pending');
		expect(op.data).toEqual(['one', 'two']);
	});

	it('message() returns JSON.stringify(data)', () => {
		const op = createGenericOperation('boot', { a: 1 });
		expect(op.message()).toBe(JSON.stringify({ a: 1 }));
	});

	it('timing() is NaN while pending', () => {
		const op = createGenericOperation('boot');
		expect(op.timing()).toBeNaN();
	});
});
