import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ".rslib/**",
        "./dist/**",
        "./test/**",
        "./playground/**",

        "./rslib.config.ts",
        "./vitest.config.ts",
      ],
      excludeAfterRemap: true,
      experimentalAstAwareRemapping: true,

      provider: "v8",
      thresholds: {
        autoUpdate: true,
        lines: 93.49,
        functions: 96.77,
        branches: 88.17,
        statements: 93.84,
      },
    },

    silent: "passed-only",
  },
});
