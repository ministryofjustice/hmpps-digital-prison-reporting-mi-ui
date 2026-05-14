import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as dprFrontend from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/all'

const scopeGovMojToMain =
  typeof window !== 'undefined' &&
  /** @type {{ __SCOPE_GOV_MOJ_INIT_TO_MAIN__?: boolean }} */ (window).__SCOPE_GOV_MOJ_INIT_TO_MAIN__ === true
const mainContent = document.getElementById('main-content')

if (scopeGovMojToMain && mainContent) {
  govukFrontend.initAll({ scope: mainContent })
  mojFrontend.initAll({ scope: mainContent })
} else {
  govukFrontend.initAll()
  mojFrontend.initAll()
}

dprFrontend.initAll()
