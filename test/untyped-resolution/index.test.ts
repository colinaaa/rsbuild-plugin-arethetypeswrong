import { existsSync } from "node:fs";
import path from "node:path";
import { stripVTControlCharacters } from "node:util";

import { createRsbuild, logger } from "@rsbuild/core";
import { expect, test, vi } from "vitest";

import { pluginAreTheTypesWrong } from "../../src";

test("should throw when does resolve to types", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong()],
    },
  });

  const error = vi.spyOn(logger, "error");

  await expect(rsbuild.build()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: arethetypeswrong failed!]`);

  expect(
    error.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchSnapshot();

  expect(existsSync(path.join(import.meta.dirname, "test-untyped-resolution-0.0.0.tgz"))).toBeFalsy();
});

test("should pass when all thrown resolution is disabled", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong({
        areTheTypesWrongOptions: {
          ignoreResolutions: [
            "bundler",
            "node16-cjs",
            "node16-esm",
          ],
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

  expect(existsSync(path.join(import.meta.dirname, "test-untyped-resolution-0.0.0.tgz"))).toBeFalsy();

  await close();
});

test("should be able to ignore resolution", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          areTheTypesWrongOptions: {
            ignoreResolutions: [
              "node16-cjs",
              "node16-esm",
            ],
          },
        }),
      ],
    },
  });

  const error = vi.spyOn(logger, "error");

  await expect(rsbuild.build()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: arethetypeswrong failed!]`);

  expect(
    error.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchSnapshot();

  expect(existsSync(path.join(import.meta.dirname, "test-untyped-resolution-0.0.0.tgz"))).toBeFalsy();
});

test("should be able to ignore rule untyped-resolution", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          areTheTypesWrongOptions: {
            ignoreRules: [
              "untyped-resolution",
            ],
          },
        }),
      ],
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

  expect(existsSync(path.join(import.meta.dirname, "test-untyped-resolution-0.0.0.tgz"))).toBeFalsy();

  await close();

  expect(existsSync(path.join(import.meta.dirname, "test-no-resolution-0.0.0.tgz"))).toBeFalsy();
});

test("should not throw when enable: false", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          enable: false,
        }),
      ],
    },
  });

  const success = vi.spyOn(logger, "success");

  const { close } = await rsbuild.build();

  expect(success).not.toBeCalled();

  expect(existsSync(path.join(import.meta.dirname, "test-untyped-resolution-0.0.0.tgz"))).toBeFalsy();

  await close();
});
