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
import { createLogger } from './private/logger/createLogger';
import { createGenericOperation } from './private/operations/createGenericOperation';
import { createCheckoutStore } from './private/store/createCheckoutStore';

const program = new Command();

const logger = createLogger();

program.name('art-workspace').description('Workspace orchestration CLI').version('0.0.18');

program
	.command('sanity')
	.description('Check git status across all repos')
	.option('-a, --auto', 'push clean unpushed repos')
	.option('-r, --refetch', 'fetch ahead/behind data from remote')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(async (options: { auto?: boolean; refetch?: boolean; output?: string }) => {
		const root = process.cwd();
		logger.log(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger.log);
		const ctx = createWorkspaceContext(config, store, log);
		logger.setOutputMode(options.output || config.output.mode);

		const auto = options.auto ?? false;
		const refetch = options.refetch ?? false;
		await runSanity(ctx, { auto, refetch });
	});

program
	.command('clone')
	.description('Clone repos from manifest')
	.option('-a, --all', 'clone all repos')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.argument('[name]', 'repo name to clone')
	.argument('[target]', 'target location (relative to checkouts path)')
	.action(
		async (
			repoName: string | undefined,
			checkoutInput: string | undefined,
			options: { all?: boolean; output?: string },
		) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

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
	.option('-a, --all', 'Apply to all checkouts')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(
		async (branch: string, options: { checkouts?: string[]; all?: boolean; output?: string }) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

			await runBranch(ctx, { branch, checkouts: options.checkouts, all: options.all });
		},
	);

program
	.command('pull')
	.description('Pull clean checkouts that are behind')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-a, --all', 'Apply to all checkouts')
	.option('-w, --workspace', 'Also apply the command to the workspace root')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(
		async (options: {
			checkouts?: string[];
			all?: boolean;
			workspace?: boolean;
			output?: string;
		}) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

			await runPull(ctx, {
				checkouts: options.checkouts,
				all: options.all,
				workspace: options.workspace,
			});
		},
	);

program
	.command('push')
	.description('Push clean checkouts that are ahead')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-a, --all', 'Apply to all checkouts')
	.option('-w, --workspace', 'Also apply the command to the workspace root')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(
		async (options: {
			checkouts?: string[];
			all?: boolean;
			workspace?: boolean;
			output?: string;
		}) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

			await runPush(ctx, {
				checkouts: options.checkouts,
				all: options.all,
				workspace: options.workspace,
			});
		},
	);

program
	.command('sync')
	.description('Pull and push clean checkouts')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-a, --all', 'Apply to all checkouts')
	.option('-w, --workspace', 'Also apply the command to the workspace root')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(
		async (options: {
			checkouts?: string[];
			all?: boolean;
			workspace?: boolean;
			output?: string;
		}) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

			await runSync(ctx, {
				checkouts: options.checkouts,
				all: options.all,
				workspace: options.workspace,
			});
		},
	);

program
	.command('checkouts')
	.description('Checkout operations')
	.command('run')
	.description('Run a command in selected checkouts')
	.argument('<command>', 'command to run')
	.option(
		'-c, --checkouts <PATTERN...>',
		'One or more. Matches checkout name and location. Wildcard asterisk * supported. Example: -c "* @ refactor" "lib-*"',
	)
	.option('-a, --all', 'Apply to all checkouts')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(
		async (command: string, options: { checkouts?: string[]; all?: boolean; output?: string }) => {
			const root = process.cwd();
			logger.log(createGenericOperation('boot'));
			const config = await loadWorkspaceConfig(root);
			const store = createCheckoutStore();
			const log = createOperationsLog(logger.log);
			const ctx = createWorkspaceContext(config, store, log);
			logger.setOutputMode(options.output || config.output.mode);

			await runCheckoutsRun(ctx, { command, checkouts: options.checkouts, all: options.all });
		},
	);

program
	.command('repo')
	.description('List checkout resources')
	.argument('[checkouts...]', 'checkout locations to list (default: all checkouts)')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(async (locations: string[], options: { output?: string }) => {
		const root = process.cwd();
		logger.log(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger.log);
		const ctx = createWorkspaceContext(config, store, log);
		logger.setOutputMode(options.output || config.output.mode);

		await runRepo(ctx, { locations });
	});

program
	.command('link')
	.description('Link packages for local dev')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(async (options: { output?: string }) => {
		const root = process.cwd();
		logger.log(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger.log);
		const ctx = createWorkspaceContext(config, store, log);
		logger.setOutputMode(options.output || config.output.mode);

		await runLink(ctx, { root });
	});

program
	.command('unlink')
	.description('Unlink packages')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(async (options: { output?: string }) => {
		const root = process.cwd();
		logger.log(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger.log);
		const ctx = createWorkspaceContext(config, store, log);
		logger.setOutputMode(options.output || config.output.mode);

		await runUnlink(ctx, { root });
	});

program
	.command('publish')
	.description('Publish packages')
	.option('-a, --auto', 'auto-publish')
	.option('-o, --output <mode>', 'One of quiet|verbose')
	.action(async (options: { auto?: boolean; output?: string }) => {
		const root = process.cwd();
		logger.log(createGenericOperation('boot'));
		const config = await loadWorkspaceConfig(root);
		const store = createCheckoutStore();
		const log = createOperationsLog(logger.log);
		const ctx = createWorkspaceContext(config, store, log);
		logger.setOutputMode(options.output || config.output.mode);

		await runPublish(ctx, { root, auto: options.auto });
	});

program.parse();
