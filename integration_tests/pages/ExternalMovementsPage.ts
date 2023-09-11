import Page, { PageElement } from './page'

export default class ExternalMovementsPage extends Page {
  constructor() {
    super('External Movements')
  }

  externalMovementsLastMonthCard = (): PageElement =>
    cy.get('.card__link[href^="/reports/external-movements/last-month"]')
}
