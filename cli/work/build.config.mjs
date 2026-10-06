import { readFileSync } from 'node:fs';

import { postBuildPlugin } from '@noodlestan/esbuild/plugins';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default {
  common: {
    bundle: true,
    tsconfig: 'tsconfig.build.json',
    entryPoints: ['src/index.ts', 'src/config/index.ts'],
    external: ['commander', 'esbuild', 'simple-git'],
    define: { __BUILD_VERSION__: JSON.stringify(version) },
  },
  esm: {
    plugins: [
      postBuildPlugin({
        command: 'tsc',
        args: ['--project', 'tsconfig.types.json'],
        target: 'esm',
      }),
    ],
  },
};
