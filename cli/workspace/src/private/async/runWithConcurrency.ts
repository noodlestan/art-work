export async function runWithConcurrency<T>(
	items: readonly T[],
	limit: number,
	task: (item: T) => Promise<void>,
): Promise<void> {
	let index = 0;
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (index < items.length) {
			const i = index++;
			await task(items[i]);
		}
	});
	await Promise.all(workers);
}
