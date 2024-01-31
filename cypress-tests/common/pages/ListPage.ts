import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import Page, { PageElement } from './page'

export default class ListPage extends Page {
  fullDefinition: components['schemas']['SingleVariantReportDefinition']

  constructor(fullDefinition: components['schemas']['SingleVariantReportDefinition']) {
    super(fullDefinition.variant.name)

    this.fullDefinition = fullDefinition
  }

  showFilterButton = (): PageElement => cy.get(`.filter-summary-show-filter-button`)

  resetFiltersButton = (): PageElement => cy.get(`.moj-button-menu__wrapper .govuk-button--secondary`).first()

  pagingLink = (): PageElement => cy.get('.govuk-pagination__link').first()

  pageSizeSelector = (): PageElement => cy.get('#pageSize')

  filterPanel = (): PageElement => cy.get('.moj-filter')

  filter = (id): PageElement => cy.get(`#filters\\.${id}`)

  dataTable = (): PageElement => cy.get('table')

  applyFiltersButton = (): PageElement => cy.get(`[data-apply-form-to-querystring='true']`)

  selectedFilterButton = (): PageElement => cy.get('.filter-summary-remove-button').first()

  selectedFilterButtons = (): PageElement => cy.get('.filter-summary-remove-button')

  unsortedSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort='none']`).first()

  currentSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort!='none']`).first()
}
