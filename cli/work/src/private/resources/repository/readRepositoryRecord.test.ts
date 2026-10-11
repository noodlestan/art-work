import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeRecordFileMock } from '../../../test/helpers/records/makeRecordFileMock.js';
import { writeRepoMockRecord } from '../../../test/helpers/records/writeRepoMockRecord.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs.js';

import { readRepositoryRecord } from './readRepositoryRecord.js';

export const tempDirs: string[] = [];

const makeRecordFile = (filename: string) => makeRecordFileMock(dirname(filename), filename);

afterEach(async () => {
	await removeTempDirs(tempDirs);
	vi.restoreAllMocks();
});

beforeEach(() => {
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('readRepositoryRecord', () => {
	it('WHEN a record file is read it parses name, remote, purpose, description and consumers', async () => {
		const tempDir = makeTempDir(tempDirs);

		writeRepoMockRecord(tempDir, 'Artificial', `git@github.com:noodlestan/artificial.git`);

		const record = await readRepositoryRecord(
			makeRecordFile(join(tempDir, '_records/artificial.art')),
		);

		expect(record).not.toBeNull();
		if (!record) return;
		expect(record.name).toBe('Artificial');
		expect(record.remote).toBe('git@github.com:noodlestan/artificial.git');
		expect(record.purpose).toBe('test');
		expect(record.description).toBe(undefined);
	});

	it('WHEN the record file is missing it returns null', async () => {
		const tempDir = makeTempDir(tempDirs);
		const record = await readRepositoryRecord(makeRecordFile(join(tempDir, 'missing.art')));

		expect(record).toBeNull();
	});

	it('WHEN the kind heading is absent it returns null', async () => {
		const tempDir = makeTempDir(tempDirs);
		const file = join(tempDir, 'noheading.art');
		writeFileSync(
			file,
			'# Module\n\n**Purpose:** test\n\n**Remote:** `git@example.com:test.git`\n',
		);

		const record = await readRepositoryRecord(makeRecordFile(file));

		expect(record).toBeNull();
	});

	it('WHEN the remote is missing it warns and uses defaults', async () => {
		const tempDir = makeTempDir(tempDirs);
		const file = join(tempDir, 'norepo.art');
		writeFileSync(file, '# Module\n\n## Repository: NoRemote\n\n**Purpose:** test\n');

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const record = await readRepositoryRecord(makeRecordFile(file));

		expect(record).not.toBeNull();
		if (!record) return;
		expect(record.name).toBe('NoRemote');
		expect(record.remote).toBe('');
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('missing remote'));
	});
});
