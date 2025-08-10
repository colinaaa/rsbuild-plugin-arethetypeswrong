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
        lines: 93.16,
        functions: 96.66,
        branches: 87.2,
        statements: 93.54,
      },
    },

    silent: "passed-only",
  },
});
