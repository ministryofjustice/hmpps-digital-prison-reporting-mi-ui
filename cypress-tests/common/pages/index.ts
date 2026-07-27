import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    const isProbation = Cypress.config('baseUrl') === Cypress.env('probationBaseUrl')
    super(isProbation ? 'Digital Probation Reporting' : 'Digital Prison Reporting')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  reportLinks = (): PageElement => cy.get('a[href^="/dpr/request-report"]')

  reportTable = (): PageElement => cy.get('.dpr-search-table')
}
