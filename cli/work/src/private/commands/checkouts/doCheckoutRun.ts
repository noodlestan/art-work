import type { WorkspaceContext } from '../../context/createWorkspaceContext';
import { runCommandInDirectory } from '../../exec/runCommandInDirectory';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';
import type { Checkout } from '../../store/createCheckout';
import { createCheckoutRunOperation } from '../operations/createCheckoutRunOperation';

export async function doCheckoutRun(
	ctx: WorkspaceContext,
	checkout: Checkout,
	command: string[],
): Promise<Checkout | null> {
	const commandLine = command.join(' ');

	if (!checkout.scan?.state('exists').exists) {
		const op = createOperationFailure(
			createCheckoutRunOperation(checkout, commandLine),
			new Error('checkout not cloned'),
		);
		ctx.log.log(op);
		return null;
	}

	const pending = createCheckoutRunOperation(checkout, commandLine);
	try {
		ctx.log.log(pending);
		const runOutcome = await runCommandInDirectory(checkout.path, command);
		if (runOutcome.code === 0) {
			ctx.log.log(createOperationSuccess(pending));
		} else {
			ctx.log.log(createOperationFailure(pending, new Error(`Exit code: ${runOutcome.code}`)));
		}
		if (!runOutcome.output.trim() && !runOutcome.error.trim()) {
			console.info('\n--- [No output]\n');
		} else {
			if (runOutcome.output) {
				console.info('\n--- Output:\n');
				console.info(runOutcome.output);
				console.info('');
			}
			if (runOutcome.error) {
				console.error('\n--- Error:\n');
				console.error(runOutcome.error);
				console.error('');
			}
		}
		return checkout;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
