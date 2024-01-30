import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import Page, { PageElement } from './page'

export default class VariantsPage extends Page {
  reportDefinition: components['schemas']['ReportDefinitionSummary']

  constructor(reportDefinition) {
    super(reportDefinition.name)
    this.reportDefinition = reportDefinition
  }

  card = (variantId: string): PageElement =>
    cy.get(`.card__link[href^="/reports/${this.reportDefinition.id}/${variantId}"]`)
}
