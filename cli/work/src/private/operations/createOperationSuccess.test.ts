import { afterEach, describe, expect, it } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import { createPullOperation } from '../commands/operations/createPullOperation';
import { createCheckout } from '../store/createCheckout';

import { createOperationSuccess } from './createOperationSuccess';

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

describe('createOperationSuccess', () => {
	it('preserves message from the pending, sets outcome/finishedTs', () => {
		const pending = makePullPending();
		const success = createOperationSuccess(pending);

		expect(success.outcome).toBe('success');
		expect(success.operation).toBe('pull');
		expect(success.message()).toBe(pending.message());
		expect(success.finishedTs).toBeDefined();
		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});

	it('uses the message override when provided', () => {
		const success = createOperationSuccess(makePullPending(), 'switched to feat/x');
		expect(success.message()).toBe('switched to feat/x');
	});

	it('clones the pending data (checkout present)', () => {
		const success = createOperationSuccess(makePullPending());
		expect(success.checkout?.repo?.name).toBe('MyRepo');
	});
});
