import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import { createPullOperation } from '../commands/operations/createPullOperation';
import { createCheckout } from '../store/createCheckout';

import { createOperationFailure } from './createOperationFailure';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

function makePullPending() {
	const tempDir = makeTempDir(tempDirs);
	const ctx = createMockCommandContext(tempDir);
	const checkout = createCheckout(ctx.config, 'my-repo', {
		name: 'MyRepo',
		remote: 'git@example.com:my-repo.git',
	});
	return createPullOperation(checkout, 'main');
}

describe('createOperationFailure', () => {
	it('message() extracts the reason from an error', () => {
		const failure = createOperationFailure(makePullPending(), new Error('rejected (not allowed)'));
		expect(failure.message()).toBe('not allowed');
	});

	it('errorSerialized() contains the operation error label', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.errorSerialized()).toContain('PullError');
	});

	it('sets operation, outcome and error', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.operation).toBe('pull');
		expect(failure.outcome).toBe('failure');
		expect(failure.error).toBe('boom');
	});

	it('clones the pending data (checkout present)', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.checkout?.repo?.name).toBe('MyRepo');
	});
});
