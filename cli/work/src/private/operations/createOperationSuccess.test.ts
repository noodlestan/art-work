import { afterEach, describe, expect, it } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs.js';
import { createPullOperation } from '../commands/operations/createPullOperation.js';
import { createCheckout } from '../store/createCheckout.js';

import { createOperationSuccess } from './createOperationSuccess.js';

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

describe('createOperationSuccess', () => {
	it('WHEN a success is created from a pending operation, it preserves the message and sets completion metadata', () => {
		const pending = makePullPending();
		const success = createOperationSuccess(pending);

		expect(success.outcome).toBe('success');
		expect(success.operation).toBe('pull');
		expect(success.message()).toBe(pending.message());
		expect(success.finishedTs).toBeDefined();
		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});

	it('WHEN an override is provided it uses it as the message', () => {
		const success = createOperationSuccess(makePullPending(), 'switched to feat/x');
		expect(success.message()).toBe('switched to feat/x');
	});

	it('GIVEN the pending has a checkout it clones the pending data', () => {
		const success = createOperationSuccess(makePullPending());
		expect(success.checkout?.repo?.name).toBe('MyRepo');
	});
});
