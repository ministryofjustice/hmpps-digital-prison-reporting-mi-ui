import { defineConfig } from 'cypress'
import { resetStubs } from './cypress-tests/integration-tests/mockApis/wiremock'
import auth from './cypress-tests/integration-tests/mockApis/auth'
import tokenVerification from './cypress-tests/integration-tests/mockApis/tokenVerification'
import reports from './cypress-tests/integration-tests/mockApis/reports'

export default defineConfig({
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
