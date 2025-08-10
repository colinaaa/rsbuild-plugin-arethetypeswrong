import { existsSync } from "node:fs";
import path from "node:path";
import { stripVTControlCharacters } from "node:util";

import { createRsbuild, logger } from "@rsbuild/core";
import { expect, test, vi } from "vitest";

import { pluginAreTheTypesWrong } from "../../src";

test("should throw when cannot resolve types", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [pluginAreTheTypesWrong()],
    },
  });

  const error = vi.spyOn(logger, "error");

  await expect(() => rsbuild.build()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: arethetypeswrong failed!]`);

  expect(
    error.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-no-resolution v0.0.0

    💀 Import failed to resolve to type declarations or JavaScript files. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md


    ┌───────────────────┬──────────────────────┐
    │                   │ "test-no-resolution" │
    ├───────────────────┼──────────────────────┤
    │ node10            │ 💀 Resolution failed │
    ├───────────────────┼──────────────────────┤
    │ node16 (from CJS) │ 💀 Resolution failed │
    ├───────────────────┼──────────────────────┤
    │ node16 (from ESM) │ 💀 Resolution failed │
    ├───────────────────┼──────────────────────┤
    │ bundler           │ 💀 Resolution failed │
    └───────────────────┴──────────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-no-resolution-0.0.0.tgz"))).toBeFalsy();
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

  await expect(() => rsbuild.build()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: arethetypeswrong failed!]`);

  expect(
    error.mock.calls.flatMap(call =>
      call
        .filter(message => typeof message === "string" && message.includes("[arethetypeswrong]"))
        .map(stripVTControlCharacters)
    ),
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-no-resolution v0.0.0

     (ignoring resolutions: 'node16-cjs', 'node16-esm')

    💀 Import failed to resolve to type declarations or JavaScript files. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md


    ┌───────────────────┬────────────────────────────────┐
    │                   │ "test-no-resolution"           │
    ├───────────────────┼────────────────────────────────┤
    │ node10            │ 💀 Resolution failed           │
    ├───────────────────┼────────────────────────────────┤
    │ bundler           │ 💀 Resolution failed           │
    ├───────────────────┼────────────────────────────────┤
    │ node16 (from CJS) │ (ignored) 💀 Resolution failed │
    ├───────────────────┼────────────────────────────────┤
    │ node16 (from ESM) │ (ignored) 💀 Resolution failed │
    └───────────────────┴────────────────────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-no-resolution-0.0.0.tgz"))).toBeFalsy();
});

test("should not throw when no-resolution is ignored", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          areTheTypesWrongOptions: {
            ignoreRules: [
              "no-resolution",
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
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-no-resolution v0.0.0

     (ignoring rules: 'no-resolution')

     No problems found 🌟
    ┌───────────────────┬──────────────────────┐
    │                   │ "test-no-resolution" │
    ├───────────────────┼──────────────────────┤
    │ node10            │ 🟢                   │
    ├───────────────────┼──────────────────────┤
    │ node16 (from CJS) │ 🟢                   │
    ├───────────────────┼──────────────────────┤
    │ node16 (from ESM) │ 🟢                   │
    ├───────────────────┼──────────────────────┤
    │ bundler           │ 🟢                   │
    └───────────────────┴──────────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-no-resolution-0.0.0.tgz"))).toBeFalsy();

  await close();
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

  expect(existsSync(path.join(import.meta.dirname, "test-no-resolution-0.0.0.tgz"))).toBeFalsy();

  await close();
});
