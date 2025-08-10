import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  lib: [
    { format: "esm", syntax: "es2022", dts: { bundle: true } },
  ],
  plugins: [
    pluginPublint(),
  ],
  tools: {
    rspack: {
      optimization: {
        chunkIds: "named",
      },
    },
  },
});
