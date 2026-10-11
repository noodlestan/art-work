import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';
import { createPullOperation } from '../commands/operations/createPullOperation.js';
import { createCheckout } from '../store/createCheckout.js';

import { createOperationFailure } from './createOperationFailure.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

function makePullPending() {
	const tempDir = makeTempDir(tempDirs);
	const ctx = makeCommandContextMock(tempDir);
	const checkout = createCheckout(ctx.config, 'my-repo', {
		name: 'MyRepo',
		remote: 'git@example.com:my-repo.git',
	});
	return createPullOperation(checkout, 'main');
}

describe('createOperationFailure', () => {
	it('WHEN an error contains a rejection reason, message() returns that reason', () => {
		const failure = createOperationFailure(makePullPending(), new Error('rejected (not allowed)'));
		expect(failure.message()).toBe('not allowed');
	});

	it('WHEN the failure is serialized it contains the operation error label', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.errorSerialized()).toContain('PullError');
	});

	it('WHEN a failure is created from an error, it preserves the operation, outcome, and error message', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.operation).toBe('pull');
		expect(failure.outcome).toBe('failure');
		expect(failure.error).toBe('boom');
	});

	it('GIVEN the pending has a checkout it clones the pending data', () => {
		const failure = createOperationFailure(makePullPending(), new Error('boom'));
		expect(failure.checkout?.repo?.name).toBe('MyRepo');
	});
});
