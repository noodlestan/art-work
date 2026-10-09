import { describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';

import { runPublish } from './runPublish.js';

describe('publish command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runPublish(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('publish command - TODO');
	});
});
