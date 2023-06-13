import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Home')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  reportsCard = (): PageElement => cy.get('a[href="/reports"]')
}
