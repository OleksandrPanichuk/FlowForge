// @ts-check
import { nodeConfig } from '@repo/eslint-config/node';
import globals from 'globals';

export default nodeConfig({
  tsconfigRootDir: import.meta.dirname,
  globals: globals.jest,
}).concat(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'coverage/**'],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
);
