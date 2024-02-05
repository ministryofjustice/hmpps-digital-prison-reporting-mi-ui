import Page, { PageElement } from './page'

export default class ReportsPage extends Page {
  constructor() {
    super('Reports')
  }

  externalMovementsCard = (): PageElement => cy.get('.card__link[href="/reports/external-movements"]')

  card = (): PageElement => cy.get(`.card__link`).first()
}
