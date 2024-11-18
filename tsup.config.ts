import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ['cjs'], // generate cjs and esm files
  minify: env === 'production',
  // bundle: env === 'production',
  skipNodeModulesBundle: false,
  entryPoints: ['src/index.ts'],
  watch: env === 'development',
  target: 'es2020',
  // outDir: env === 'production' ? 'dist' : 'lib',
  outDir: 'dist',
  entry: ['src/index.ts'], //include all files under src
};
