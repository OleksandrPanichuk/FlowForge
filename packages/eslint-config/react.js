import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for React/browser TypeScript applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/display-name": "off",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-pascal-case": "error",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/no-array-index-key": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
