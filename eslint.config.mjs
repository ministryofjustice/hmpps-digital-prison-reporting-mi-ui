import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

/**
 * Eslint linter config object
 * @typedef { import('eslint').Linter.Config } LinterConfig
 */

const defaultConfig = hmppsConfig({
  extraIgnorePaths: ['cypress-tests/**'],
})

/**
 * @type {LinterConfig}
 */
const config = [
  ...defaultConfig,
  {
    rules: {
      'import/no-named-as-default': 0,
      'import/prefer-default-export': 0,
    },
  },
]

export default config
