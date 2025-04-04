import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as dprFrontend from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/all.mjs'

govukFrontend.initAll()
mojFrontend.initAll()
dprFrontend.default()
