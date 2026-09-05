#!/usr/bin/env node

import { Command } from 'commander';

import { runBranch } from './commands/branch/runBranch';
import { runCheckoutsRun } from './commands/checkouts/runCheckoutsRun';
import { runClone } from './commands/clone/runClone';
import { runLink } from './commands/link/runLink';
import { runPublish } from './commands/publish/runPublish';
import { runPull } from './commands/pull/runPull';
import { runPush } from './commands/push/runPush';
import { runRepo } from './commands/repo/runRepo';
import { runSanity } from './commands/sanity/runSanity';
import { runSync } from './commands/sync/runSync';
import { runUnlink } from './commands/unlink/runUnlink';
import { loadWorkspaceConfig } from './config/loadWorkspaceConfig';
import { createWorkspaceContext } from './private/context/createWorkspaceContext';
import { createOperationsLog } from './private/log/createOperationsLog';
import { createGenericOperation } from './private/operations/createGenericOperation';
import type { Operation } from './private/operations/types';
import { makeOperationLogLine } from './private/present/makeOperationLogLine';
import { createCheckoutStore } from './private/store/createCheckoutStore';

export { defineConfig, loadWorkspaceConfig } from './config';
export type { WorkspaceConfig } from './config';

const program = new Command();

const logger = (op: Operation) => {
	console.info(makeOperationLogLine(op, { standalone: true }).join(' | '));
};

program.name('art-workspace').description('Workspace orchestration CLI').version('0.0.18');

program
	.command('sanity')
	.description('Check git status across all repos')
	.option('-a, --auto', 'push clean unpushed repos')
	.option('-r, --refetch', 'fetch ahead/behind data from remote')
	.action(async (options: { auto?: boolean; refetch?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		const auto = options.auto ?? false;
		const refetch = options.refetch ?? false;
		await runSanity(ctx, { auto, refetch });
	});

program
	.command('clone')
	.description('Clone repos from manifest')
	.option('-a, --all', 'clone all repos')
	.argument('[name]', 'repo name to clone')
	.argument('[target]', 'target location (relative to checkouts path)')
	.action(
		async (
			repoName: string | undefined,
			checkoutInput: string | undefined,
			options: { all?: boolean },
		) => {
			const root = process.cwd();
			logger(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger);
			const ctx = createWorkspaceContext(config, store, log);

			await runClone(ctx, { all: options.all, repoName, checkoutInput });
		},
	);

program
	.command('branch')
	.description('Branch across checkouts')
	.argument('<branch>', 'branch name to create or switch to')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-A, --all', 'Apply to all checkouts')
	.action(async (branch: string, options: { checkouts?: string[]; all?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runBranch(ctx, { branch, checkouts: options.checkouts, all: options.all });
	});

program
	.command('pull')
	.description('Pull clean checkouts that are behind')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-A, --all', 'Apply to all checkouts')
	.action(async (options: { checkouts?: string[]; all?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runPull(ctx, { checkouts: options.checkouts, all: options.all });
	});

program
	.command('push')
	.description('Push clean checkouts that are ahead')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-A, --all', 'Apply to all checkouts')
	.action(async (options: { checkouts?: string[]; all?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runPush(ctx, { checkouts: options.checkouts, all: options.all });
	});

program
	.command('sync')
	.description('Pull and push clean checkouts')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-A, --all', 'Apply to all checkouts')
	.action(async (options: { checkouts?: string[]; all?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runSync(ctx, { checkouts: options.checkouts, all: options.all });
	});

program
	.command('checkouts')
	.description('Checkout operations')
	.command('run')
	.description('Run a command in selected checkouts')
	.argument('<command...>', 'command to run')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-A, --all', 'Apply to all checkouts')
	.action(async (command: string[], options: { checkouts?: string[]; all?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runCheckoutsRun(ctx, { command, checkouts: options.checkouts, all: options.all });
	});

program
	.command('repo')
	.description('List checkout resources')
	.argument('[checkouts...]', 'checkout locations to list (default: all checkouts)')
	.action(async (locations: string[]) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runRepo(ctx, { locations });
	});

program
	.command('link')
	.description('Link packages for local dev')
	.action(async () => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runLink(ctx, { root });
	});

program
	.command('unlink')
	.description('Unlink packages')
	.action(async () => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runUnlink(ctx, { root });
	});

program
	.command('publish')
	.description('Publish packages')
	.option('-a, --auto', 'auto-publish')
	.action(async (options: { auto?: boolean }) => {
		const root = process.cwd();
		logger(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger);
		const ctx = createWorkspaceContext(config, store, log);

		await runPublish(ctx, { root, auto: options.auto });
	});

program.parse();
