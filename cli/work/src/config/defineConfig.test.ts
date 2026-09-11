import { describe, expect, it } from 'vitest';

import { makeConfigMock } from '../test/helpers/context/makeConfigMock';

import { defineConfig } from './index';

describe('defineConfig', () => {
	it('returns the input config unchanged', () => {
		const config = makeConfigMock('.');

		expect(defineConfig(config)).toEqual(config);
	});
});
