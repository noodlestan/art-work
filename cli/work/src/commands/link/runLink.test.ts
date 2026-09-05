import { describe, expect, it, vi } from 'vitest';

import { createMockCommandContext } from '../../test/helpers/context/createMockCommandContext';

import { runLink } from './runLink';

describe('link command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = createMockCommandContext('/tmp');

		await runLink(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('link command - TODO');
	});
});
