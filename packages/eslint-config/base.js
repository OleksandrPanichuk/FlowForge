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
      // Correctness / likely bugs
      "array-callback-return": "error",
      "no-constant-binary-expression": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",

      // Safety / footguns
      "no-alert": "warn",
      "no-caller": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-extend-native": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": "error",
      "no-throw-literal": "error",
      "radix": "error",

      // Consistency / clarity
      "curly": ["error", "all"],
      "default-case-last": "error",
      "dot-notation": "error",
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "logical-assignment-operators": ["error", "always"],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-implicit-coercion": ["error", { boolean: false }],
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "operator-assignment": ["error", "always"],
      "yoda": "error",

      // Modern syntax preferences
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-object-spread": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      "require-await": "error",
      "symbol-description": "error",

      // Imports
      "no-duplicate-imports": "error",

      // Formatting (also enforced by Prettier; kept so `eslint --fix`
      // alone stays correct — 80-char lines, semicolons, trailing commas)
      "comma-dangle": ["error", "always-multiline"],
      "max-len": [
        "error",
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      "no-return-await": "error",
      "semi": ["error", "always"],

      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description" },
      ],
      "@typescript-eslint/consistent-indexed-object-style": [
        "error",
        "record",
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
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
