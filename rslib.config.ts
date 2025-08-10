import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    { format: "esm", syntax: "es2022", dts: true },
    { format: "cjs", syntax: "es2022" },
  ],
});
