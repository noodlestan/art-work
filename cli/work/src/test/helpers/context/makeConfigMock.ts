import type { WorkspaceConfig } from '../../../config';

export function makeConfigMock(
	rootPath: string,
	overrides?: Partial<WorkspaceConfig>,
): WorkspaceConfig {
	return {
		clone: { path: 'checkouts' },
		root: { path: rootPath },
		checkouts: { path: '_records/', template: 'checkout.art.njk' },
		records: {
			paths: [
				{
					base: '.',
					pattern: '*.art',
					ignored: ['node_modules/', '.git/', 'dist/'],
					excluded: [],
					gitignore: true,
				},
			],
		},
		output: {
			mode: 'quiet',
		},
		...overrides,
	};
}
