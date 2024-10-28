import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Digital Prison Reporting')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  reportLinks = (): PageElement => cy.get('a[href^="/async/report"]')

  reportTable = (): PageElement => cy.get('.dpr-search-table')
}
