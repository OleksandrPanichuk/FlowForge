import { nodeConfig } from "@repo/eslint-config/node";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["eslint.config.mjs", "dist/**", "test/**"],
  },
  ...nodeConfig({
    tsconfigRootDir: import.meta.dirname,
  }),
];
