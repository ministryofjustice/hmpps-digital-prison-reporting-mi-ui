import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Home')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  reportLinks = (): PageElement => cy.get('a[href^="/async-reports"]')

  reportTable = (): PageElement => cy.get('.dpr-search-table')
}
