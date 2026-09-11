import { runWithConcurrency } from '../../private/async/runWithConcurrency';
import { doPushCheckout } from '../../private/commands/checkouts/doPushCheckout';
import { doPushWorkspaceCheckout } from '../../private/commands/workspaces/doPushWorkspaceCheckout';
import { scanWorkspaceCheckout } from '../../private/commands/workspaces/scanWorkspaceCheckout';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';
import { presentCheckoutReport } from '../../private/present/presentCheckoutReport';
import { presentOperationsReport } from '../../private/present/presentOperationsReport';
import { loadCheckoutRecords } from '../../private/resources/checkout/loadCheckoutRecords';
import { loadRepositoryRecords } from '../../private/resources/repository/loadRepositoryRecords';
import { scanCheckoutState } from '../../private/scan/scanCheckoutState';
import { hydrateStoreFromRecords } from '../../private/store/hydrateStoreFromRecords';

export async function runPush(
	ctx: WorkspaceContext,
	options: { checkouts?: string[]; all?: boolean } = {},
): Promise<void> {
	const repos = await loadRepositoryRecords(ctx);
	const records = await loadCheckoutRecords(ctx, repos);
	hydrateStoreFromRecords(ctx.config, ctx.store, records);

	ctx.log.log(createGenericOperation('command', ['push', options.checkouts]));

	if (!options.all && (!options.checkouts || options.checkouts.length === 0)) {
		console.error('No checkouts matched.');
		console.error(
			`Usage: Use \`art-workspace push [options] -c <pattern>\` or \`art-workspace push [options] --all\` if you want to apply the push to all checkouts.`,
		);
		return;
	}

	const checkouts = options.all
		? ctx.store.getAllCheckouts()
		: ctx.store.getCheckoutsByPattern(options.checkouts ?? []);

	await runWithConcurrency(checkouts, 4, async checkout => {
		const scanned = await scanCheckoutState(ctx, checkout, true);
		ctx.store.updateCheckout(scanned);
		if (scanned.scan?.can?.('push')) {
			await doPushCheckout(ctx, scanned);
		}
	});

	await scanWorkspaceCheckout(ctx);
	await doPushWorkspaceCheckout(ctx);

	presentCheckoutReport(ctx.config, checkouts);
	presentOperationsReport(ctx.log);
}
