import Page, { PageElement } from './page'

export default class VariantsPage extends Page {
  reportId: string

  constructor(reportId, title) {
    super(title)
    this.reportId = reportId
  }

  card = (variantId: string): PageElement => cy.get(`.card__link[href^="/reports/${this.reportId}/${variantId}"]`)
}
