import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Reports')
  }

  externalMovementsCard = (): PageElement => cy.get('a.card__link[href=#]')
}
