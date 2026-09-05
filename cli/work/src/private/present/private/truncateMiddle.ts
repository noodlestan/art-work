export function truncateMiddle(str: string, limit: number): string {
	if (str.length <= limit) {
		return str;
	}
	const keep = limit - 3;
	const left = Math.ceil(keep / 2);
	const right = Math.floor(keep / 2);
	return `${str.slice(0, left)}[...]${str.slice(str.length - right)}`;
}
