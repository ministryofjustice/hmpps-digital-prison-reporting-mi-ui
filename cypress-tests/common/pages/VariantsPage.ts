import Page, { PageElement } from './page'
import { components } from '../../../server/types/api'

export default class VariantsPage extends Page {
  reportDefinition: components['schemas']['ReportDefinition']

  constructor(reportDefinition) {
    super(reportDefinition.name)
    this.reportDefinition = reportDefinition
  }

  card = (variantId: string): PageElement =>
    cy.get(`.card__link[href^="/reports/${this.reportDefinition.id}/${variantId}"]`)
}
