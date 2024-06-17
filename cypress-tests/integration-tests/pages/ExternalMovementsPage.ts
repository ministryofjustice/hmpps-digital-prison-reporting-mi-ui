import Page, { PageElement } from '../../common/pages/page'

export default class ExternalMovementsPage extends Page {
  constructor() {
    super('External Movements')
  }

  externalMovementsLastMonthCard = (): PageElement =>
    cy.get('.card__link[href^="/async-reports/external-movements/last-month/request"]')
}
