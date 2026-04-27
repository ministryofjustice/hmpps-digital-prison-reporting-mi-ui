import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

/**
 * Prison (DPS) stub — black HMPPS bar.
 */
const DPS_HEADER_HTML = `
<header class="hmpps-header" data-qa="dps-header" role="banner">
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

/**
 * PDS header stub — matches MoJ Design System markup (probation-common-header).
 * https://design-patterns.service.justice.gov.uk/probation/components/pds-header/
 * Keep behaviourally aligned with server/views/partials/header-probation.njk (pdsHeader macro).
 */
const PDS_HEADER_HTML = `
<div data-qa="pds-header">
<header class="probation-common-header govuk-!-display-none-print" role="banner" data-module="pds-header">
  <div class="govuk-clearfix">
    <div class="govuk-width-container probation-common-header__title">
      <a class="probation-common-header__link probation-common-header__title__organisation-name" href="/">
        <img src="/assets/images/crest.svg" alt="" class="probation-common-header__logo" width="40" height="40" />
        Probation Digital Services
      </a>
    </div>
    <nav aria-labelledby="probation-common-navigation-heading">
      <h2 id="probation-common-navigation-heading" class="govuk-visually-hidden">Navigation menu</h2>
      <div class="govuk-width-container probation-common-header__button-width-container">
        <div class="probation-common-header__button-container">
          <div class="probation-common-header__navigation">
            <div class="probation-common-header__navigation__item">
              <button class="probation-common-header__menu-toggle probation-common-header__user-menu-toggle" aria-controls="probation-common-header-user-menu" aria-expanded="false" type="button" hidden="hidden">
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span>
                    <span class="probation-common-header__menu-toggle-label">Account</span>
                    <span data-qa="probation-common-header-user-name" class="probation-common-header__menu-toggle-label">J. Smith</span>
                  </span>
                </span>
              </button>
              <ul id="probation-common-header-user-menu" class="govuk-list probation-common-header__user-menu" hidden="hidden">
                <li><a class="probation-common-header__submenu-link" href="/account-details">Your account</a></li>
                <li><a class="probation-common-header__submenu-link" href="/sign-out">Sign out</a></li>
              </ul>
              <div class="probation-common-header__icon-link-wrapper probation-common-header__user-menu-link">
                <a class="probation-common-header__link" href="/account-details" data-test="manage-account-link" target="_blank" rel="noopener noreferrer">
                  <span>
                    <span class="govuk-visually-hidden">Manage your account or sign out</span>
                    <span>J. Smith</span>
                  </span>
                </a>
              </div>
            </div>
            <div class="probation-common-header__navigation__item">
              <button data-qa="probation-common-header__menu-toggle" class="probation-common-header__menu-toggle probation-common-header__services-menu-toggle" aria-controls="probation-common-header-services-menu" aria-expanded="false" type="button" hidden="hidden">
                <span><span class="govuk-!-font-size-19 govuk-!-font-weight-bold">Menu</span></span>
              </button>
              <div class="probation-common-header__icon-link-wrapper probation-common-header__services-menu-link">
                <a class="probation-common-header__link" href="/"><span><span class="govuk-visually-hidden">Services</span><span>Menu</span></span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="probation-common-header-services-menu" class="probation-common-header__pushdown-menu probation-common-header__services-menu" hidden="hidden">
        <div class="govuk-width-container"><h3 class="govuk-heading-m">Services</h3></div>
      </div>
    </nav>
  </div>
</header>
</div>`.trim()

const DPS_FOOTER_HTML = `
<footer class="govuk-footer govuk-!-display-none-print" data-qa="dps-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item">Prison Digital Services</div>
    </div>
  </div>
</footer>`

const PDS_FOOTER_HTML = `
<footer class="probation-common-footer govuk-!-display-none-print" data-qa="pds-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="probation-common-footer__support-links">
          <h2 class="govuk-visually-hidden">Support links</h2>
          <ul class="probation-common-footer__inline-list">
            <li class="probation-common-footer__inline-list-item">
              <a class="probation-common-footer__link" href="/accessibility">Accessibility</a>
            </li>
          </ul>
        </div>
      </div>
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
