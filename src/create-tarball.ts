import fs from "node:fs/promises";
import path from "node:path";

import { detect } from "package-manager-detector";
import { x } from "tinyexec";

interface Result extends AsyncDisposable {
  path: string;
}

export async function createTarball(
  root: string,
  pkg: { name: string; version: string },
): Promise<Result> {
  const tarballPath = path.join(root, `${pkg.name}-${pkg.version}.tgz`);

  const agent = await detect({ cwd: root, stopDir: root }) ?? { name: "npm" };

  await x(agent.name, ["pack"]);

  return {
    path: tarballPath,
    async [Symbol.asyncDispose]() {
      return fs.unlink(tarballPath);
    },
  };
}
