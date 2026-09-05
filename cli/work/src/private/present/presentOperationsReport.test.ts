import { afterEach, describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';
import { createCloneOperation } from '../commands/operations/createCloneOperation';
import { createOperationsLog } from '../log/createOperationsLog';
import { createOperationFailure } from '../operations/createOperationFailure';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import type { ClonePending } from '../operations/types';
import { createCheckout } from '../store/createCheckout';

import { makeOperationLogLine } from './makeOperationLogLine';
import { presentOperationsReport } from './presentOperationsReport';

function makeClonePendingOperationMock(): ClonePending {
	return {
		ts: new Date(),
		checkout: undefined,
		outcome: 'pending',
		operation: 'clone',
		location: 'checkouts/my-repo',
		message() {
			return 'cloning my-repo';
		},
		timing() {
			return NaN;
		},
	};
}

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('presentOperationsReport', () => {
	it('no output when the log is empty', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const log = createOperationsLog();

		presentOperationsReport(log);

		expect(spy).not.toHaveBeenCalled();
	});

	it('prints Operations Report: when operations exist', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const log = createOperationsLog();
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkout = createCheckout(ctx.config, 'my-repo', {
			name: 'MyRepo',
			remote: 'git@example.com:my-repo.git',
		});
		log.log(createOperationSuccess(createCloneOperation(checkout)));

		presentOperationsReport(log);

		expect(spy).toHaveBeenCalledWith('Operations Report:');
	});
});

describe('makeOperationLogLine', () => {
	it('renders a pending line with ⏳', () => {
		const line = makeOperationLogLine(makeClonePendingOperationMock());

		expect(line[0]).toBe('⏳');
		expect(line).toEqual(['⏳', 'clone', 'cloning my-repo']);
	});

	it('renders a success line with 🟢', () => {
		const tempDir = makeTempDir(tempDirs);
		const ctx = createMockCommandContext(tempDir);
		const checkout = createCheckout(ctx.config, 'my-repo', {
			name: 'MyRepo',
			remote: 'git@example.com:my-repo.git',
		});

		const line = makeOperationLogLine(createOperationSuccess(createCloneOperation(checkout)));

		expect(line[0]).toBe('🟢');
		expect(line).toEqual(['🟢', 'MyRepo', 'my-repo', 'clone', 'to my-repo', '0']);
	});

	it('renders a failure line with 🔴', () => {
		const line = makeOperationLogLine(
			createOperationFailure(createCloneOperation(undefined), new Error('boom')),
		);

		expect(line[0]).toBe('🔴');
		expect(line[1]).toBe('clone');
	});
});
