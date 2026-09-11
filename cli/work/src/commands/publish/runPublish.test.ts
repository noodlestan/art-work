import { describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock';

import { runPublish } from './runPublish';

describe('publish command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runPublish(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('publish command - TODO');
	});
});
