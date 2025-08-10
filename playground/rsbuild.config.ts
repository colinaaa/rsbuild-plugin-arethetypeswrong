import { defineConfig } from '@rsbuild/core';
import { pluginAreTheTypesWrong } from '../src';

export default defineConfig({
  plugins: [pluginAreTheTypesWrong()],
});
