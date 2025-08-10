import fs from "node:fs";
import path from "node:path";

import type { RsbuildPlugin } from "@rsbuild/core";

import type { RenderOptions } from "./render/index.js";

export interface PluginAreTheTypesWrongOptions {
  /**
   * Whether to enable arethetypeswrong.
   * @default true
   */
  enable?: boolean;

  areTheTypesWrongOptions?: RenderOptions;
}

export const pluginAreTheTypesWrong = (
  options: PluginAreTheTypesWrongOptions = {},
): RsbuildPlugin => ({
  name: "plugin-arethetypeswrong",

  setup(api) {
    if (options.enable === false) {
      return;
    }

    const logger = api.logger;

    api.onAfterBuild({
      handler: async ({ isFirstCompile, isWatch }) => {
        // Only run on the first compile in watch mode, or on a single build
        if (!isFirstCompile) {
          return;
        }

        const { rootPath } = api.context;

        // Read package.json to get package name and version
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(rootPath, "package.json"), "utf-8"),
        ) as { name: string; version: string };
        const packageName = packageJson.name;
        const packageVersion = packageJson.version;

        logger.start(`[arethetypeswrong] Checking ${packageName}@${packageVersion}...`);
        console.info();

        logger.debug(`[arethetypeswrong] Running npm pack from ${rootPath}`);
        const { createTarball } = await import("./createTarball.js");
        await using tarball = await createTarball(rootPath, packageJson);
        logger.debug(`[arethetypeswrong] npm pack success`);

        const { checkPackage, createPackageFromTarballData } = await import("@arethetypeswrong/core");
        const pkg = createPackageFromTarballData(fs.readFileSync(tarball.path));
        const result = await checkPackage(pkg);

        const { render } = await import("./render/index.js");

        const message = await render(result, options.areTheTypesWrongOptions ?? {});

        const { getExitCode } = await import("./getExitCode.js");

        const exitCode = getExitCode(result, options.areTheTypesWrongOptions);
        const hasErrors = exitCode !== 0;
        if (hasErrors) {
          logger.error(message);
          if (!isWatch) {
            throw new Error("arethetypeswrong failed!");
          }
          return;
        }
        logger.success(message);
      },
      order: "post",
    });
  },
});
