import { existsSync } from "node:fs";
import path from "node:path";
import { stripVTControlCharacters } from "node:util";

import { createRsbuild, logger } from "@rsbuild/core";
import { expect, test, vi } from "vitest";

import { pluginAreTheTypesWrong } from "../../src";

test("should throw when has false CJS", async () => {
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
      "[arethetypeswrong] test-false-esm v0.0.0

    👺 Import resolved to an ESM type declaration file, but a CommonJS JavaScript file. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseESM.md


    ┌───────────────────┬────────────────────────┐
    │                   │ "test-false-esm"       │
    ├───────────────────┼────────────────────────┤
    │ node10            │ 🟢                     │
    ├───────────────────┼────────────────────────┤
    │ node16 (from CJS) │ 👺 Masquerading as ESM │
    ├───────────────────┼────────────────────────┤
    │ node16 (from ESM) │ 🟢 (ESM)               │
    ├───────────────────┼────────────────────────┤
    │ bundler           │ 🟢                     │
    └───────────────────┴────────────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-false-esm-0.0.0.tgz"))).toBeFalsy();
});

// TODO: fix this
test.skip("should pass when all thrown resolution is disabled", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          areTheTypesWrongOptions: {
            ignoreResolutions: [
              "node16-cjs",
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
      "[arethetypeswrong] test-false-esm v0.0.0

     (ignoring resolutions: 'bundler', 'node16-cjs', 'node16-esm')

    (ignored per resolution) ❌ Import resolved to JavaScript files, but no type declarations were found. https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/UntypedResolution.md


    ┌───────────────────┬───────────────────────────┐
    │                   │ "test-false-esm" │
    ├───────────────────┼───────────────────────────┤
    │ node10            │ 🟢                        │
    ├───────────────────┼───────────────────────────┤
    │ node16 (from CJS) │ (ignored) ❌ No types     │
    ├───────────────────┼───────────────────────────┤
    │ node16 (from ESM) │ (ignored) ❌ No types     │
    ├───────────────────┼───────────────────────────┤
    │ bundler           │ (ignored) ❌ No types     │
    └───────────────────┴───────────────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-false-esm-0.0.0.tgz"))).toBeFalsy();

  await close();
});

test("should be able to ignore rule false-cjs", async () => {
  const rsbuild = await createRsbuild({
    cwd: import.meta.dirname,
    rsbuildConfig: {
      plugins: [
        pluginAreTheTypesWrong({
          areTheTypesWrongOptions: {
            ignoreRules: [
              "false-esm",
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
      "[arethetypeswrong] test-false-esm v0.0.0

     (ignoring rules: 'false-esm')

     No problems found 🌟
    ┌───────────────────┬──────────────────┐
    │                   │ "test-false-esm" │
    ├───────────────────┼──────────────────┤
    │ node10            │ 🟢               │
    ├───────────────────┼──────────────────┤
    │ node16 (from CJS) │ 🟢 (ESM)         │
    ├───────────────────┼──────────────────┤
    │ node16 (from ESM) │ 🟢 (ESM)         │
    ├───────────────────┼──────────────────┤
    │ bundler           │ 🟢               │
    └───────────────────┴──────────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-false-esm-0.0.0.tgz"))).toBeFalsy();

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

  expect(existsSync(path.join(import.meta.dirname, "test-false-esm-0.0.0.tgz"))).toBeFalsy();

  await close();
});
