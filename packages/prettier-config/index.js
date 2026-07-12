// @ts-check

/**
 * Shared Prettier configuration for the repository.
 *
 * Prettier owns formatting (line width, semicolons, commas, quotes);
 * ESLint owns code quality. Keep the two in sync via eslint-config-prettier.
 *
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
};

export default config;
