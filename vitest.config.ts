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
        lines: 93.1,
        functions: 96.55,
        branches: 87.2,
        statements: 93.49,
      },
    },

    silent: "passed-only",
  },
});