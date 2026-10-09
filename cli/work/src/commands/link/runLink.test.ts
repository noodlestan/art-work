import { describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';

import { runLink } from './runLink.js';

describe('link command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runLink(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('link command - TODO');
	});
});
