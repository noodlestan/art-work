import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUNDLE = join(PACKAGE_ROOT, 'dist', 'index.mjs');
const ENCODING = 'utf8';
const BUILD_HINT = 'run `npm run build` in the @art-work/cli package first';

export type CliOptions = {
	args: string[];
	stdin?: string;
};

export type CliResult = {
	code: number;
	stdout: string;
	stderr: string;
};

function readBundlePath(): string {
	if (!existsSync(BUNDLE)) {
		throw new Error(`Cannot spawn art-work-cli: the bin bundle is missing, ${BUILD_HINT}`);
	}
	return BUNDLE;
}

export async function spawnCli(options: CliOptions): Promise<CliResult> {
	const bundle = readBundlePath();

	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [bundle, ...options.args], {
			cwd: PACKAGE_ROOT,
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
