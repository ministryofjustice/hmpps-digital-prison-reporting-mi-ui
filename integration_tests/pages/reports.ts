import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Reports')
  }

  externalMovementsCard = (): PageElement => cy.get('.card__link[href="#external-movements"]')

  establishmentsCard = (): PageElement => cy.get('.card__link[href="#establishments"]')
}
