import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['scripts/db-init.ts', 'scripts/serve-prod.ts'],
  outdir: 'dist',
  entryNames: 'scripts/[name]',
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  metafile: true,
  external: [
    './dist/server/*',
    '../server/*'
  ]
})
