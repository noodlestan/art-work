import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';

import { runUnlink } from './runUnlink.js';

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('unlink command', () => {
	it('FOR the unlink command it is a placeholder', async () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runUnlink(ctx, { root: '/tmp' });

		expect(infoSpy).toHaveBeenCalledWith('unlink command - TODO');
	});
});
