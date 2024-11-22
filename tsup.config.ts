import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: false,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  sourcemap: env === 'development' ? 'inline' : false,
  format: ['iife'],
  minify: env === 'production',
  // bundle: env === 'production',
  entry: ['src/index.ts'],
  watch: env === 'development',
  target: 'es2020',
  // outDir: env === 'production' ? 'dist' : 'lib',
  outDir: 'dist',
};
