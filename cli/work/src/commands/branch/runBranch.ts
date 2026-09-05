import { doBranchCheckout } from '../../private/commands/checkouts/doBranchCheckout';
import { createBranchOperation } from '../../private/commands/operations/createBranchOperation';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';
import { createOperationFailure } from '../../private/operations/createOperationFailure';
import { presentCheckoutReport } from '../../private/present/presentCheckoutReport';
import { presentOperationsReport } from '../../private/present/presentOperationsReport';
import { loadCheckoutRecords } from '../../private/resources/checkout/loadCheckoutRecords';
import { loadRepositoryRecords } from '../../private/resources/repository/loadRepositoryRecords';
import { scanCheckoutState } from '../../private/scan/scanCheckoutState';
import { hydrateStoreFromRecords } from '../../private/store/hydrateStoreFromRecords';
import { scanAllCheckoutsStates } from '../../private/store/scanAllCheckoutsStates';

export async function runBranch(
	ctx: WorkspaceContext,
	options: { branch: string; checkouts?: string[]; all?: boolean },
): Promise<void> {
	const repos = await loadRepositoryRecords(ctx);
	const records = await loadCheckoutRecords(ctx, repos);
	hydrateStoreFromRecords(ctx.config, ctx.store, records);

	ctx.log.log(createGenericOperation('command', ['branch', options.branch, options.checkouts]));

	if (!options.all && (!options.checkouts || options.checkouts.length === 0)) {
		console.error('No checkouts matched.');
		console.error(
			`Usage: Use \`art-workspace branch [options] -c <pattern>\` or \`art-workspace branch [options] --all\` if you want to apply the branch to all checkouts.`,
		);
		return;
	}

	const { branch, checkouts } = options;
	const resolvedCheckouts = options.all
		? ctx.store.getAllCheckouts()
		: ctx.store.getCheckoutsByPattern(checkouts ?? []);

	for (const checkout of resolvedCheckouts) {
		const scanned = await scanCheckoutState(ctx, checkout);
		ctx.store.updateCheckout(scanned);

		if (!scanned.scan?.can?.('branch')) {
			ctx.log.log(
				createOperationFailure(createBranchOperation(scanned, branch), 'checkout not cloned'),
			);
			continue;
		}

		await doBranchCheckout(ctx, scanned, branch);
	}

	await scanAllCheckoutsStates(ctx);
	presentCheckoutReport(ctx.config, ctx.store.getAllCheckouts());
	presentOperationsReport(ctx.log);
}
