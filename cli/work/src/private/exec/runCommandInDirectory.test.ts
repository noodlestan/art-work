import { ChildProcess, spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';

import { describe, expect, it, vi } from 'vitest';

import { runCommandInDirectory } from './runCommandInDirectory.js';

vi.mock('node:child_process', async importOriginal => {
	const actual = await importOriginal<typeof import('node:child_process')>();
	return { ...actual, spawn: vi.fn() };
});

describe('runCommandInDirectory', () => {
	it('WHEN the command exits successfully it resolves with output', async () => {
		const mockChild = Object.assign(new EventEmitter(), {
			stdout: new EventEmitter(),
			stderr: new EventEmitter(),
		}) as ChildProcess;
		vi.mocked(spawn).mockReturnValue(mockChild);

		const promise = runCommandInDirectory('/tmp', 'echo hello');
		mockChild.stdout?.emit('data', 'hello\n');
		mockChild.emit('exit', 0);

		const result = await promise;
		expect(result.code).toBe(0);
		expect(result.output).toBe('hello\n');
		expect(result.error).toBe('');
	});

	it('WHEN the command fails it resolves with error output and a non-zero code', async () => {
		const mockChild = Object.assign(new EventEmitter(), {
			stdout: new EventEmitter(),
			stderr: new EventEmitter(),
		}) as ChildProcess;
		vi.mocked(spawn).mockReturnValue(mockChild);

		const promise = runCommandInDirectory('/tmp', 'exit 1');
		mockChild.stderr?.emit('data', 'something went wrong\n');
		mockChild.emit('exit', 1);

		const result = await promise;
		expect(result.code).toBe(1);
		expect(result.output).toBe('');
		expect(result.error).toBe('something went wrong\n');
	});
});
