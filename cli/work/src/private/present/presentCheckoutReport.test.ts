import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeConfigMock } from '../../test/helpers/context/makeConfigMock';
import { makeTempDir } from '../../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../../test/helpers/tempDirs/removeTempDirs';

import { presentCheckoutReport } from './presentCheckoutReport';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

describe('presentCheckoutReport', () => {
	it('calls console.info with Checkouts:', () => {
		const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const tempDir = makeTempDir(tempDirs);
		const config = makeConfigMock(tempDir);

		presentCheckoutReport(config, []);

		expect(spy).toHaveBeenCalledWith('Checkouts:');
	});
});
