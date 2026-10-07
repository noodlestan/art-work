import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

import { BUILD_HINT, BUNDLE, ENCODING, PACKAGE_ROOT } from './constants';
import type { TestCliOptions, TestCliResult } from './types';

function readBundlePath(): string {
	if (!existsSync(BUNDLE)) {
		throw new Error(`Cannot spawn art-work-cli: the bin bundle is missing, ${BUILD_HINT}`);
	}
	return BUNDLE;
}

export async function spawnCli(options: TestCliOptions): Promise<TestCliResult> {
	const bundle = readBundlePath();

	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [bundle, ...options.args], {
			cwd: options.cwd ?? PACKAGE_ROOT,
		});

		let stdout = '';
		let stderr = '';
		child.stdout.setEncoding(ENCODING);
		child.stderr.setEncoding(ENCODING);
		child.stdout.on('data', (chunk: string) => {
			stdout += chunk;
		});
		child.stderr.on('data', (chunk: string) => {
			stderr += chunk;
		});
		child.on('error', reject);
		child.on('close', code => {
			resolve({ code: code ?? 0, stdout, stderr });
		});
		child.stdin.end(options.stdin ?? '');
	});
}
