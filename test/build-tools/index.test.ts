import { existsSync } from "node:fs";
import path from "node:path";
import { stripVTControlCharacters } from "node:util";

import { createRsbuild, logger } from "@rsbuild/core";
import { expect, test, vi } from "vitest";

import { pluginAreTheTypesWrong } from "../../src";

test("should run arethetypeswrong as expected", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong()],
    },
  });

  const success = vi.spyOn(logger, "success");

  const { close } = await rsbuild.build();

  expect(
    success.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchSnapshot();

  expect(existsSync(path.join(import.meta.dirname, "test-basic-0.0.0.tgz"))).toBeFalsy();

  await close();
});

test("should run arethetypeswrong without emoji", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong({
        areTheTypesWrongOptions: {
          emoji: false,
        },
      })],
    },
  });

  const success = vi.spyOn(logger, "success");

  const { close } = await rsbuild.build();

  expect(
    success.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchSnapshot();

  expect(existsSync(path.join(import.meta.dirname, "test-basic-0.0.0.tgz"))).toBeFalsy();

  await close();
});

test("should run arethetypeswrong without summary", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong({
        areTheTypesWrongOptions: {
          emoji: false,
          summary: false,
        },
      })],
    },
  });

  const success = vi.spyOn(logger, "success");

  const { close } = await rsbuild.build();

  expect(
    success.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchSnapshot();

  expect(existsSync(path.join(import.meta.dirname, "test-basic-0.0.0.tgz"))).toBeFalsy();

  await close();
});
