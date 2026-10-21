import { spawn } from 'node:child_process';

export interface RunCommandOutcome {
	code: number | null;
	output: string;
	error: string;
}

export function runCommandInDirectory(dir: string, command: string): Promise<RunCommandOutcome> {
	return new Promise(resolve => {
		const child = spawn(command, { cwd: dir, shell: true });
		let output = '';
		let error = '';
		child.stdout?.on('data', chunk => (output += chunk));
		child.stderr?.on('data', chunk => (error += chunk));
		child.on('error', err => resolve({ code: null, output, error: err.message }));
		child.on('exit', code => resolve({ code, output, error }));
	});
}
