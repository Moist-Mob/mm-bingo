import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ['iife'],
  minify: env === 'production',
  // bundle: env === 'production',
  skipNodeModulesBundle: false,
  entry: ['src/index.ts'],
  watch: env === 'development',
  target: 'es2020',
  // outDir: env === 'production' ? 'dist' : 'lib',
  outDir: 'dist',
};
