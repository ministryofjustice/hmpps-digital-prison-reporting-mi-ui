const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')

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
    specPattern: '**/*.acceptance.cy.ts',
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      on('file:preprocessor', createBundler())
      return config
    },
    baseUrl: 'https://digital-prison-reporting-mi-ui-dev.hmpps.service.justice.gov.uk/',
    supportFile: 'cypress-tests/acceptance-tests/support/index.ts',
  },
  env: {
    USERNAME: 'Populated from CYPRESS_USERNAME env var',
    PASSWORD: 'Populated from CYPRESS_PASSWORD env var',
    SIGN_IN_URL: 'sign-in-dev.hmpps.service.justice.gov.uk',
    API_BASE_URL: 'https://digital-prison-reporting-mi-dev.hmpps.service.justice.gov.uk',
  },
})
