//  @ts-check

import { config as reactConfig } from '@repo/eslint-config/react'
import { tanstackConfig } from '@tanstack/eslint-config'
import globals from 'globals'

export default [
  ...reactConfig,
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'react/boolean-prop-naming': 'off',
    },
  },
  {
    files: ['instrument.server.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js', 'src/routeTree.gen.ts'],
  },
]
