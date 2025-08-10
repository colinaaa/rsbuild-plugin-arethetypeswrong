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
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-basic v0.0.0

     No problems found 🌟
    ┌───────────────────┬──────────────┐
    │                   │ "test-basic" │
    ├───────────────────┼──────────────┤
    │ node10            │ 🟢           │
    ├───────────────────┼──────────────┤
    │ node16 (from CJS) │ 🟢 (CJS)     │
    ├───────────────────┼──────────────┤
    │ node16 (from ESM) │ 🟢 (CJS)     │
    ├───────────────────┼──────────────┤
    │ bundler           │ 🟢           │
    └───────────────────┴──────────────┘",
    ]
  `);

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
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-basic v0.0.0

     No problems found
    ┌───────────────────┬──────────────┐
    │                   │ "test-basic" │
    ├───────────────────┼──────────────┤
    │ node10            │ OK           │
    ├───────────────────┼──────────────┤
    │ node16 (from CJS) │ OK (CJS)     │
    ├───────────────────┼──────────────┤
    │ node16 (from ESM) │ OK (CJS)     │
    ├───────────────────┼──────────────┤
    │ bundler           │ OK           │
    └───────────────────┴──────────────┘",
    ]
  `);

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
  ).toMatchInlineSnapshot(`
    [
      "[arethetypeswrong] test-basic v0.0.0

    ┌───────────────────┬──────────────┐
    │                   │ "test-basic" │
    ├───────────────────┼──────────────┤
    │ node10            │ OK           │
    ├───────────────────┼──────────────┤
    │ node16 (from CJS) │ OK (CJS)     │
    ├───────────────────┼──────────────┤
    │ node16 (from ESM) │ OK (CJS)     │
    ├───────────────────┼──────────────┤
    │ bundler           │ OK           │
    └───────────────────┴──────────────┘",
    ]
  `);

  expect(existsSync(path.join(import.meta.dirname, "test-basic-0.0.0.tgz"))).toBeFalsy();

  await close();
});
