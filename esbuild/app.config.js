const { copy } = require('esbuild-plugin-copy')
const esbuild = require('esbuild')
const glob = require('glob')

/**
 * Build typescript application into CommonJS
 * @type {BuildStep}
 */
const buildApp = buildConfig => {
  return esbuild.build({
    entryPoints: glob.sync(buildConfig.app.entryPoints),
    outdir: buildConfig.app.outDir,
    bundle: false,
    sourcemap: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: buildConfig.app.copy,
      }),
    ],
  })
}

/**
 * @param {BuildConfig} buildConfig
 * @returns {Promise}
 */
module.exports = buildConfig => {
  process.stderr.write('\u{1b}[1m\u{2728} Building app...\u{1b}[0m\n')

  return buildApp(buildConfig)
}
