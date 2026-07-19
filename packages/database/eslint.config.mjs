import { nodeConfig } from '@repo/eslint-config/node';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['drizzle.config.ts', 'eslint.config.mjs', 'dist/**'],
  },
  ...nodeConfig({
    tsconfigRootDir: import.meta.dirname,
  }),
];
