import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

/**
 * Injected component HTML that mirrors static header.njk (hmpps-header BEM) so
 * application.css / _header-bar.scss styles apply. Real APIs also return
 * component CSS URLs; the stub still omits them and relies on local SCSS.
 */
const buildHmppsStyleComponentHeader = (dataQa: 'dps-header' | 'pds-header'): string => `
<header class="hmpps-header" data-qa="${dataQa}" role="banner">
  <div class="hmpps-header__container">
    <div class="hmpps-header__title">
      <a class="hmpps-header__link hmpps-header__title__organisation-name" href="/">
        <img src="/assets/images/crest.svg" class="hmpps-header__logo" alt="" width="40" height="40" />
        HMPPS
      </a>
      <a class="hmpps-header__link hmpps-header__title__service-name" href="/">Digital Prison Reporting</a>
    </div>
    <nav aria-label="Account navigation">
      <ul class="hmpps-header__navigation">
        <li class="hmpps-header__navigation__item">
          <a data-qa="manageDetails" class="hmpps-header__link" href="/account-details" data-test="manage-account-link" target="_blank" rel="noopener noreferrer">
            <span data-qa="header-user-name">J. Smith</span>
            <span class="hmpps-header__link__sub-text">Manage your details</span>
          </a>
        </li>
        <li class="hmpps-header__navigation__item">
          <a data-qa="signOut" class="hmpps-header__link" href="/sign-out">Sign out</a>
        </li>
      </ul>
    </nav>
  </div>
</header>`.trim()

const DPS_HEADER_HTML = buildHmppsStyleComponentHeader('dps-header')
const PDS_HEADER_HTML = buildHmppsStyleComponentHeader('pds-header')

const DPS_FOOTER_HTML = `
<footer class="govuk-footer govuk-!-display-none-print" data-qa="dps-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item">Prison Digital Services</div>
    </div>
  </div>
</footer>`

const PDS_FOOTER_HTML = `
<footer class="govuk-footer govuk-!-display-none-print" data-qa="pds-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item">Probation Digital Services</div>
    </div>
  </div>
</footer>`

const stubPrisonComponents = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components\\?.*',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        header: { html: DPS_HEADER_HTML, css: [], javascript: [] },
        footer: { html: DPS_FOOTER_HTML, css: [], javascript: [] },
      },
    },
  })

const stubProbationComponents = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/api/components\\?.*',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        header: { html: PDS_HEADER_HTML, css: [], javascript: [] },
        footer: { html: PDS_FOOTER_HTML, css: [], javascript: [] },
      },
    },
  })

export default {
  stubPrisonComponents,
  stubProbationComponents,
}
