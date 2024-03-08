import Page, { PageElement } from '../../common/pages/page'

export default class VariantsPage extends Page {
  constructor() {
    super('Test Report')
  }

  card = (): PageElement => cy.get(`.card__link`).first()

  cardGroup = (): PageElement => cy.get(`.dpr-card-group`)
}
