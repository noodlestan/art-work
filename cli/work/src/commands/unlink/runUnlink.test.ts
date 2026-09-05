import { describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';

import { runUnlink } from './runUnlink';

describe('unlink command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = createMockCommandContext('/tmp');

		await runUnlink(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('unlink command - TODO');
	});
});
