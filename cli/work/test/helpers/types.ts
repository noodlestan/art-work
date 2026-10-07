export type TestCliOptions = {
	args: string[];
	stdin?: string;
	/** Working directory of the spawned CLI. Defaults to the package root. */
	cwd?: string;
};

export type TestCliResult = {
	code: number;
	stdout: string;
	stderr: string;
};
