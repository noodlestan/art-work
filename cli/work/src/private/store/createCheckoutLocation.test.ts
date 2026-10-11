import { describe, expect, it } from 'vitest';

import { createCheckoutLocation } from './createCheckoutLocation.js';

describe('createCheckoutLocation', () => {
	it('WHEN a location is created the repo name is sanitized with safePath', () => {
		const repo = { name: 'My Repo', remote: 'git@example.com:my-repo.git' };
		expect(createCheckoutLocation(repo)).toBe('my-repo');
	});

	it('WHEN a target is given it combines the repo name and target', () => {
		const repo = { name: 'My Repo', remote: 'git@example.com:my-repo.git' };
		expect(createCheckoutLocation(repo, 'fix-x')).toBe('my-repo-fix-x');
	});
});
