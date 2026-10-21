import type { WorkspaceContext } from '../../context/createWorkspaceContext.js';
import { createOrSwitchBranch } from '../../git/createOrSwitchBranch.js';
import { createOperationFailure } from '../../operations/createOperationFailure.js';
import { createOperationSuccess } from '../../operations/createOperationSuccess.js';
import { saveCheckoutRecord } from '../../resources/checkout/saveCheckoutRecord.js';
import type { Checkout } from '../../store/createCheckout.js';
import { createBranchOperation } from '../operations/createBranchOperation.js';

export async function doBranchCheckout(
	ctx: WorkspaceContext,
	checkout: Checkout,
	branch: string,
): Promise<Checkout | null> {
	const pending = createBranchOperation(checkout, branch);
	try {
		ctx.log.log(pending);
		const outcome = await createOrSwitchBranch(checkout.path, branch);
		ctx.log.log(
			createOperationSuccess(
				pending,
				outcome === 'created' ? `created ${branch}` : `switched to ${branch}`,
			),
		);

		const updated = { ...checkout, record: { ...checkout.record, branch } };
		ctx.store.updateCheckout(updated);
		await saveCheckoutRecord(ctx.config, updated.record, updated.filename);
		return updated;
	} catch (error) {
		ctx.log.log(createOperationFailure(createBranchOperation(checkout, branch), error));
		return null;
	}
}
