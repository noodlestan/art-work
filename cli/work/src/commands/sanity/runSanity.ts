import { doPullWorkspaceCheckout } from '../../private/commands/workspaces/doPullWorkspaceCheckout';
import { scanWorkspaceCheckout } from '../../private/commands/workspaces/scanWorkspaceCheckout';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';
import { presentCheckoutReport } from '../../private/present/presentCheckoutReport';
import { presentExtraneousReport } from '../../private/present/presentExtraneousReport';
import { presentOperationsReport } from '../../private/present/presentOperationsReport';
import { presentWorkspaceReport } from '../../private/present/presentWorkspaceReport';
import { loadCheckoutRecords } from '../../private/resources/checkout/loadCheckoutRecords';
import { loadRepositoryRecords } from '../../private/resources/repository/loadRepositoryRecords';
import { hydrateStoreFromRecords } from '../../private/store/hydrateStoreFromRecords';
import { scanAllCheckoutsStates } from '../../private/store/scanAllCheckoutsStates';

import { scanExtraneousCheckouts } from './private/scanExtraneousCheckouts';
import { syncCheckouts } from './private/syncCheckouts';

export async function runSanity(
	ctx: WorkspaceContext,
	options: { auto: boolean; refetch?: boolean },
): Promise<void> {
	const repos = await loadRepositoryRecords(ctx);
	const records = await loadCheckoutRecords(ctx, repos);
	hydrateStoreFromRecords(ctx.config, ctx.store, records);

	ctx.log.log(createGenericOperation('command', ['sanity', options.auto]));

	await scanWorkspaceCheckout(ctx, options.refetch);

	await scanAllCheckoutsStates(ctx, options.refetch);
	if (options.auto) {
		await doPullWorkspaceCheckout(ctx);
		await syncCheckouts(ctx);
	}

	const extraneous = await scanExtraneousCheckouts(ctx, ctx.store);

	const workspaceIssues = ctx.workspace?.scan
		? ctx.workspace.scan
				.issues()
				.filter(i => i !== 'unknown project' && i !== 'no remote' && i !== 'wrong remote')
		: [];
	const filteredWorkspace = ctx.workspace
		? {
				...ctx.workspace,
				scan: ctx.workspace.scan
					? { ...ctx.workspace.scan, issues: () => workspaceIssues }
					: undefined,
			}
		: undefined;

	presentWorkspaceReport(filteredWorkspace);
	presentCheckoutReport(ctx.config, ctx.store.getAllCheckouts());
	presentExtraneousReport(extraneous);
	presentOperationsReport(ctx.log);
}
