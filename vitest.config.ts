import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ".rslib/**",
        "./dist/**",
        "./test/**",

        "./rslib.config.ts",
        "./vitest.config.ts",
      ],
      excludeAfterRemap: true,
      experimentalAstAwareRemapping: true,

      provider: "v8",
      thresholds: {
        autoUpdate: true,
        lines: 96.74,
        functions: 100,
        branches: 94.62,
        statements: 96.92,
      },
    },

    silent: "passed-only",
  },
});
