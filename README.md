# rsbuild-plugin-arethetypeswrong

Rsbuild plugin for checking TypeScript type definitions with [arethetypeswrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io).

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-arethetypeswrong">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-arethetypeswrong?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-arethetypeswrong?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-arethetypeswrong.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

`rsbuild-plugin-arethetypeswrong` is the perfect partner for [Rslib](https://github.com/web-infra-dev/rslib). When building a library, arethetypeswrong helps you to analyze TypeScript types of the package to improve its compatibility with different module resolutions.

<img width="1000" height="761" alt="image" src="https://github.com/user-attachments/assets/cce68a0d-baac-45c5-8b59-9e7999932e1c" />

## Usage

Install:

```bash
npm add rsbuild-plugin-arethetypeswrong -D
```

Add plugin to your `rslib.config.ts` or `rsbuild.config.ts`:

```ts
import { pluginAreTheTypesWrong } from "rsbuild-plugin-arethetypeswrong";

export default {
  plugins: [pluginAreTheTypesWrong()],
};
```

## Options

### enable

Whether to enable arethetypeswrong.

- Type: `boolean`
- Default: `true`

For example, only run arethetypeswrong in the CI environment:

```ts
pluginAreTheTypesWrong({
  enable: Boolean(process.env.CI),
});
```

### areTheTypesWrongOptions

Options for arethetypeswrong. See [arethetypeswrong - Configuration](https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/packages/cli/README.md#configuration) for more details.

- Type:

```ts
interface areTheTypesWrongOptions {
  ignoreRules?: ProblemFlag[];
  ignoreResolutions?: ResolutionKind[];
  summary?: boolean;
  emoji?: boolean;
}

type ProblemFlag =
  | "no-resolution"
  | "untyped-resolution"
  | "false-cjs"
  | "false-esm"
  | "cjs-resolves-to-esm"
  | "fallback-condition"
  | "cjs-only-exports-default"
  | "named-exports"
  | "false-export-default"
  | "missing-export-equals"
  | "unexpected-module-syntax"
  | "internal-resolution-error";

type ResolutionKind = "node10" | "node16-cjs" | "node16-esm" | "bundler";
```

- Default:

```js
const defaultOptions = {
  ignoreRules: [];
  ignoreResolutions: [];
  summary: true;
  emoji: true;
};
```

- Example:

```js
pluginAreTheTypesWrong({
  areTheTypesWrongOptions: {
    ignoreRules: ["false-cjs"],
    ignoreResolutions: ["node16-cjs"],
  },
});
```

## License

[MIT](./LICENSE).
