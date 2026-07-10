import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.output/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.generated.*",
      "**/routeTree.gen.ts",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    rules: {
      "array-callback-return": "error",
      "curly": ["error", "all"],
      "default-case-last": "error",
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "no-alert": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-nested-ternary": "warn",
      "no-param-reassign": "error",
      "no-return-await": "error",
      "no-template-curly-in-string": "error",
      "no-unneeded-ternary": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-template": "error",
      "require-await": "error",

      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
