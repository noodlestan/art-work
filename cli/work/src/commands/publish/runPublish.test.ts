import { describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';

import { runPublish } from './runPublish';

describe('publish command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = createMockCommandContext('/tmp');

		await runPublish(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('publish command - TODO');
	});
});
