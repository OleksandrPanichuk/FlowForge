import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for Node.js TypeScript applications.
 *
 * @param {{ tsconfigRootDir?: string, globals?: Record<string, boolean | "readonly" | "writable" | "off"> }} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export function nodeConfig(options = {}) {
  return tseslint.config(
    ...baseConfig,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...options.globals,
        },
        parserOptions: {
          projectService: true,
          tsconfigRootDir: options.tsconfigRootDir,
        },
      },
      rules: {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": [
          "error",
          { checksVoidReturn: { attributes: false } },
        ],
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "error",
      },
    },
  );
}

export const config = nodeConfig();
