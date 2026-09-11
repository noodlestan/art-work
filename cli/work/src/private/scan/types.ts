import type { CheckoutOp } from '../operations/types';

export interface CheckoutStateRepo {
	type: 'repo';
	known: boolean;
}

export interface CheckoutStateGitDir {
	type: 'git-dir';
	hasGit: boolean;
}

export interface CheckoutStateExists {
	type: 'exists';
	exists: boolean;
}

export interface CheckoutStateRemote {
	type: 'remote';
	branch: string | null;
	expectedBranch: string;
	hasRemote: boolean;
}

export interface CheckoutStateSync {
	type: 'sync';
	delta: number;
	ahead: number;
	behind: number;
}

export interface CheckoutStateCommitted {
	type: 'committed';
	clean: boolean;
}

export interface CheckoutStateNoConflicts {
	type: 'no-conflicts';
	clear: boolean;
}

export interface CheckoutStateNoDetached {
	type: 'no-detached';
	attached: boolean;
}

export interface CheckoutStateWrongRemote {
	type: 'wrong-remote';
	wrong: boolean;
}

export type CheckoutState =
	| CheckoutStateRepo
	| CheckoutStateGitDir
	| CheckoutStateExists
	| CheckoutStateRemote
	| CheckoutStateSync
	| CheckoutStateCommitted
	| CheckoutStateNoConflicts
	| CheckoutStateNoDetached
	| CheckoutStateWrongRemote;

export type CheckoutStateType = CheckoutState['type'];
export type CheckoutStateOf<T extends CheckoutStateType> = Extract<CheckoutState, { type: T }>;

export interface CheckoutScan {
	states: CheckoutState[];
	state: <T extends CheckoutStateType>(type: T) => CheckoutStateOf<T>;
	should: (op: CheckoutOp) => boolean;
	can: (op: CheckoutOp) => boolean;
	issues: () => string[];
}
