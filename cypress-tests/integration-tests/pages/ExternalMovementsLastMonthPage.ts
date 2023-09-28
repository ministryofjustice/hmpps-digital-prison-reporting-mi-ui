import Page, { PageElement } from '../../common/pages/page'

export default class ExternalMovementsLastMonthPage extends Page {
  constructor() {
    super('Last month')
  }

  dataTable = (): PageElement => cy.get('.govuk-table')

  paging = (): PageElement => cy.get('.govuk-pagination')
}
