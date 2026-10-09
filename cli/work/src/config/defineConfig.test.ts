import { describe, expect, it } from 'vitest';

import { makeConfigMock } from '../test/helpers/context/makeConfigMock.js';

import { defineConfig } from './index.js';

describe('defineConfig', () => {
	it('returns the input config unchanged', () => {
		const config = makeConfigMock('.');

		expect(defineConfig(config)).toEqual(config);
	});
});
