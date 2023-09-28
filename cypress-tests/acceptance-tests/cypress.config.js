const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress-tests/acceptance-tests/fixtures',
  screenshotsFolder: 'cypress-tests/acceptance-tests/screenshots',
  videosFolder: 'cypress-tests/acceptance-tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  video: true,
  e2e: {
    specPattern: '**/*.feature',
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config)
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )
      return config
    },
    baseUrl: 'https://digital-prison-reporting-mi-ui-dev.hmpps.service.justice.gov.uk/',
    supportFile: 'cypress-tests/acceptance-tests/support/index.ts',
  },
})
