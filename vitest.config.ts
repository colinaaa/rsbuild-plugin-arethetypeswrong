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
        100: true,
      },
    },

    silent: "passed-only",
  },
});
