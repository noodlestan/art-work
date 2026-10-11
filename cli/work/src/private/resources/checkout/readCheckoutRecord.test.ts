import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeConfigMock } from '../../../test/helpers/context/makeConfigMock.js';
import { makeRecordFileMock } from '../../../test/helpers/records/makeRecordFileMock.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs.js';

import { readCheckoutRecord } from './readCheckoutRecord.js';
import { saveCheckoutRecord } from './saveCheckoutRecord.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('readCheckoutRecord', () => {
	it('WHEN a checkout record is saved it is read back in a round-trip', async () => {
		const tempDir = makeTempDir(tempDirs);
		const config = makeConfigMock(tempDir);
		const file = join(tempDir, 'test.art');
		const data = { name: 'Artificial', location: 'checkouts/artificial', branch: 'main' };

		const saved = await saveCheckoutRecord(config, data, file);
		const read = await readCheckoutRecord(makeRecordFileMock(tempDir, saved));

		expect(read).toEqual(data);
	});

	it('WHEN the file is missing it returns null', async () => {
		const tempDir = makeTempDir(tempDirs);
		const file = join(tempDir, 'missing.art');

		const read = await readCheckoutRecord(makeRecordFileMock(tempDir, file));

		expect(read).toBeNull();
	});

	it('WHEN the kind heading is absent it returns null', async () => {
		const tempDir = makeTempDir(tempDirs);
		const file = join(tempDir, 'noheading.art');
		writeFileSync(file, '# Module\n\n**Location:** `checkouts/test`\n\n**Branch:** `main`\n');

		const read = await readCheckoutRecord(makeRecordFileMock(tempDir, file));

		expect(read).toBeNull();
	});

	it('WHEN the record has malformed lines it warns and uses defaults', async () => {
		const tempDir = makeTempDir(tempDirs);
		const file = join(tempDir, 'malformed.art');
		writeFileSync(file, '# Module\n\n## Checkout: Test\n\n**Location:** `checkouts/test`\n');

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const read = await readCheckoutRecord(makeRecordFileMock(tempDir, file));

		expect(read).not.toBeNull();
		if (!read) return;
		expect(read.name).toBe('Test');
		expect(read.location).toBe('checkouts/test');
		expect(read.branch).toBe('main');
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('missing branch'));
	});
});
