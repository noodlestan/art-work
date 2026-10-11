import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeCommandContextMock } from '../../test/helpers/context/makeCommandContextMock.js';

import { runLink } from './runLink.js';

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('link command', () => {
	it('is a placeholder', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const ctx = makeCommandContextMock('/tmp');

		await runLink(ctx, { root: '/tmp' });

		expect(info).toHaveBeenCalledWith('link command - TODO');
	});
});
