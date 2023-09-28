const { defineConfig } = require('cypress')
const { resetStubs } = require('./mockApis/wiremock')
const auth = require('./mockApis/auth')
const tokenVerification = require('./mockApis/tokenVerification')
const reports = require('./mockApis/reports')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress-tests/integration-tests/fixtures',
  screenshotsFolder: 'cypress-tests/integration-tests/screenshots',
  videosFolder: 'cypress-tests/integration-tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  video: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...reports,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'cypress-tests/integration-tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress-tests/integration-tests/support/index.ts',
  },
})
