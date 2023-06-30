import Page, { PageElement } from './page'

export default class ExternalMovementsPage extends Page {
  constructor() {
    super('External movements')
  }

  dataTable = (): PageElement => cy.get('.govuk-table')

  paging = (): PageElement => cy.get('.govuk-pagination')
}
