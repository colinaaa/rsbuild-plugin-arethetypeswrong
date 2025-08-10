import fs from "node:fs";
import path from "node:path";

import { checkPackage, createPackageFromTarballData } from "@arethetypeswrong/core";
import type { RsbuildPlugin } from "@rsbuild/core";

import { createTarball } from "./create-tarball.js";
import { render } from "./render/index.js";
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
      handler: async () => {
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
        await using tarball = await createTarball(rootPath, packageJson);
        logger.debug(`[arethetypeswrong] npm pack success`);

        const pkg = createPackageFromTarballData(fs.readFileSync(tarball.path));
        const result = await checkPackage(pkg);

        const message = await render(result, options.areTheTypesWrongOptions ?? {});
        logger.success(message);
      },
      order: "post",
    });
  },
});
