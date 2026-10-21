import { dirname, join } from 'path/posix';
import { fileURLToPath } from 'url';

export const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BUNDLE = join(PACKAGE_ROOT, 'dist', 'index.mjs');
export const BUILD_HINT = 'run `npm run build` in the @art-work/cli package first';
export const ENCODING = 'utf8';
