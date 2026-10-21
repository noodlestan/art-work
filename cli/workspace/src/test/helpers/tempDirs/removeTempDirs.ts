import { resilientRemoveDir } from './resilientRemoveDir.js';

export async function removeTempDirs(tempDirs: string[]): Promise<void> {
	const removals = tempDirs.splice(0).map(resilientRemoveDir);
	await Promise.all(removals);
}
