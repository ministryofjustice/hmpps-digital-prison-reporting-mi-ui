import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import Page, { PageElement } from './page'

export default class ListPage extends Page {
  fullDefinition: components['schemas']['SingleVariantReportDefinition']

  constructor(fullDefinition: components['schemas']['SingleVariantReportDefinition']) {
    super(fullDefinition.variant.name)

    this.fullDefinition = fullDefinition
  }

  showFilterButton = (): PageElement => cy.get(`#Filters-accordion-button`)

  resetFiltersButton = (): PageElement =>
    cy.get(`.filter-actions-buttons .govuk-button.govuk-button--secondary`).first()

  pagingLink = (): PageElement => cy.get('.govuk-pagination__link').first()

  pageSizeSelector = (): PageElement => cy.get('#pageSize')

  filterPanel = (): PageElement => cy.get('#filters-accordion-button .govuk-details__text')

  filter = (id): PageElement => cy.get(`#filters\\.${id}`)

  dataTable = (): PageElement => cy.get('table')

  applyFiltersButton = (): PageElement => cy.get(`[data-apply-form-to-querystring='true']`)

  selectedFilterButton = (): PageElement =>
    cy.get(`.selected-accordion-button .accordion-summary-remove-button`).first()

  selectedFilterButtons = (): PageElement => cy.get('.filter-summary-remove-button')

  unsortedSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort='none']`).first()

  currentSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort!='none']`).first()
}
