import { describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';

import { runUnlink } from './runUnlink.js';

describe('unlink command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runUnlink(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('unlink command - TODO');
	});
});
