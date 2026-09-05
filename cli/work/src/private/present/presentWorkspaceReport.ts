import type { Checkout } from '../store/types';

export function presentWorkspaceReport(workspace?: Checkout): void {
	if (!workspace) {
		return;
	}

	const remote = workspace.scan?.state('remote').hasRemote
		? workspace.scan.state('remote').branch || workspace.record.branch
		: undefined;
	const issues = workspace.scan?.issues().join('; ');
	const branch = workspace.scan?.state('remote').branch || workspace.record.branch;

	console.info('Workspace:');
	console.info(`  remote: ${remote ?? 'none'}`);
	console.info(`  path:   ${workspace.path}`);
	console.info(`  branch: ${branch}`);
	console.info(`  issues: ${issues || '-'}`);
	console.info('');
}
