import { runWithConcurrency } from '../../private/async/runWithConcurrency';
import { doPullCheckout } from '../../private/commands/checkouts/doPullCheckout';
import { doPullWorkspaceCheckout } from '../../private/commands/workspaces/doPullWorkspaceCheckout';
import { scanWorkspaceCheckout } from '../../private/commands/workspaces/scanWorkspaceCheckout';
import type { WorkspaceContext } from '../../private/context/createWorkspaceContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';
import { createOperationFailure } from '../../private/operations/createOperationFailure';
import { presentCheckoutReport } from '../../private/present/presentCheckoutReport';
import { presentOperationsReport } from '../../private/present/presentOperationsReport';
import { presentWorkspaceReport } from '../../private/present/presentWorkspaceReport';
import { loadCheckoutRecords } from '../../private/resources/checkout/loadCheckoutRecords';
import { loadRepositoryRecords } from '../../private/resources/repository/loadRepositoryRecords';
import { scanCheckoutState } from '../../private/scan/scanCheckoutState';
import { hydrateStoreFromRecords } from '../../private/store/hydrateStoreFromRecords';

export async function runPull(
	ctx: WorkspaceContext,
	options: { checkouts?: string[]; all?: boolean; workspace?: boolean } = {},
): Promise<void> {
	const repos = await loadRepositoryRecords(ctx);
	const records = await loadCheckoutRecords(ctx, repos);
	hydrateStoreFromRecords(ctx.config, ctx.store, records);

	const pending = createGenericOperation('command', ['pull', options]);
	ctx.log.log(pending);

	if (
		!options.all &&
		!options.workspace &&
		(!options.checkouts || options.checkouts.length === 0)
	) {
		ctx.log.log(createOperationFailure(pending, 'No targets.'));
		console.error(
			`\nUsage: Use \`pull -c <pattern>\` to match specific checkouts or \`pull --all\` if you want to apply the command to all checkouts. Add \`-w\` to apply the command to the workspace as well.\n`,
		);
		return;
	}

	const checkouts = options.all
		? ctx.store.getAllCheckouts()
		: ctx.store.getCheckoutsByPattern(options.checkouts ?? []);

	await runWithConcurrency(checkouts, 4, async checkout => {
		const scanned = await scanCheckoutState(ctx, checkout, true);
		ctx.store.updateCheckout(scanned);
		if (scanned.scan?.can?.('pull')) {
			await doPullCheckout(ctx, scanned);
		}
	});

	if (options.workspace) {
		await scanWorkspaceCheckout(ctx);
		await doPullWorkspaceCheckout(ctx);
		presentWorkspaceReport(ctx.workspace);
	}

	presentCheckoutReport(ctx.config, checkouts);
	presentOperationsReport(ctx.log);
}
