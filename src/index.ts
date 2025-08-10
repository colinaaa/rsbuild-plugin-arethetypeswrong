import type { RsbuildPlugin } from '@rsbuild/core';

export type PluginAreTheTypesWrongOptions = {
  foo?: string;
  bar?: boolean;
};

export const pluginAreTheTypesWrong = (
  options: PluginAreTheTypesWrongOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-arethetypeswrong',

  setup() {
    console.log('Hello Rsbuild!', options);
  },
});
